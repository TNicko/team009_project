function createExtSpecialist() {
    sendRequest("/users/create/ext", "extForm", "Unable to create external specialist");
}

function assignTicket() {
    sendRequest("/ticket/assign", "assignForm", "Unable to assign ticket");
}

function sendRequest(endpoint, formId, errorMsg) {
    let form = document.querySelector("#" + formId);
    let data = new FormData(form);

    let object = {};
    data.forEach((value, key) => object[key] = value);
    let json = JSON.stringify(object);

    fetch(endpoint, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: json
    }).then(res => {
        if (res.status === 200)
            location.reload();
        else {
            let error = document.querySelector("#error");
            error.innerHTML = errorMsg;
            error.classList.remove("hide");
        }
    });
}