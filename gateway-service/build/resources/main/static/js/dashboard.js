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
            // --- <ul> 태그 완성 ---

            // 주문 시간 포맷팅 (e.g., 2025. 11. 12. 오후 5:44:10)
            const orderDate = new Date(order.orderDate).toLocaleString('ko-KR');

            // 상태(Status)에 따라 CSS 클래스 부여
            let statusClass = '';
            if (order.status === 'COMPLETED') statusClass = 'status-completed';
            if (order.status === 'PENDING') statusClass = 'status-pending';
            if (order.status === 'FAILED') statusClass = 'status-failed';

            // 최종 테이블 행(Row) 생성
            const row = `
                <tr>
                    <td>${order.id}</td>
                    <td>${orderDate}</td>
                    <td>${order.customerName}</td>
                    <td>${detailsHtml}</td>
                    <td><b>${order.totalPrice.toLocaleString()}원</b></td>
                    <td class="${statusClass}">${order.status}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error(error.message);
        const tableBody = document.querySelector('#orders-table tbody');
        tableBody.innerHTML = `<tr><td colspan="6" class="text-danger">주문 목록을 불러오는 데 실패했습니다.</td></tr>`;
    }
}