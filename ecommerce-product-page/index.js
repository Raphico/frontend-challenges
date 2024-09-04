import { productImgs } from "./data.js"

const menuBtn = document.getElementById("menuBtn")
const navigation = document.getElementById("navigation")
const cartBtn = document.getElementById("cartBtn")
const cartEl = document.getElementById("cart")
const incrementBtn = document.getElementById("incrementBtn")
const decrementBtn = document.getElementById("decrementBtn")
const quantityEl = document.getElementById("quantity")
const productThumbnails = document.getElementById("productThumbnails")
const currentProductImg = document.getElementById("currentProductImg")
const addToCartBtn = document.getElementById("addToCartBtn")
let cartContent = document.getElementById("cartContent")
let cartContainer = document.getElementById("cartContainer")

let quantity = 0
let currentProductId = 1
let cart = []
let price = 125

// Cart
reset()

addToCartBtn.addEventListener("click", () => {
    const product = getProduct(currentProductId)

    cart.push({
        ...product,
        quantity,
    })

    displayCartContent()
    reset()
})

function displayCartContent() {
    if (!cart.length) {
        cartContent.innerHTML = `
            <p class="empty-state clr-neutral-400">Your cart is empty</p>
        `
        return
    }

    let content = ""

    cart.forEach((item) => {
        content += `
        <div id="" class="cart-product">
            <img class="cart-product-img" src="${item.path}" alt="${
            item.alt
        }" />
            <p  class="cart-product-desc clr-neutral-400">Fall Limited Edition Sneakers
                $${price.toFixed(2)} x ${
            item.quantity
        } <span class="total-price">$${(item.quantity * price).toFixed(
            2
        )}</span>
            </p>
            <button data-id="${
                item.id
            }" class="btn btn-primary remove-item-from-cart-btn" id="removeItemBtn" aria-label="Remove Product from cart">
                <img src="./images/icon-delete.svg" alt="" aria-hidden="true">
            </button>
        </div>
    `
    })

    content += `
        <button
            disabled
            id="checkoutBtn"
            class="btn btn-secondary checkout-btn"
            aria-label="Add to cart"
        >
            <svg
                aria-hidden="true"
                width="22"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M20.925 3.641H3.863L3.61.816A.896.896 0 0 0 2.717 0H.897a.896.896 0 1 0 0 1.792h1l1.031 11.483c.073.828.52 1.726 1.291 2.336C2.83 17.385 4.099 20 6.359 20c1.875 0 3.197-1.87 2.554-3.642h4.905c-.642 1.77.677 3.642 2.555 3.642a2.72 2.72 0 0 0 2.717-2.717 2.72 2.72 0 0 0-2.717-2.717H6.365c-.681 0-1.274-.41-1.53-1.009l14.321-.842a.896.896 0 0 0 .817-.677l1.821-7.283a.897.897 0 0 0-.87-1.114ZM6.358 18.208a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm10.015 0a.926.926 0 0 1 0-1.85.926.926 0 0 1 0 1.85Zm2.021-7.243-13.8.81-.57-6.341h15.753l-1.383 5.53Z"
                    fill="#"
                    fill-rule="nonzero"
                />
            </svg>
            checkout
        </button>
    `

    cartContent.innerHTML = content
    displayCartCount()

    cartContent.addEventListener("click", (e) => {
        e.stopPropagation()
        const btn = e.target.closest("button")
        if (btn && btn?.id.includes("removeItemBtn")) {
            const itemId = btn.dataset.id
            removeItemFromCart(parseInt(itemId))
        }

        displayCartContent()
    })
}

function displayCartCount() {
    let cartCount = cartContainer.querySelector("p.cart-count")

    if (cartCount) {
        console.log("inside", cartContainer)
        cartCount.innerText = cart.length
        return
    }

    cartCount = document.createElement("p")
    cartCount.classList.add("cart-count")
    cartCount.innerText = cart.length

    cartContainer.appendChild(cartCount)
}

function removeItemFromCart(id) {
    cart = cart.filter((item) => item.id !== id)
}

function reset() {
    quantity = 0
    quantityEl.innerText = quantity
    decrementBtn.disabled = true
    addToCartBtn.disabled = true
}

// Product thumbnails

productThumbnails.addEventListener("click", (e) => {
    const thumbnailBtn = e.target.closest("button")
    const product = getProduct(parseInt(thumbnailBtn.id))
    currentProductImg.innerHTML = `
        <img
            src=${product.path}
            alt=${product.alt}
        />
    `
    document.getElementById(currentProductId).classList.remove("current")
    currentProductId = product.id
    thumbnailBtn.classList.add("current")
})

function getProduct(id) {
    return productImgs.find((product) => product.id === id)
}

// Quantity

decrementBtn.addEventListener("click", () => {
    quantityEl.innerText = --quantity
    if (!quantity) {
        decrementBtn.disabled = true
        addToCartBtn.disabled = true
    }
})

incrementBtn.addEventListener("click", () => {
    decrementBtn.disabled = false
    addToCartBtn.disabled = false

    quantityEl.innerText = ++quantity
})

// Menu

menuBtn.addEventListener("click", () => {
    navigation.hasAttribute("data-visible")
        ? menuBtn.setAttribute("aria-expanded", "false")
        : menuBtn.setAttribute("aria-expanded", "true")
    navigation.toggleAttribute("data-visible")
})

cartBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    const isCartVisible = cartEl.hasAttribute("data-visible")
    cartBtn.setAttribute("aria-expanded", isCartVisible ? "false" : "true")
    cartEl.toggleAttribute("data-visible")
})

document.addEventListener("click", (e) => {
    const isClickInsideCart = cartEl.contains(e.target)

    if (!isClickInsideCart && cartEl.hasAttribute("data-visible")) {
        cartBtn.setAttribute("aria-expanded", "false")
        cartEl.removeAttribute("data-visible")
    }
})
