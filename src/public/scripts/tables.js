function editRow(btn, serial, endpoint) {
    let row = btn.parentNode.parentNode;
    for (const col of row.children)
        if (col.children[0].tagName === "INPUT")
            col.children[0].disabled = false;

    btn.onclick = () => saveRow(btn, serial, endpoint);
    btn.innerHTML = "Save";
}

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
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(res => {
        location.reload();
    });
}