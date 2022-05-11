// This is a wrapper function around sendRequest that sends a
// POST request to the server to create an external specialist account.
function createExtSpecialist() {
    sendRequest(
        "/users/create/ext",
        "extForm",
        "Unable to create external specialist",
        "Successfully created external specialist account"
    );
}

// This is a wrapper function around sendRequest that sends a
// POST request to the server to assign a ticket to a specialist from the admin page.
function assignTicket() {
    sendRequest(
        "/ticket/assign",
        "assignForm",
        "Unable to assign ticket",
        "Successfully assigned ticket"
    );
}

// Sends a POST request to the server with the given endpoint.
// The data being sent is from the HTML form.
// The success and failure messages are shown on the page after an action completes.
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