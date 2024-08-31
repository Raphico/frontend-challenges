import { menuArray } from "./data.js";

const checkoutContainer = document.getElementById("checkoutContainer");
const modal = document.getElementById("modal");
const modalForm = document.getElementById("modalForm");
const menu = document.getElementById("menu");

let ordersArray = [];

populateMenu(menuArray);

menu.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-item-btn")) {
        const id = e.target.id.replace(/[^0-9]/g, '');
        const item = menuArray.find((item) => item.id === parseInt(id));
        addItemToOrder(item);
        displayOrder(ordersArray);
        e.target.disabled = true;
    }
})

modalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const modalFormData = new FormData(modalForm);
    modal.style.display = "none";
    checkoutContainer.innerHTML = `
    <div class="gratitude" aria-live="polite">
        <p class="text-center">Thanks, ${modalFormData.get("name")}! Your order is on its way!</p>
    </div>
    `
    reset()
})

function reset() {
    ordersArray = [];
    modalForm.reset();
    menuArray.forEach((item) => {
        document.getElementById(`add${item.id}Btn`).disabled = false; 
    })
}

function displayOrder(ordersArray) {
    if (ordersArray.length === 0) {
        checkoutContainer.innerHTML = "";
        return;
    }

    let totalPrice = 0;
    let orders = `
        <h2 class="your-order text-center">Your order</h2>
    `

    ordersArray.forEach((order) => {
        totalPrice += order.price
        orders += `
        <div class="order-item">
            <div class="order">
                <h2>${order.name}</h2>
                <button id="remove${order.id}Btn" class="remove-item-btn">remove</button>
            </div>
            <p>$${order.price}</p>
        </div>
        `
    })

    orders += `
    <div class="total-price">
        <h2>Total Price:</h2>
        <p>$${totalPrice}</p>
    </div>
    <button id="orderBtn" class="btn order-btn">Complete order</button>
    `

    checkoutContainer.innerHTML = orders;

    checkoutContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item-btn")) {
            const id = e.target.id.replace(/[^0-9]/g, '');
            displayOrder(removeOrder(id));
        }
    })

    document.getElementById("orderBtn").addEventListener("click", () => {
        modal.style.display = "flex";
    })
}

function removeOrder(id) {
    document.getElementById(`add${id}Btn`).disabled = false;
    ordersArray = ordersArray.filter((item) => parseInt(id) !== item.id); 
    return ordersArray;
}

function addItemToOrder(item) {
    ordersArray.push(item)
}

function populateMenu(menuData) {
    let menu = ""

    menuData.forEach((item) => {
        menu += `
        <div class="menu-item">
            <div class="item-details">
                <p class="item-icon" aria-hidden="true">${item.emoji}</p>
                <div>
                    <h2 class="item-title">${item.name}</h2>
                    <p class="item-desc">${item.ingredients.join(", ")}</p>
                    <p>$${item.price}</p>
                </div>
            </div>
            <button id="add${item.id}Btn" class="add-item-btn">+</button>
        </div>
        `
    })
    document.getElementById("menu").innerHTML = menu;
}
