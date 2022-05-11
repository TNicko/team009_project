function selectSerialType(select) {
    let parent = select.parentNode;
    let children = parent.children;

    let type = select.value;
    let serialSelect = children[children.length - 1];
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

function serialRoutine(select, serials) {
    select.removeAttribute("disabled");
    select.innerHTML = "";
    for (const serial of serials) {
        let option = document.createElement("option");
        option.value = serial.serial;
        option.innerHTML = serial.serial + " - " + serial.name;
        select.add(option);
    }
}