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
            // ★★★ 수정된 이미지 경로 처리 로직 ★★★
            let imgSrc = 'https://via.placeholder.com/50?text=No+Img'; // 기본값

            if (menu.imageUrl) {
                if (menu.imageUrl.startsWith('http')) {
                    // 1. http로 시작하면 (외부 인터넷 이미지) -> 그대로 사용
                    imgSrc = menu.imageUrl;
                } else {
                    // 2. 아니면 (직접 업로드한 로컬 이미지) -> 게이트웨이 주소 붙이기
                    imgSrc = `http://localhost:8000${menu.imageUrl}`;
                }
            }
            const row = `
                <tr>
                    <td>${menu.id}</td>
                    <td>
                        <img src="${imgSrc}" alt="${menu.name}" 
                             style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #eee;">
                    </td>
                    <td class="fw-bold">${menu.name}</td>
                    <td class="text-muted small">${menu.description || '-'}</td>
                    <td>${menu.price.toLocaleString()}원</td>
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
    const fileInput = document.getElementById('file');

    // ★ JSON 대신 FormData 객체 생성
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    // 파일이 선택되었을 때만 추가
    if (fileInput.files.length > 0) {
        formData.append("file", fileInput.files[0]);
    }

    try {
        const response = await fetch(MENU_SERVICE_URL, {
            method: 'POST',
            // ★ 주의: FormData 전송 시에는 headers에 'Content-Type'을 직접 설정하면 안 됩니다.
            // 브라우저가 자동으로 boundary를 포함한 multipart/form-data 헤더를 설정합니다.
            body: formData
        });

        if (!response.ok) {
            throw new Error('상품 추가 실패');
        }

        alert('상품이 성공적으로 추가되었습니다.');
        document.getElementById('create-menu-form').reset();
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
        loadMenuList();

    } catch (error) {
        console.error('상품 삭제 에러:', error);
        alert('상품 삭제 실패: ' + error.message);
    }
}