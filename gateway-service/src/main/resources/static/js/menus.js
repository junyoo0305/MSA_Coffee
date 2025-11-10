// API 엔드포인트
const MENU_SERVICE_URL = 'http://localhost:8002/api/menus';
const STOCK_SERVICE_URL = 'http://localhost:8003/api/stocks';

document.addEventListener('DOMContentLoaded', () => {
    loadMenuAndStockList();

    const createMenuForm = document.getElementById('create-menu-form');
    createMenuForm.addEventListener('submit', handleCreateMenu);
});

// 페이지 로드 시 메뉴와 재고 목록을 가져와 테이블을 채웁니다.
async function loadMenuAndStockList() {
    try {
        // 1. 메뉴 서비스에서 모든 메뉴를 가져옵니다.
        const menuResponse = await fetch(MENU_SERVICE_URL);
        const menus = await menuResponse.json();

        // 2. 스톡 서비스에서 모든 재고 정보를 가져옵니다.
        const stockResponse = await fetch(STOCK_SERVICE_URL);
        const stocks = await stockResponse.json();

        // 3. 재고 정보를 Map으로 변환 (stockId를 키로 사용)
        const stockMap = new Map(stocks.map(stock => [stock.id, stock]));

        const tableBody = document.querySelector('#menu-stock-table tbody');
        tableBody.innerHTML = ''; // 기존 목록 초기화

        // 4. 메뉴와 재고 정보를 조합하여 테이블에 그립니다.
        menus.forEach(menu => {
            const stock = stockMap.get(menu.stockId) || { stock: 'N/A', name: menu.name, description: menu.description };

            const row = `
                <tr>
                    <td>${menu.id}</td>
                    <td>${menu.name}</td>
                    <td>${menu.price}원</td>
                    <td>${menu.stockId || '없음'}</td>
                    <td>${stock.stock}</td>
                    <td><input type="number" class="stock-input" id="stock-input-${menu.stockId}" value="${stock.stock}"></td>
                    <td>
                        <button class="stock-save-btn" 
                                data-stock-id="${menu.stockId}" 
                                data-name="${menu.name}" 
                                data-description="${menu.description || ''}">
                            재고 저장
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // 5. 동적으로 생성된 '재고 저장' 버튼들에 이벤트 리스너를 추가합니다.
        document.querySelectorAll('.stock-save-btn').forEach(button => {
            button.addEventListener('click', handleUpdateStock);
        });

    } catch (error) {
        console.error('목록 로딩 실패:', error);
    }
}

// 새 상품 추가 (menu-service 호출)
async function handleCreateMenu(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;

    try {
        const response = await fetch(MENU_SERVICE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price: parseFloat(price) })
        });

        if (!response.ok) {
            throw new Error('상품 추가 실패');
        }

        alert('상품이 성공적으로 추가되었습니다. (재고 0개 생성됨)');
        document.getElementById('create-menu-form').reset();
        loadMenuAndStockList(); // 목록 새로고침

    } catch (error) {
        console.error('상품 추가 에러:', error);
        alert('상품 추가 실패: ' + error.message);
    }
}

// 재고 수정 (stock-service 호출)
async function handleUpdateStock(event) {
    const button = event.target;
    const stockId = button.dataset.stockId;

    // 이 두 값은 재고가 0일 때도 상품명/설명을 유지하기 위해 필요합니다.
    const name = button.dataset.name;
    const description = button.dataset.description;

    const newStockAmount = document.getElementById(`stock-input-${stockId}`).value;

    if (newStockAmount < 0) {
        alert("재고는 0 이상이어야 합니다.");
        return;
    }

    try {
        // stock-service의 PUT API는 name, description, stock을 모두 받습니다.
        const response = await fetch(`${STOCK_SERVICE_URL}/${stockId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                description: description,
                stock: parseInt(newStockAmount)
            })
        });

        if (!response.ok) {
            throw new Error('재고 업데이트 실패');
        }

        alert('재고가 성공적으로 업데이트되었습니다.');
        loadMenuAndStockList(); // 목록 새로고침

    } catch (error) {
        console.error('재고 업데이트 에러:', error);
        alert('재고 업데이트 실패: ' + error.message);
    }
}