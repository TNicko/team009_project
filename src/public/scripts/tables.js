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
// It also sends the data to the hardware/software/os endpoint.
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