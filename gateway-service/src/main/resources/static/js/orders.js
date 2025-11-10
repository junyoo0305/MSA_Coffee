// API 엔드포인트
const MENU_SERVICE_URL = 'http://localhost:8002/api/menus';
const STOCK_SERVICE_URL = 'http://localhost:8003/api/stocks';
const ORDER_SERVICE_URL = 'http://localhost:8001/api/orders';

// 전역 변수로 메뉴 데이터와 장바구니 관리
let menuDataStore = [];
let cart = []; // { menuId, name, quantity, price }

document.addEventListener('DOMContentLoaded', () => {
    loadMenuList();

    const orderButton = document.getElementById('place-order-btn');
    orderButton.addEventListener('click', handlePlaceOrder);
});

// 1. 페이지 로드 시 메뉴+재고 목록 가져오기
async function loadMenuList() {
    try {
        const [menuResponse, stockResponse] = await Promise.all([
            fetch(MENU_SERVICE_URL),
            fetch(STOCK_SERVICE_URL)
        ]);

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

        // '카트 담기' 버튼들에 이벤트 리스너 추가
        document.querySelectorAll('.add-cart-btn').forEach(button => {
            button.addEventListener('click', handleAddToCart);
        });

    } catch (error) {
        console.error('메뉴 로딩 실패:', error);
    }
}

// 2. '카트 담기' 버튼 클릭 시
function handleAddToCart(event) {
    const menuId = event.target.dataset.menuId;
    const quantityInput = document.getElementById(`quantity-${menuId}`);
    const quantity = parseInt(quantityInput.value);

    const menuItem = menuDataStore.find(item => item.id == menuId);

    // 유효성 검사
    if (quantity <= 0) {
        alert("수량은 1 이상이어야 합니다.");
        return;
    }
    if (quantity > menuItem.stock) {
        alert(`재고가 부족합니다. (최대 ${menuItem.stock}개)`);
        return;
    }

    // 이미 카트에 있는지 확인
    const existingItem = cart.find(item => item.menuId == menuId);
    if (existingItem) {
        // 이미 있으면 수량 업데이트 (재고 한도 내)
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > menuItem.stock) {
            alert(`재고가 부족합니다. (최대 ${menuItem.stock}개)`);
            existingItem.quantity = menuItem.stock;
        } else {
            existingItem.quantity = newQuantity;
        }
    } else {
        // 새로 추가
        cart.push({
            menuId: menuItem.id,
            name: menuItem.name,
            quantity: quantity,
            price: menuItem.price
        });
    }

    alert(`${menuItem.name} ${quantity}개를 장바구니에 담았습니다.`);
    renderCart();
}

// 3. 장바구니 UI 업데이트
function renderCart() {
    const cartList = document.getElementById('cart-list');
    const totalPriceEl = document.getElementById('total-price');
    cartList.innerHTML = '';

    let total = 0;

    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `[${item.name}] ${item.quantity}개 x ${item.price}원`;
        cartList.appendChild(li);
        total += item.price * item.quantity;
    });

    totalPriceEl.textContent = total.toLocaleString();
}

// 4. '주문하기' 버튼 클릭 시 (order-service 호출)
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

    // order-service가 요구하는 DTO 형식으로 변환
    const orderRequest = {
        customerName: customerName,
        items: cart.map(item => ({
            menuId: item.menuId,
            quantity: item.quantity
        }))
    };

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
            // stock-service에서 '재고 부족' 예외가 발생하면 400 Bad Request가 옴
            const errorText = await response.text();
            throw new Error(errorText || '주문 실패');
        }

    } catch (error) {
        console.error('주문 처리 에러:', error);
        statusDiv.style.color = 'red';
        statusDiv.textContent = `주문 실패: ${error.message}`;
    }
}