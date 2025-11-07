const gatewayUrl = "http://localhost:8000"; // ✅ Gateway 경로 기준

// ===== 메뉴 관련 =====
async function addMenu() {
    const name = document.getElementById("menuName").value;
    const price = document.getElementById("menuPrice").value;
    await fetch(`${gatewayUrl}/api/menu`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, price })
    });
    alert("메뉴 등록 완료");
    getMenus();
}

async function getMenus() {
    const res = await fetch(`${gatewayUrl}/api/menu`);
    const data = await res.json();
    const tbody = document.querySelector("#menuTable tbody");
    tbody.innerHTML = "";
    data.forEach(m => {
        tbody.innerHTML += `<tr><td>${m.id}</td><td>${m.name}</td><td>${m.price}</td></tr>`;
    });

    // select 갱신
    const menuSelects = [document.getElementById("inventoryMenu"), document.getElementById("orderMenu")];
    menuSelects.forEach(sel => {
        sel.innerHTML = "";
        data.forEach(m => sel.innerHTML += `<option value="${m.id}">${m.name}</option>`);
    });
}

// ===== 재고 관련 =====
async function addInventory() {
    const menuId = document.getElementById("inventoryMenu").value;
    const stock = document.getElementById("stockCount").value;
    await fetch(`${gatewayUrl}/api/inventory/add`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ menuId, stock })
    });
    alert("재고 등록 완료");
    getInventories();
}

async function getInventories() {
    const res = await fetch(`${gatewayUrl}/api/inventory`);
    const data = await res.json();
    const tbody = document.querySelector("#inventoryTable tbody");
    tbody.innerHTML = "";
    data.forEach(i => {
        tbody.innerHTML += `<tr><td>${i.menuId}</td><td>${i.stock}</td></tr>`;
    });
}

// ===== 주문 관련 =====
async function placeOrder() {
    const menuId = document.getElementById("orderMenu").value;
    const quantity = document.getElementById("orderQuantity").value;
    const res = await fetch(`${gatewayUrl}/api/order`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ menuId, quantity })
    });

    if (!res.ok) {
        alert("주문 요청 실패");
        return;
    }

    const data = await res.json();
    alert(`주문 완료! 상태: ${data.status}`);
    getOrders();
    getInventories();
}

async function getOrders() {
    const res = await fetch(`${gatewayUrl}/api/order`);
    const data = await res.json();
    const tbody = document.querySelector("#orderTable tbody");
    tbody.innerHTML = "";
    data.forEach(o => {
        tbody.innerHTML += `<tr><td>${o.id}</td><td>${o.menuId}</td><td>${o.quantity}</td><td>${o.status}</td></tr>`;
    });
}

// ===== 초기 로드 =====
window.onload = () => getMenus();
