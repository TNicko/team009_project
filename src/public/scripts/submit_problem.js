function selectSerialType(select) {
    let parent = select.parentNode;
    let children = parent.children;

    let type = select.value;
    let serialSelect = children[children.length - 2];
    switch (type) {
        case "hardware":
            serialRoutine(serialSelect, hardwares);
            break;
        case "software":
            serialRoutine(serialSelect, softwares);
            break;
        case "os":
            serialRoutine(serialSelect, oses);
            break;
        case "none":
            serialSelect.setAttribute("disabled", true);
            serialSelect.innerHTML = "";
            let option = document.createElement("option");
            option.innerHTML = "Choose serial...";
            serialSelect.add(option);
            break;
    }
}

function addNewSerial(btn) {
    let parent = btn.parentNode;

    let template = document.getElementById("serialTemplate")
    let serialClone = template.content.cloneNode(true);
    parent.appendChild(serialClone);

    let btnClone = btn.cloneNode(true);
    btn.remove();
    parent.appendChild(btnClone);
}

function serialRoutine(select, serials) {
    select.removeAttribute("disabled");
    select.innerHTML = "";
    for (const serial of serials) {
        let option = document.createElement("option");
        option.value = serial.serial;
        option.innerHTML = serial.serial + " - " + serial.name;
        select.appendChild(option);
    }
}

function deleteSerial(btn) {
    let parent = btn.parentNode;
    parent.remove();
}