import { pageState } from "./index.js";
let forceCycle = false;

/** @param {number} ms */
export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {Element} element
 * @param {string} className
 * @param {"show" | "hide"} option
 */
export function manage(element, className, option) {
    element.classList.remove(`show${className}`, `hide${className}`);
    element.classList.add(`${option}${className}`);
}

/**
 * @param {HTMLImageElement} img
 * @param {string} target
 */
export async function imageCycle(img, target) {
    img.addEventListener("click", () => {
        forceCycle = true;
        console.log("Clicked")
    });

    const length = global.images[target];
    let index = 1;

    while (pageState === "layout") {
        img.src = `./data/${target}/${index}.jpg`;
        img.innerText = index
        if (index + 1 > length) index = 1;
        else index++;

        const check = await checkPageState(75, 100);
        if (check === null) forceCycle = false;
        if (check) break;
    }
}

/**
 * @param {number} repeat
 * @param {number} time
 * @returns {Promise<boolean>}
 */
async function checkPageState(repeat, time) {
    while (repeat > 1) {
        if (forceCycle) return null;
        repeat--;
        await sleep(time);
        if (pageState !== "layout") return true;
    }
    return false;
}
