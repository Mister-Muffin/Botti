window.addEventListener("load", async (event) => {
    "use strict";

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("./sw.js");
    }


    const MDCCircularProgress = mdc.circularProgress.MDCCircularProgress;

    const circularProgress1 = new MDCCircularProgress(document.querySelector("#kreisi1"));
    const circularProgress2 = new MDCCircularProgress(document.querySelector("#kreisi2"));
    const circularProgress3 = new MDCCircularProgress(document.querySelector("#kreisi3"));
    const circularProgress4 = new MDCCircularProgress(document.querySelector("#kreisi4"));
    circularProgress1.determinate = false;
    circularProgress2.determinate = false;
    circularProgress3.determinate = false;
    circularProgress4.determinate = false;

    const yeetList = document.getElementById("yeeter");
    const ehreList = document.getElementById("geehrte");
    const allaList = document.getElementById("allaUltras");
    const schaufelList = document.getElementById("geschaufelte");
    const xpList = document.getElementById("leaderboard");

    const res = await fetch("botti/stats");
    const divNames = ["numEhre", "numAlla", "numYeet", "numSchaufel"];

    if (res.status !== 200) {
        console.warn(`${res.status}!`);

        const errorMessage = !navigator.onLine ? "OFFLINE" : "API down!";

        for (let name of divNames) {
            document.getElementById(name).parentElement.style = "display: grid; place-items: center;";
            document.getElementById(name).parentElement.innerHTML = `<span class="keyword">${errorMessage}</span>`;
        }
        circularProgress1.close();
        circularProgress2.close();
        circularProgress3.close();
        circularProgress4.close();

        setTimeout(() => {
            document.getElementById("body").style.setProperty("--onFinishedShow", "unset");
            document.getElementById("body").style.setProperty("--onLoadShow", "none");
        }, 300);
        return;
    }

    const stats = await res.json();
    console.log(stats);

    document.getElementById("numEhre").innerText = stats.totals.Ehre;
    circularProgress1.close();
    document.getElementById("numAlla").innerText = stats.totals.Alla;
    circularProgress2.close();
    document.getElementById("numYeet").innerText = stats.totals.Yeet;
    circularProgress3.close();
    document.getElementById("numSchaufel").innerText = stats.totals.Schaufel;
    circularProgress4.close();

    let yeeters = {};
    let geehrte = {};
    for (let user in stats.ids) {
        console.log(user);

        yeeters[user] = stats.ids[user].UserId;
        console.log(yeeters);

        geehrte[user] = stats.ids[user].UserId;
        console.log(geehrte);

        const el = document.createElement("H2");
        el.innerText = `${stats.ids[user].Username}: ${stats.ids[user].Yeet} mal weggeyeetet`;
        yeetList.appendChild(el);

        const ehrelement = document.createElement("H2");
        ehrelement.innerText = `${stats.ids[user].Username}: ${stats.ids[user].Ehre} mal Ehre generiert`;
        ehreList.appendChild(ehrelement);

        const allalement = document.createElement("H2");
        allalement.innerText = `${stats.ids[user].Username}: ${stats.ids[user].Alla} mal Alla gesagt`;
        allaList.appendChild(allalement);

        const schaufelement = document.createElement("H2");
        schaufelement.innerText = `${stats.ids[user].Username}: ${stats.ids[user].Schaufel} mal weggeschaufelt`;
        schaufelList.appendChild(schaufelement);

        const xpElement = document.createElement("H3");
        xpElement.innerText = `${stats.ids[user].Username}: ${stats.ids[user].Xp} mal weggeschaufelt`;
        xpList.appendChild(xpElement);
    }

    setTimeout(() => {
        document.getElementById("body").style.setProperty("--onFinishedShow", "unset");
        document.getElementById("body").style.setProperty("--onLoadShow", "none");
    }, 300);


    console.log("The page has fully loaded");
});


function cardClick(card) {
    document.getElementById("overlay").style.display = "block";

    document.body.onkeyup = e => {
        if (e.key == "Escape") {
            closeOverlay();
        }
    };

    switch (card) {
    case "YEET":
        document.getElementById("info-card").classList.add("blue");
        document.getElementById("yeetList").style.removeProperty("display");
        break;
    case "EHRE":
        document.getElementById("info-card").classList.add("red");
        document.getElementById("ehreList").style.removeProperty("display");
        break;
    case "ALLA":
        document.getElementById("info-card").classList.add("green");
        document.getElementById("allaList").style.removeProperty("display");
        break;
    case "SCHAUFELN":
        document.getElementById("info-card").classList.add("yellow");
        document.getElementById("schaufelList").style.removeProperty("display");
        break;
    }
}

function closeOverlayClick(event, element) {
    if (event.target != element) {
        event.stopPropagation();
        return;
    }
    closeOverlay();
}

function closeOverlay() {
    document.body.onkeyup = () => { };
    document.getElementById("overlay").style.display = "none";
    document.getElementById("yeetList").style.setProperty("display", "none");
    document.getElementById("ehreList").style.setProperty("display", "none");
    document.getElementById("allaList").style.setProperty("display", "none");
    document.getElementById("schaufelList").style.setProperty("display", "none");

    document.getElementById("info-card").classList.remove("blue", "green", "red", "yellow");
}