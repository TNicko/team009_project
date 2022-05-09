function createExtSpecialist() {
    sendRequest(
        "/users/create/ext",
        "extForm",
        "Unable to create external specialist",
        "Successfully created external specialist account"
    );
}

function assignTicket() {
    sendRequest(
        "/ticket/assign",
        "assignForm",
        "Unable to assign ticket",
        "Successfully assigned ticket"
    );
}

function sendRequest(endpoint, formId, errorMsg, successMsg) {
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
        let error = document.querySelector("#error");
        let success = document.querySelector("#success");
        if (res.status === 200) {
            success.innerHTML = successMsg;
            success.classList.remove("hide");
            error.classList.add("hide");
        } else {
            error.innerHTML = errorMsg;
            error.classList.remove("hide");
            success.classList.add("hide");
        }
    });
}