// 1. 로그인 상태 확인 및 네비바 업데이트 함수
function updateNavbar() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role'); // 'ADMIN' 또는 'USER'

    const loginNav = document.getElementById('loginNav');
    const registerNav = document.getElementById('registerNav');
    const userNav = document.getElementById('userNav');
    const logoutNav = document.getElementById('logoutNav');
    const usernameDisplay = document.getElementById('usernameDisplay');

    // 네비바 요소가 없는 페이지(예: 로그인 페이지)에서는 실행 중단
    if (!loginNav) return;

    if (token && username && role) {
        // 로그인 상태
        loginNav.classList.add('d-none');
        registerNav.classList.add('d-none');
        userNav.classList.remove('d-none');
        logoutNav.classList.remove('d-none');
        // 사용자 이름과 권한 표시
        usernameDisplay.textContent = `${username} (${role === 'ADMIN' ? '관리자' : '회원'})님`;
    } else {
        // 비로그인 상태
        loginNav.classList.remove('d-none');
        registerNav.classList.remove('d-none');
        userNav.classList.add('d-none');
        logoutNav.classList.add('d-none');
    }
}

// 2. 권한 체크 및 페이지 이동 함수
function checkAccessAndMove(targetUrl, requiredRole) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // 1) 비로그인 상태 체크
    if (!token) {
        alert('로그인이 필요한 서비스입니다.');
        window.location.href = '/login';
        return;
    }

    // 2) 관리자 전용 페이지 체크
    if (requiredRole === 'ADMIN' && role !== 'ADMIN') {
        alert('관리자 권한이 필요합니다.');
        return; // 페이지 이동 안 함
    }

    // 3) 권한 통과 시 페이지 이동
    window.location.href = targetUrl;
}

// 3. 이벤트 리스너 등록 (페이지 로드 시 실행)
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar(); // 네비바 상태 업데이트

    // --- [관리자 전용 메뉴] 클릭 이벤트 ---
    const adminLinks = ['menuLink', 'stockLink', 'dashLink', 'customerLink'];
    adminLinks.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault(); // 기본 링크 이동 막기
                checkAccessAndMove(el.getAttribute('href'), 'ADMIN');
            });
        }
    });

    // --- [회원 공용 메뉴] 클릭 이벤트 ---
    const userLinks = ['orderLink', 'listLink'];
    userLinks.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault(); // 기본 링크 이동 막기
                checkAccessAndMove(el.getAttribute('href'), 'USER'); // USER 이상 권한 필요
            });
        }
    });

    // --- [로그아웃] 클릭 이벤트 ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear(); // 모든 정보 삭제
            alert('로그아웃되었습니다.');
            window.location.href = '/'; // 메인으로 이동
        });
    }
});