// Edit the hardware/software/os table row clicked on by the user.
// This makes all the fields editable.
function editRow(btn, serial, endpoint) {
    let row = btn.parentNode.parentNode;
    for (const col of row.children)
        if (col.children[0].tagName === "INPUT")
            col.children[0].disabled = false;

    btn.onclick = () => saveRow(btn, serial, endpoint);
    btn.innerHTML = "Save";
}

// Save the row after it has been edited.
// This makes all the fields uneditable.
// It also sends the data to the PUT hardware/software/os endpoint.
function saveRow(btn, serial, endpoint) {
    let row = btn.parentNode.parentNode;
    for (const col of row.children)
        if (col.children[0].tagName === "INPUT")
            col.children[0].disabled = true;

    btn.onclick = () => editRow(btn, serial);
    btn.innerHTML = "Edit";

    let data = {
        oldSerial: serial.trim(),
        newSerial: row.children[0].children[0].value.trim(),
        newName: row.children[1].children[0].value.trim(),
    }

    fetch(endpoint, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(res => {
        location.reload();
    });
}

// Create a new row in the table
function createRow(endpoint) {
    let table = document.getElementById("table");
    let newRow = table.insertRow(1);
    let newSerial = newRow.insertCell(0);
    let newName = newRow.insertCell(1);
    let newBtn = newRow.insertCell(2);

    newSerial.innerHTML = `<input type="text" class="form-control" placeholder="Serial Number">`;
    newName.innerHTML = `<input type="text" class="form-control" placeholder="Name">`;
    newBtn.innerHTML = `<button class="btn btn-primary">Add</button>`;
    newBtn.onclick = () => createNewSerial(newBtn, endpoint);
}

// Create the row after it has been made by the user.
// This sends the data to the POST hardware/software/os endpoint.
function createNewSerial(btn, endpoint) {
    let row = btn.parentNode;
    for (const col of row.children)
        if (col.children[0].tagName === "INPUT")
            col.children[0].disabled = true;

    let data = {
        serial: row.children[0].children[0].value.trim(),
        name: row.children[1].children[0].value.trim(),
    }

    fetch(endpoint, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(res => {
        location.reload();
    });
}