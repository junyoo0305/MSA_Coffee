let stockModal;
let historyModal;

document.addEventListener('DOMContentLoaded', function() {
    //두 모달 초기화를 한 곳에서
    stockModal = new bootstrap.Modal(document.getElementById('stockModal'));
    historyModal = new bootstrap.Modal(document.getElementById('historyModal'));
    loadStocks();
});

async function loadStocks() {
    try {
        const response = await fetch('/api/stocks');
        const stocks = await response.json();
        
        const tbody = document.getElementById('stockTableBody');
        tbody.innerHTML = '';

        stocks.forEach(stock => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${stock.id}</td>
                <td>${stock.name}</td>
                <td>${stock.description || ''}</td>
                <td>${stock.stock}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editStock(${stock.id})">수정</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStock(${stock.id})">삭제</button>
                    <button class="btn btn-sm btn-info" onclick="showHistory(${stock.id}, '${stock.name}')">이력</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('재고 목록을 불러오는데 실패했습니다:', error);
        alert('재고 목록을 불러오는데 실패했습니다.');
    }
}

function showAddStockModal() {
    document.getElementById('modalTitle').textContent = '재고 추가';
    document.getElementById('stockForm').reset();
    document.getElementById('stockId').value = '';
    stockModal.show();
}

async function editStock(id) {
    try {
        const response = await fetch(`/api/stocks/${id}`);
        const stock = await response.json();
        
        document.getElementById('modalTitle').textContent = '재고 수정';
        document.getElementById('stockId').value = stock.id;
        document.getElementById('stockName').value = stock.name;
        document.getElementById('stockDescription').value = stock.description || '';
        document.getElementById('stockStock').value = stock.stock;

        stockModal.show();
    } catch (error) {
        console.error('상품 정보를 불러오는데 실패했습니다:', error);
        alert('상품 정보를 불러오는데 실패했습니다.');
    }
}

async function saveStock() {
    const id = document.getElementById('stockId').value;
    const stock = {
        name: document.getElementById('stockName').value,
        description: document.getElementById('stockDescription').value,
        stock: parseInt(document.getElementById('stockStock').value)
    };

    try {
        const url = id ? `/api/stocks/${id}` : '/api/stocks';
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(stock)
        });

        if (!response.ok) {
            throw new Error('저장 실패');
        }

        stockModal.hide();
        loadStocks();
        alert('재고저장 성공!');
    } catch (error) {
        console.error('재고저장 실패!:', error);
        alert('재고저장 실패!');
    }
}

async function deleteStock(id) {
    if (!confirm('정말 삭제하시겠습니까?')) {
        return;
    }

    try {
        const response = await fetch(`/api/stocks/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('삭제에 실패했습니다.');
        }

        loadStocks();
        alert('삭제되었습니다.');
    } catch (error) {
        console.error('삭제에 실패했습니다:', error);
        alert('삭제에 실패했습니다.');
    }
}

// [추가] 재고 이력 보기 함수
async function showHistory(id, name) {
    const tbody = document.getElementById('historyTableBody');

    // 1. 모달 제목 설정 및 내용 비우기 (로딩 메시지 표시)
    document.getElementById('historyModalTitle').textContent = `[${name}] 재고 변경 이력`;
    tbody.innerHTML = '<tr><td colspan="3">불러오는 중...</td></tr>';

    // 2. 모달창 띄우기
    historyModal.show();

    try {
        // 3. 백엔드 API 호출 (`GET /api/stocks/{id}/history`)
        const response = await fetch(`/api/stocks/${id}/history`);
        if (!response.ok) throw new Error('이력 조회 실패');

        const historyList = await response.json();
        tbody.innerHTML = ''; // 로딩 메시지 제거

        // 4. 이력이 없으면 메시지 표시
        if (historyList.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">변경 이력이 없습니다.</td></tr>';
            return;
        }

        // 5. 이력 목록을 테이블 행(tr)으로 만들어 삽입
        historyList.forEach(log => {
            const tr = document.createElement('tr');

            // 타임스탬프 가공 (한국 시간으로)
            const timestamp = new Date(log.timestamp).toLocaleString('ko-KR');

            // 변경 수량 (+/- 부호 및 색상)
            const change = log.changeAmount > 0 ? `+${log.changeAmount}` : log.changeAmount;
            const color = log.changeAmount > 0 ? 'text-success' : 'text-danger'; // 부트스트랩 클래스

            // 사유 한글화
            let reasonText = log.reason;
            if (log.reason === 'MANUAL_EDIT') reasonText = '수동 변경';
            if (log.reason === 'ORDER_DECREASE') reasonText = '주문 차감';

            tr.innerHTML = `
                <td>${timestamp}</td>
                <td class="${color}"><strong>${change}</strong></td>
                <td>${reasonText}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('이력을 불러오는데 실패했습니다:', error);
        tbody.innerHTML = '<tr><td colspan="3" class="text-danger">이력을 불러오는데 실패했습니다.</td></tr>';
    }
}
