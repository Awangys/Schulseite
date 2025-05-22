import "./global.js";
import { manage, sleep, imageCycle } from "./utils.js";

/** @type {pageTypes} */
export let pageState = "startpage";
/** @type {Element[]} */
let loadedData = [];

const background = document.getElementById("centerbackground");
const backbutton = document.getElementById("backbutton");
const startcontent = document.getElementsByClassName("startcontent");

for (const button of document.getElementsByClassName("link")) {
    button.addEventListener("click", async (_) => {
        if (pageState === "layout") return;

        const gridContainer = document.getElementById("gridContainer");
        for await (const content of startcontent) {
            manage(content, "Fade", "hide");
            manage(gridContainer, "Fade", "hide");
        }

        const target = button.parentElement.lastElementChild.textContent;

        /** @type {dataType} */
        let data;
        try {
            data = (await Promise.all([import(`../data/${target}/data.js`), sleep(1000)]))[0].default;
        } catch (e) {
            data = { text: "" };
        }
        manage(background, "Background", "show");
        manage(backbutton, "Back", "show");
        await sleep(1000);

        const titleSpan = document.createElement("h2");
        loadedData.push(titleSpan);
        titleSpan.innerText = target;
        titleSpan.classList.add("titletext");
        manage(titleSpan, "Fade", "show");
        background.appendChild(titleSpan);

        const textSpan = document.createElement("span");
        loadedData.push(textSpan);
        textSpan.innerText = data.text;
        textSpan.classList.add("pagetext");
        manage(textSpan, "Fade", "show");
        background.appendChild(textSpan);

        pageState = "layout";

        console.log(target)
        const img = document.createElement(target === "Lego stop motion Film" ? "video" : "img");
        if (img instanceof HTMLVideoElement) {
            img.src = "../data/Lego stop motion Film/Film.mp4";
            img.volume = 0;
            img.play();
        } else imageCycle(img, target);
        loadedData.push(img);
        img.classList.add("cycleImage");
        manage(img, "Fade", "show");
        background.appendChild(img);

        await sleep(1000);
    });
}

backbutton.addEventListener("click", async (_) => {
    if (pageState === "startpage") return;

    for (const element of loadedData) {
        manage(element, "Fade", "hide");
        sleep(1000).then((_) => element.remove());
    }
    await sleep(1000);
    loadedData = [];

    manage(background, "Background", "hide");
    manage(backbutton, "Back", "hide");
    await sleep(1000);

    for await (const content of startcontent) {
        manage(content, "Fade", "show");
        manage(gridContainer, "Fade", "show");
    }
    await sleep(1000);

    pageState = "startpage";
});
