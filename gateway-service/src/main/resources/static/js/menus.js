// API 엔드포인트 (게이트웨이 8000번 포트로 수정)
const MENU_SERVICE_URL = 'http://localhost:8000/api/menus';
// const STOCK_SERVICE_URL = ...; // (제거) 재고 서비스 호출 제거

document.addEventListener('DOMContentLoaded', () => {
    // (수정) 함수 이름 변경: loadMenuAndStockList -> loadMenuList
    loadMenuList();

    const createMenuForm = document.getElementById('create-menu-form');
    createMenuForm.addEventListener('submit', handleCreateMenu);
});

// (수정) loadMenuList: 재고 관련 로직 모두 제거
async function loadMenuList() {
    try {
        // 1. 메뉴 서비스에서 모든 메뉴를 가져옵니다.
        const menuResponse = await fetch(MENU_SERVICE_URL);
        if (!menuResponse.ok) throw new Error('메뉴 로딩 실패');
        const menus = await menuResponse.json();

        // 2. (제거) 스톡 서비스에서 재고 정보 가져오는 로직 전체 삭제

        // 3. (제거) 재고 정보 Map 변환 로직 삭제

        const tableBody = document.querySelector('#menu-stock-table tbody');
        tableBody.innerHTML = ''; // 기존 목록 초기화

        // 4. (수정) 메뉴 정보만으로 테이블을 그립니다. (재고 열 제거)
        menus.forEach(menu => {
            const row = `
                <tr>
                    <td>${menu.id}</td>
                    <td>${menu.name}</td>
                    <td>${menu.description || ''}</td>
                    <td>${menu.price}원</td>
                    <td>
                        <button class="delete-btn" data-menu-id="${menu.id}">
                            삭제
                        </button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        // 5. (수정) '재고 저장' 버튼 -> '삭제' 버튼에 이벤트 리스너 추가
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteMenu);
        });

    } catch (error) {
        console.error('목록 로딩 실패:', error);
    }
}

// (유지) 새 상품 추가 (menu-service 호출)
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

        alert('상품이 성공적으로 추가되었습니다. (옵션과 재고가 자동 생성됨)');
        document.getElementById('create-menu-form').reset();

        // (수정) 함수 이름 변경
        loadMenuList(); // 목록 새로고침

    } catch (error) {
        console.error('상품 추가 에러:', error);
        alert('상품 추가 실패: ' + error.message);
    }
}

// (제거) handleUpdateStock 함수 (재고 수정 로직) -> 전체 삭제

// (신규) handleDeleteMenu 함수 (삭제 로직)
async function handleDeleteMenu(event) {
    const button = event.target;
    const menuId = button.dataset.menuId;

    // (참고: 실제로는 이 메뉴를 주문한 내역이 있는지 확인하는 로직이 필요할 수 있습니다)
    if (!confirm(`[메뉴 ID: ${menuId}] 상품을 정말 삭제하시겠습니까?`)) {
        return;
    }

    try {
        const response = await fetch(`${MENU_SERVICE_URL}/${menuId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('상품 삭제 실패');
        }

        alert('상품이 성공적으로 삭제되었습니다.');
        loadMenuList(); // 목록 새로고침

    } catch (error) {
        console.error('상품 삭제 에러:', error);
        alert('상품 삭제 실패: ' + error.message);
    }
}