// API 엔드포인트
const MENU_SERVICE_URL = 'http://localhost:8000/api/menus';
const STOCK_SERVICE_URL = 'http://localhost:8000/api/stocks';
const ORDER_SERVICE_URL = 'http://localhost:8000/api/orders';

// 전역 변수
let menuDataStore = [];
let cart = []; // { menuId, name, quantity, price, totalPrice, selectedOptions, optionNames }
let currentSelectedMenuId = null; // 모달에서 사용할 현재 메뉴 ID

document.addEventListener('DOMContentLoaded', () => {
    loadMenuList();

    // [주문하기] 버튼
    document.getElementById('place-order-btn').addEventListener('click', handlePlaceOrder);

    // [모달 닫기] 관련 이벤트
    const modal = document.getElementById('option-modal');
    const closeBtn = document.querySelector('.close-btn');

    // X 버튼 누르면 닫기
    closeBtn.onclick = () => { modal.style.display = 'none'; };

    // 모달 바깥 배경 누르면 닫기
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // [장바구니 담기] 버튼 (모달 내부)
    document.getElementById('add-cart-confirm-btn').addEventListener('click', handleAddCartConfirm);
});

// 1. 메뉴 목록 로드 (API 호출)
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

        // 메뉴 데이터와 재고 데이터를 합침
        menuDataStore = menus.map(menu => ({
            ...menu,
            stock: stockMap.get(menu.stockId) || 0
        }));

        // 테이블 그리기
        const tableBody = document.querySelector('#menu-table tbody');
        tableBody.innerHTML = '';
        menuDataStore.forEach(item => {
            const row = `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.description || ''}</td>
                    <td>${item.price.toLocaleString()}원</td>
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

        // 버튼에 이벤트 리스너 연결
        document.querySelectorAll('.add-cart-btn').forEach(button => {
            button.addEventListener('click', handleShowOptionModal);
        });

    } catch (error) {
        console.error('메뉴 로딩 실패:', error);
    }
}

// 2. [Step 1] 옵션 선택 모달 띄우기
async function handleShowOptionModal(event) {
    const menuId = event.target.dataset.menuId;
    currentSelectedMenuId = menuId; // 현재 선택한 메뉴 ID 저장

    const menuItem = menuDataStore.find(item => item.id == menuId);

    // 모달 제목 설정
    document.getElementById('modal-menu-name').textContent = menuItem.name;

    const optionsContainer = document.getElementById('modal-options-container');
    optionsContainer.innerHTML = ''; // 초기화

    const modal = document.getElementById('option-modal');
    modal.style.display = 'block'; // 모달 보이기

    // 옵션 데이터 확인
    const optionGroups = menuItem.optionGroups;

    // 옵션이 없는 경우 처리
    if (!optionGroups || optionGroups.length === 0) {
        optionsContainer.innerHTML = '<p>선택 가능한 옵션이 없습니다. (기본 주문)</p>';
        return;
    }

    // 옵션 그룹별로 라디오 버튼 생성
    optionGroups.forEach(group => {
        let groupHtml = `<h5>${group.name}</h5><div class="mb-3">`;

        group.options.forEach((option, index) => {
            // 첫 번째 옵션을 기본 선택(checked)으로 설정
            const isChecked = index === 0 ? 'checked' : '';

            groupHtml += `
                <div class="form-check">
                    <input class="form-check-input" type="radio" 
                           name="option-group-${group.id}" 
                           id="option-${option.id}" 
                           value="${option.id}"
                           data-name="${option.name}"
                           data-price="${option.additionalPrice}"
                           ${isChecked}>
                    <label class="form-check-label" for="option-${option.id}">
                        ${option.name} (+${option.additionalPrice}원)
                    </label>
                </div>
            `;
        });
        groupHtml += `</div>`;
        optionsContainer.innerHTML += groupHtml;
    });
}

// 3. [Step 2] 옵션 선택 완료 후 장바구니에 진짜 담기
function handleAddCartConfirm() {
    const menuId = currentSelectedMenuId;
    const menuItem = menuDataStore.find(item => item.id == menuId);

    // 수량 가져오기
    const quantityInput = document.getElementById(`quantity-${menuId}`);
    const quantity = parseInt(quantityInput.value);

    // 유효성 검사
    if (quantity <= 0) {
        alert("수량은 1 이상이어야 합니다.");
        return;
    }
    if (quantity > menuItem.stock) {
        alert(`재고가 부족합니다. (최대 ${menuItem.stock}개)`);
        return;
    }

    // 선택된 옵션 정보 수집
    const selectedInputs = document.querySelectorAll('#modal-options-container input[type="radio"]:checked');

    let selectedOptions = [];
    let optionTotalPrice = 0;
    let optionNames = [];

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

    // 가격 계산 (기본가 + 옵션가)
    const itemBasePrice = parseFloat(menuItem.price);
    const finalPricePerItem = itemBasePrice + optionTotalPrice;
    const itemTotalPrice = finalPricePerItem * quantity;

    // 장바구니 배열에 추가
    cart.push({
        menuId: menuItem.id,
        name: menuItem.name,
        quantity: quantity,
        price: finalPricePerItem, // 1개당 최종 가격
        totalPrice: itemTotalPrice, // 총 합계
        selectedOptions: selectedOptions, // 백엔드로 보낼 옵션 ID들
        optionNames: optionNames.join(', ') // 화면에 보여줄 텍스트
    });

    alert(`${menuItem.name}이(가) 장바구니에 담겼습니다.`);

    // 모달 닫기 및 초기화
    document.getElementById('option-modal').style.display = 'none';
    currentSelectedMenuId = null;

    // 장바구니 UI 갱신
    renderCart();
}

// 4. 장바구니 UI 그리기
function renderCart() {
    const cartList = document.getElementById('cart-list');
    const totalPriceEl = document.getElementById('total-price');
    cartList.innerHTML = '';

    let grandTotal = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        // 옵션이 있으면 작게 표시
        const optionText = item.optionNames ? `<br><small class="text-muted">옵션: ${item.optionNames}</small>` : '';

        li.innerHTML = `
            <b>${item.name}</b> ${optionText}
            <br>
            ${item.quantity}개 x ${item.price.toLocaleString()}원 = 
            <span class="text-primary fw-bold">${item.totalPrice.toLocaleString()}원</span>
            <button class="cart-delete-btn btn btn-sm btn-danger ms-2" data-index="${index}">삭제</button>
        `;
        li.className = "list-group-item"; // 부트스트랩 스타일
        cartList.appendChild(li);

        grandTotal += item.totalPrice;
    });

    totalPriceEl.textContent = grandTotal.toLocaleString();

    // 삭제 버튼 이벤트 연결
    document.querySelectorAll('.cart-delete-btn').forEach(button => {
        button.addEventListener('click', handleRemoveFromCart);
    });
}

// 5. 장바구니 항목 삭제
function handleRemoveFromCart(event) {
    const index = parseInt(event.target.dataset.index);
    cart.splice(index, 1);
    renderCart();
}

// 6. 최종 주문하기 (백엔드 전송)
async function handlePlaceOrder() {
    const customerName = document.getElementById('customer-name').value;
    const statusDiv = document.getElementById('order-status');
    statusDiv.textContent = '주문 처리 중...';
    statusDiv.className = ''; // 클래스 초기화

    if (!customerName) {
        alert("주문자명을 입력하세요.");
        return;
    }
    if (cart.length === 0) {
        alert("장바구니가 비어있습니다.");
        return;
    }

    // 백엔드(OrderRequest) 형식에 맞게 변환
    const orderRequest = {
        customerName: customerName,
        items: cart.map(item => ({
            menuId: item.menuId,
            quantity: item.quantity,
            // 여기서 실제로 선택한 옵션 ID들을 보냅니다 (하드코딩 X)
            optionIds: item.selectedOptions.map(opt => opt.id)
        }))
    };

    console.log("전송 데이터:", JSON.stringify(orderRequest));

    try {
        const response = await fetch(ORDER_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderRequest)
        });

        if (response.ok) {
            const result = await response.json();
            statusDiv.textContent = `주문 성공! (ID: ${result.id})`;
            statusDiv.className = 'text-success fw-bold'; // 성공 스타일

            // 장바구니 비우기 및 재고 갱신
            cart = [];
            renderCart();
            loadMenuList();
        } else {
            const errorText = await response.text();
            throw new Error(errorText || '주문 실패');
        }

    } catch (error) {
        console.error('주문 에러:', error);
        statusDiv.textContent = `주문 실패: ${error.message}`;
        statusDiv.className = 'text-danger fw-bold'; // 실패 스타일
    }
}