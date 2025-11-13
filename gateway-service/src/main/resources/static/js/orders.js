// API 엔드포인트
const MENU_SERVICE_URL = 'http://localhost:8000/api/menus';
const STOCK_SERVICE_URL = 'http://localhost:8000/api/stocks';
const ORDER_SERVICE_URL = 'http://localhost:8000/api/orders';

// 전역 변수
let menuDataStore = [];
let cart = []; // { menuId, name, quantity, price, totalPrice, selectedOptions }
let currentSelectedMenuId = null; // 모달에서 사용할 현재 메뉴 ID

document.addEventListener('DOMContentLoaded', () => {
    loadMenuList();

    // 주문하기 버튼
    document.getElementById('place-order-btn').addEventListener('click', handlePlaceOrder);

    // 모달 관련 이벤트 바인딩
    const modal = document.getElementById('option-modal');
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.onclick = () => { modal.style.display = 'none'; };
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // 모달의 '장바구니 담기' 버튼
    document.getElementById('add-cart-confirm-btn').addEventListener('click', handleAddCartConfirm);
});

// 1. 페이지 로드 시 메뉴+재고 목록 가져오기 (동일)
async function loadMenuList() {
    try {
        const [menuResponse, stockResponse] = await Promise.all([
            fetch(MENU_SERVICE_URL),
            fetch(STOCK_SERVICE_URL)
        ]);
        if (!menuResponse.ok) throw new Error('메뉴 로딩 실패');
        if (!stockResponse.ok) throw new Error('재고 로딩 실패');

        const menus = await menuResponse.json();
        const stocks = await stockResponse.json();
        const stockMap = new Map(stocks.map(stock => [stock.id, stock.stock]));

        menuDataStore = menus.map(menu => ({
            ...menu,
            stock: stockMap.get(menu.stockId) || 0
        }));

        const tableBody = document.querySelector('#menu-table tbody');
        tableBody.innerHTML = '';
        menuDataStore.forEach(item => {
            const row = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
                    <td>${item.price}원</td>
                    <td>${item.stock}개</td>
                    <td>
                        <input type="number" class="quantity-input" id="quantity-${item.id}" value="1" min="1" max="${item.stock}">
                    </td>
                    <td>
                        <button class="add-cart-btn" data-menu-id="${item.id}" ${item.stock <= 0 ? 'disabled' : ''}>
                            ${item.stock <= 0 ? '재고 없음' : '카트 담기'}
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // '카트 담기' 버튼들에 이벤트 리스너 추가 (로직 변경됨)
        document.querySelectorAll('.add-cart-btn').forEach(button => {
            button.addEventListener('click', handleShowOptionModal); // 2. '카트 담기' -> 모달 띄우기로 변경
        });

    } catch (error) {
        console.error('메뉴 로딩 실패:', error);
    }
}

// 2. '카트 담기' 버튼 클릭 시 -> 모달 띄우기 (신규 함수)
async function handleShowOptionModal(event) {
    const menuId = event.target.dataset.menuId;
    currentSelectedMenuId = menuId; // 전역 변수에 현재 메뉴 ID 저장

    const menuItem = menuDataStore.find(item => item.id == menuId);

    // 모달에 메뉴 이름 표시
    document.getElementById('modal-menu-name').textContent = menuItem.name;

    const optionsContainer = document.getElementById('modal-options-container');
    optionsContainer.innerHTML = '<h4>옵션 로딩 중...</h4>';

    // 모달 띄우기
    const modal = document.getElementById('option-modal');
    modal.style.display = 'block';

    try {
        // GET /api/menus 응답 (menuDataStore)에 이미 옵션 정보가 포함되어 있음
        const selectedMenu = menuDataStore.find(m => m.id == menuId);
        const optionGroups = selectedMenu.optionGroups; // (e.g., [{id: 2, name: "온도", options: [...]}, ...])

        if (!optionGroups || optionGroups.length === 0) {
            optionsContainer.innerHTML = '<h4>선택 가능한 옵션이 없습니다.</h4>';
            return;
        }

        // 옵션 그룹(온도, 사이즈)을 HTML로 변환
        optionsContainer.innerHTML = '';
        optionGroups.forEach(group => {
            let groupHtml = `<h3>${group.name}</h3><div>`;
            // (가정: 모든 옵션 그룹은 단일 선택(radio)이라고 가정)

            group.options.forEach(option => {
                groupHtml += `
                    <p>
                        <input type="radio" 
                               name="option-group-${group.id}" 
                               id="option-${option.id}" 
                               value="${option.id}"
                               data-name="${option.name}"
                               data-price="${option.additionalPrice}">
                        <label for="option-${option.id}">
                            ${option.name} (+${option.additionalPrice}원)
                        </label>
                    </p>
                `;
            });
            groupHtml += `</div>`;
            optionsContainer.innerHTML += groupHtml;
        });

        // 각 그룹의 첫 번째 옵션을 기본으로 선택
        optionGroups.forEach(group => {
            if (group.options.length > 0) {
                document.getElementById(`option-${group.options[0].id}`).checked = true;
            }
        });

    } catch (error) {
        console.error("옵션 로딩 실패:", error);
        optionsContainer.innerHTML = '<h4>옵션 로딩에 실패했습니다.</h4>';
    }
}

// 3. 모달의 '장바구니 담기' 버튼 클릭 시 (신규 함수)
function handleAddCartConfirm() {
    const menuId = currentSelectedMenuId;
    const menuItem = menuDataStore.find(item => item.id == menuId);
    const quantity = parseInt(document.getElementById(`quantity-${menuId}`).value);

    // 모달에서 선택된 모든 옵션(radio)을 수집
    const selectedInputs = document.querySelectorAll('#modal-options-container input[type="radio"]:checked');

    let selectedOptions = []; // 선택된 옵션 객체 배열
    let optionTotalPrice = 0; // 옵션 추가금 합계
    let optionNames = []; // UI 표시용 옵션 이름

    selectedInputs.forEach(input => {
        const price = parseFloat(input.dataset.price);
        selectedOptions.push({
            id: parseInt(input.value),
            name: input.dataset.name,
            price: price
        });
        optionTotalPrice += price;
        optionNames.push(input.dataset.name);
    });

    // 유효성 검사
    if (quantity <= 0) {
        alert("수량은 1 이상이어야 합니다.");
        return;
    }
    const maxStock = menuItem.stock;
    // (재고가 0이어도 담기는 현상 수정)
    if (quantity > maxStock) {
        alert(`재고가 부족합니다. (최대 ${maxStock}개)`);
        return;
    }

    // 최종 가격 (기본가 + 옵션가) * 수량
    const itemBasePrice = parseFloat(menuItem.price);
    const finalPricePerItem = itemBasePrice + optionTotalPrice; // 1개당 최종 가격
    const itemTotalPrice = finalPricePerItem * quantity; // 수량 포함 가격

    // 카트에 추가 (★ 이제 옵션 정보를 포함)
    cart.push({
        menuId: menuItem.id,
        name: menuItem.name,
        quantity: quantity,
        price: finalPricePerItem, // (기본가 + 옵션가)
        totalPrice: itemTotalPrice, // (수량 * (기본가 + 옵션가))
        selectedOptions: selectedOptions, // (선택된 옵션 객체 배열)
        optionNames: optionNames.join(', ') // (UI용, e.g., "Ice, Size Up")
    });

    alert(`${menuItem.name} (${optionNames.join(', ')}) ${quantity}개를 장바구니에 담았습니다.`);

    // 모달 닫기
    document.getElementById('option-modal').style.display = 'none';
    currentSelectedMenuId = null;

    // 장바구니 UI 새로고침
    renderCart();
}


// 4. 장바구니 UI 업데이트 (수정됨)
function renderCart() {
    const cartList = document.getElementById('cart-list');
    const totalPriceEl = document.getElementById('total-price');
    cartList.innerHTML = '';

    let grandTotal = 0; // 총 주문 금액

    cart.forEach((item, index) => { // index를 받아와 삭제 버튼에 사용
        const li = document.createElement('li');

        // 옵션 이름 표시 추가
        const optionText = item.optionNames ? `<small>(${item.optionNames})</small>` : '';

        li.innerHTML = `
            [${item.name}] ${optionText}
            <br>
            ${item.quantity}개 x ${item.price.toLocaleString()}원 = 
            <b>${item.totalPrice.toLocaleString()}원</b>
            <button class="cart-delete-btn" data-index="${index}" style="background-color: #dc3545; font-size: 0.8em;">삭제</button>
        `;
        cartList.appendChild(li);

        grandTotal += item.totalPrice; // 각 항목의 총합을 더함
    });

    totalPriceEl.textContent = grandTotal.toLocaleString();

    // 동적으로 생성된 '삭제' 버튼들에 이벤트 리스너 추가
    document.querySelectorAll('.cart-delete-btn').forEach(button => {
        button.addEventListener('click', handleRemoveFromCart);
    });
}

// 5. 장바구니 삭제 (신규 함수)
function handleRemoveFromCart(event) {
    const indexToRemove = parseInt(event.target.dataset.index);
    cart.splice(indexToRemove, 1); // 배열에서 해당 항목 제거
    renderCart(); // 장바구니 다시 그리기
}

// 6. '주문하기' 버튼 클릭 시 (수정됨 - 하드코딩 제거)
async function handlePlaceOrder() {
    const customerName = document.getElementById('customer-name').value;
    const statusDiv = document.getElementById('order-status');
    statusDiv.textContent = '주문 처리 중...';

    if (!customerName) {
        alert("주문자명을 입력하세요.");
        statusDiv.textContent = '';
        return;
    }
    if (cart.length === 0) {
        alert("장바구니가 비어있습니다.");
        statusDiv.textContent = '';
        return;
    }

    // order-service가 요구하는 DTO 형식으로 변환 (★ 하드코딩 제거)
    const orderRequest = {
        customerName: customerName,
        items: cart.map(item => ({
            menuId: item.menuId,
            quantity: item.quantity,
            // (이제 cart에 저장된 실제 옵션 ID를 사용)
            optionIds: item.selectedOptions.map(opt => opt.id)
        }))
    };

    // 디버깅 테스트
    console.log("서버로 전송할 JSON:", JSON.stringify(orderRequest));

    try {
        const response = await fetch(ORDER_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderRequest)
        });

        if (response.ok) {
            const result = await response.json();
            statusDiv.style.color = 'green';
            statusDiv.textContent = `주문 성공! (주문 ID: ${result.id}, 상태: ${result.status})`;

            // 주문 성공 시 초기화
            cart = [];
            renderCart();
            loadMenuList(); // 재고가 차감됐으므로 메뉴 목록 새로고침
        } else {
            const errorText = await response.text();
            throw new Error(errorText || '주문 실패');
        }

    } catch (error) {
        console.error('주문 처리 에러:', error);
        statusDiv.style.color = 'red';
        statusDiv.textContent = `주문 실패: ${error.message}`;
    }
}