const countries = await fetchCountries()

const regionsEl = document.getElementById("regions")
const search = document.getElementById("country")
const dropdownBtn = document.getElementById("dropdownBtn")
const dropdownBtnText = document.getElementById("dropdownBtnText")
const dropdownContent = document.getElementById("dropdownContent")
const toggleThemeBtn = document.getElementById("toggleThemeBtn")

let searchedCountry = ""
let searchedRegion = ""

displayCountries(searchedCountry, searchedRegion)
loadDefaultMode()
observeThemeChange()

search.addEventListener(
    "input",
    debounce(function findCountry(e) {
        searchedCountry = e.target.value
        displayCountries(searchedCountry, searchedRegion)
    }, 300)
)

dropdownBtn.addEventListener("click", function toggleDropdown() {
    const isDropdownOpen = dropdownContent.hasAttribute("data-visible")
    dropdownContent.toggleAttribute("data-visible")
    dropdownBtn.setAttribute("data-visible", !isDropdownOpen)
})

dropdownContent.addEventListener("click", function handleOptionClick(e) {
    const option = e.target

    if (option.matches("li[role='option']")) {
        searchedRegion = option.getAttribute("data-value")
        dropdownBtnText.textContent = searchedRegion
        displayCountries(searchedCountry, searchedRegion)
    }
})

dropdownContent.addEventListener("keydown", function handleOptionEntered(e) {
    const option = e.target

    if (option.matches("li[role='option']") && e.key === "Enter") {
        searchedRegion = option.getAttribute("data-value")
        dropdownBtnText.textContent = searchedRegion
        displayCountries(searchedCountry, searchedRegion)
    }
})

toggleThemeBtn.addEventListener("click", function toggleTheme() {
    document.documentElement.classList.toggle("dark")
})

function displayCountries(country, region) {
    let content = ""

    countries
        .filter(function getCountries(c) {
            const countryMatch = country
                ? c.name.toLowerCase().includes(country.toLowerCase())
                : true
            const regionMatch = region
                ? c.region.toLowerCase() === region.toLowerCase()
                : true

            return countryMatch && regionMatch
        })
        .forEach(function addCountryToContent(country) {
            content += `
        <div class="region">
            <img
                class="flag"
                src="${country.flag}"
                alt="${country.name} flag"
            />
            <div class="region-details">
                <h2 class="country">${country.name}</h2>
                <p>
                    <span class="bold-text">Population</span>:
                    ${country.population.toLocaleString()} 
                </p>
                <p><span class="bold-text">Region</span>: ${country.region}</p>
                <p><span class="bold-text">Capital</span>: ${
                    country.capital
                }</p>
            </div>
        </div>
        `
        })
    regionsEl.innerHTML = content
}

async function fetchCountries() {
    try {
        const res = await fetch(
            "http://localhost:5500/rest-countries-api-with-color-theme-switcher-master/data.json"
        )
        const data = await res.json()

        return data
    } catch (error) {
        console.error(error)
        return []
    }
}

function debounce(func, delay) {
    let timeout
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), delay)
    }
}

function loadDefaultMode() {
    const isDark = getUserPreference() === "dark"
    document.documentElement.classList[isDark ? "add" : "remove"]("dark")
}

function observeThemeChange() {
    const observer = new MutationObserver(() => {
        const isDark = document.documentElement.classList.contains("dark")
        localStorage.setItem("theme", isDark ? "dark" : "light")
    })

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    })
}

function getUserPreference() {
    const theme = localStorage.getItem("theme")
    if (!theme) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
    }

    return theme
}
