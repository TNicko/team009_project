// Send a POST request to the server with the problem data
function submitProblem() {
    console.log('clicked');

    let title = document.getElementById("title").value;
    let notes = document.getElementById("notes").value;
    let isHardware = document.getElementById("hardware").checked;
    let isSoftware = document.getElementById("software").checked;
    let isNetwork = document.getElementById("network").checked;
    let errorBox = document.querySelector(".error_container");
    let error = document.querySelector(".alert-danger");
    errorBox.style.display = "none";

    // Get the serials
    let serialElements = document
        .getElementById("serialWrapper")
        .getElementsByClassName("serialNum");
    let serials = [];
    for (const serialNum of serialElements) {
        let serial = serialNum.value;
        let serialType = serialNum.parentNode.querySelector(".serialType").value;
        if (serialType !== 'none') {
            serials.push({
                serialType: serialType,
                serial: serial,
            });
        }
    }

    if (title === '') {
        errorBox.style.display = "block";
        error.innerHTML = "Please provide a title"
    } 
    else if (isHardware === false && isSoftware === false && isNetwork === false) {
        errorBox.style.display = "block";
        error.innerHTML = "Please select at least one problem type from list" 
    } 
    else if (serials.length == 0) {
        errorBox.style.display = "block";
        error.innerHTML = "Please provide a serial related to your problem" 
    }
    else {
        console.log(serials);

        let data = {
            title: title,
            notes: notes,
            isHardware: isHardware,
            isSoftware: isSoftware,
            isNetwork: isNetwork,
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