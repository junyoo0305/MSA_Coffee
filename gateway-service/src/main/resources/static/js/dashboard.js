// API 엔드포인트
const ORDER_SERVICE_URL = 'http://localhost:8000/api/orders';

document.addEventListener('DOMContentLoaded', () => {
    // 1. 페이지 로드 시 즉시 주문 목록 로드
    loadOrderStatus();

    // 2. 10초마다 자동으로 새로고침
    setInterval(loadOrderStatus, 10000); // 10000ms = 10초

    // 3. '새로고침' 버튼 클릭 이벤트
    document.getElementById('refresh-btn').addEventListener('click', loadOrderStatus);
});

async function loadOrderStatus() {
    console.log("주문 목록을 새로고침합니다...");
    try {
        const response = await fetch(ORDER_SERVICE_URL);
        if (!response.ok) {
            throw new Error('주문 현황 로딩 실패');
        }

        const orders = await response.json();
        const tableBody = document.querySelector('#orders-table tbody');
        tableBody.innerHTML = ''; // 기존 목록 초기화

        // 주문 목록을 (최신순으로) 순회
        orders.reverse().forEach(order => {

            // --- 주문 내역(items)을 <ul> 태그로 만들기 ---
            let detailsHtml = '<ul class="details-list">';
            order.items.forEach(item => {
                // 옵션 이름들을 콤마(,)로 연결 (e.g., "Ice, Size Up")
                const optionsStr = item.selectedOptions.map(opt => opt.optionName).join(', ');

                detailsHtml += `
                    <li>
                        <b>${item.menuName}</b> (${optionsStr})
                        x ${item.quantity}
                        (개당 ${item.pricePerItem.toLocaleString()}원)
                    </li>
                `;
            });
            detailsHtml += '</ul>';

            // --- 주문 시간 포맷팅 (여백 줄이기) ---
            const orderDate = new Date(order.orderDate).toLocaleString('ko-KR', {
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
            });

            // --- 상태(Status) CSS 클래스 ---
            const statusClass = `status-${order.status}`; // (e.g., "status-PREPARING")

            // --- ★★★ 상태 변경 드롭다운(select) 만들기 ★★★ ---
            // '수령 완료' 또는 '실패' 시 드롭다운 비활성화
            const isDisabled = (order.status === 'COMPLETED' || order.status === 'FAILED');

            let actionHtml = `
                <select class="form-select status-select" data-order-id="${order.id}" ${isDisabled ? 'disabled' : ''}>
                    <option value="PREPARING" ${order.status === 'PREPARING' ? 'selected' : ''}>
                        조리중
                    </option>
                    <option value="READY" ${order.status === 'READY' ? 'selected' : ''}>
                        픽업 대기
                    </option>
                    <option value="COMPLETED" ${order.status === 'COMPLETED' ? 'selected' : ''}>
                        수령 완료
                    </option>
                </select>
            `;
            // FAILED 상태일 경우 드롭다운 대신 "주문 실패" 표시
            if (order.status === 'FAILED') {
                actionHtml = '주문 실패';
            }
            // --- ★★★ 드롭다운 완성 ★★★ ---

            // 최종 테이블 행(Row) 생성
            const row = `
                <tr>
                    <td>${order.id}</td>
                    <td>${orderDate.replace(/\. /g, '.').replace(/\.$/, '')}</td> 
                    <td>${order.customerName}</td>
                    <td>${detailsHtml}</td>
                    <td><b>${order.totalPrice.toLocaleString()}원</b></td>
                    <td class="${statusClass}">${order.status}</td>
                    <td>${actionHtml}</td> </tr>
            `;
            tableBody.innerHTML += row;
        });

        // ★★★ 동적으로 생성된 드롭다운에 이벤트 리스너 추가 ★★★
        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', handleStatusChange);
        });

    } catch (error) {
        console.error(error.message);
        const tableBody = document.querySelector('#orders-table tbody');
        // (수정) colspan="7"로 변경
        tableBody.innerHTML = `<tr><td colspan="7" class="text-danger">주문 목록을 불러오는 데 실패했습니다.</td></tr>`;
    }
}

// ★★★ (신규 함수) 상태 변경을 서버에 전송하는 함수 ★★★
async function handleStatusChange(event) {
    const select = event.target;
    const orderId = select.dataset.orderId;
    const newStatus = select.value;

    // 드롭다운의 텍스트 (e.g., "픽업 대기")
    const newStatusText = select.options[select.selectedIndex].text;

    if (!confirm(`주문 ID ${orderId}의 상태를 "${newStatusText}"(으)로 변경하시겠습니까?`)) {
        // 취소 시, 드롭다운을 원래 상태로 되돌리기 (새로고침 전)
        select.value = Array.from(select.options).find(opt => opt.defaultSelected).value;
        return;
    }

    try {
        const response = await fetch(`${ORDER_SERVICE_URL}/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }) // { "status": "READY" }
        });

        if (!response.ok) {
            throw new Error('상태 변경 실패');
        }

        alert('상태가 성공적으로 변경되었습니다.');
        loadOrderStatus(); // 대시보드 새로고침

    } catch (error) {
        console.error(error.message);
        alert('상태 변경 중 오류가 발생했습니다.');
    }
}