// Send a POST request to the server with the problem data
function submitProblem() {
    // Get the serials
    let serialElements = document
        .getElementById("serialWrapper")
        .getElementsByClassName("serialNum");
    let serials = [];
    for (const serialNum of serialElements) {
        let serial = serialNum.value;
        let serialType = serialNum.parentNode.querySelector(".serialType").value;
        serials.push({
            serialType: serialType,
            serial: serial,
        });
    }

    let data = {
        title: document.getElementById("title").value,
        notes: document.getElementById("notes").value,
        isHardware: document.getElementById("hardware").checked,
        isSoftware: document.getElementById("software").checked,
        isNetwork: document.getElementById("network").checked,
        serials: serials
    }

    fetch("/ticket/submit", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(async res => {
        if (res.status !== 200) {
            console.warn("Ticket submit returned status code " + res.status);
            return;
        }

        let resData = await res.json();
        if (resData.success) {
            location.href = "/ticket/" + resData.id;
        } else {
            console.warn("Ticket submit failed: " + resData.reason);
        }
    });
}

// Replace the options of the serial number select with whatever type was selected by the user.
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

// Create a new serial row to input the serial number.
function addNewSerial(btn) {
    let parent = btn.parentNode;

    let template = document.getElementById("serialTemplate")
    let serialClone = template.content.cloneNode(true);
    parent.appendChild(serialClone);

    let btnClone = btn.cloneNode(true);
    btn.remove();
    parent.appendChild(btnClone);
}

// The main function to create the serial number select.
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

// Delete a serial row.
function deleteSerial(btn) {
    let parent = btn.parentNode;
    parent.remove();
}