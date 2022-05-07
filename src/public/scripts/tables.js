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
        oldSerial: serial,
        newSerial: row.children[0].children[0].value,
        newName: row.children[1].children[0].value,
    }

    fetch(
        endpoint,
        {method: "POST", body: JSON.stringify(data)}
    ).then(res => console.log(res));

}