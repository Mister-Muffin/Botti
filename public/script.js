
window.addEventListener('load', async (event) => {

    const MDCCircularProgress = mdc.circularProgress.MDCCircularProgress

    const circularProgress1 = new MDCCircularProgress(document.querySelector('#kreisi1'));
    const circularProgress2 = new MDCCircularProgress(document.querySelector('#kreisi2'));
    const circularProgress3 = new MDCCircularProgress(document.querySelector('#kreisi3'));
    const circularProgress4 = new MDCCircularProgress(document.querySelector('#kreisi4'));
    circularProgress1.determinate = false
    circularProgress2.determinate = false
    circularProgress3.determinate = false
    circularProgress4.determinate = false

    const yeetList = document.getElementById("yeeter");

    yeet

    const res = await fetch("https://discord.schweininchen.de/botti/stats");
    const stats = await res.json();
    console.log(stats);


    document.getElementById("numEhre").innerText = stats.ehre;
    circularProgress1.close();
    document.getElementById("numAlla").innerText = stats.alla;
    circularProgress2.close();
    document.getElementById("numSchaufel").innerText = stats.schaufeln;
    circularProgress4.close();

    let yeet = 0;
    let yeeters = {};
    for (user in stats.yeet) {
        yeet += stats.yeet[user].yeet
        yeeters[user.name] = stats.yeet[user].yeet

        const el = document.createElement("H2");
        el.innerText = `${stats.yeet[user].name}: ${stats.yeet[user].yeet} mal weggeyeetet`;
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