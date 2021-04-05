window.addEventListener('load', async (event) => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }


    const MDCCircularProgress = mdc.circularProgress.MDCCircularProgress;

    const circularProgress1 = new MDCCircularProgress(document.querySelector('#kreisi1'));
    const circularProgress2 = new MDCCircularProgress(document.querySelector('#kreisi2'));
    const circularProgress3 = new MDCCircularProgress(document.querySelector('#kreisi3'));
    const circularProgress4 = new MDCCircularProgress(document.querySelector('#kreisi4'));
    circularProgress1.determinate = false
    circularProgress2.determinate = false
    circularProgress3.determinate = false
    circularProgress4.determinate = false

    const yeetList = document.getElementById("yeeter");

    const res = await fetch("https://discord.schweininchen.de/botti/stats");
    const divNames = ["numEhre", "numAlla", "numYeet", "numSchaufel"];

    if (res.status !== 200) {
        console.warn(`${res.status}!`);

        const errorMessage = !navigator.onLine ? "OFFLINE" : "API down!"

        for (let name of divNames) {
            document.getElementById(name).parentElement.style = "display: grid; place-items: center;";
            document.getElementById(name).parentElement.innerHTML = `<span class="keyword">${errorMessage}</span>`;
        }
        circularProgress1.close();
        circularProgress2.close();
        circularProgress3.close();
        circularProgress4.close();

        setTimeout(() => {
            document.getElementById("body").style.setProperty("--onFinishedShow", "unset")
            document.getElementById("body").style.setProperty("--onLoadShow", "none")
        }, 300)
        return;
    }

    const stats = await res.json();

    document.getElementById("numEhre").innerText = stats.ehre.total;
    circularProgress1.close();
    document.getElementById("numAlla").innerText = stats.alla.total;
    circularProgress2.close();
    document.getElementById("numSchaufel").innerText = stats.schaufeln.total;
    circularProgress4.close();

    let yeet = 0;
    let yeeters = {};
    for (let user in stats.yeet.result) {
        yeet += stats.yeet.result[user].value
        yeeters[user.name] = stats.yeet.result[user].id

        const el = document.createElement("H2");
        el.innerText = `${stats.yeet.result[user].name}: ${stats.yeet.result[user].value} mal weggeyeetet`;
        yeetList.appendChild(el);
    }
    document.getElementById("numYeet").innerText = yeet;
    circularProgress3.close();

    setTimeout(() => {
        document.getElementById("body").style.setProperty("--onFinishedShow", "unset")
        document.getElementById("body").style.setProperty("--onLoadShow", "none")
    }, 300)


    console.log('The page has fully loaded');
});


function cardClick(card) {
    document.getElementById("overlay").style.display = "block";

    document.body.onkeyup = e => {
        if (e.key == "Escape") {
            closeOverlay()
        }
    }

    switch (card) {
        case "YEET":
            document.getElementById("info-card").classList.add("blue")
    }
}

function closeOverlayClick(event, element) {
    if (event.target != element) {
        event.stopPropagation();
        return;
    }
    closeOverlay()
}

function closeOverlay() {
    document.body.onkeyup = () => { }
    document.getElementById("overlay").style.display = "none";
}