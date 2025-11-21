// 사용자 정보와 역할을 가져오는 함수 (예시)
function getUserRole() {
    // 세션에서 사용자 역할을 가져오거나 실제 로그인 정보로 대체
    return sessionStorage.getItem('role'); // 'user' 또는 'admin'
}

function checkAdminAccess(targetUrl) {
    const userRole = getUserRole();

    if (userRole !== 'admin') {
        // 관리자만 접근할 수 있도록 모달을 띄우기
        const modal = new bootstrap.Modal(document.getElementById('adminModal'));
        modal.show();
    } else {
        // 관리자인 경우 링크로 이동
        window.location.href = targetUrl;
    }
}
