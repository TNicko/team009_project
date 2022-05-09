function createExtSpecialist() {
    let form = document.querySelector("#extForm");
    let data = new FormData(form);

    let object = {};
    data.forEach((value, key) => object[key] = value);
    let json = JSON.stringify(object);

    fetch("/users/create/ext", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: json
    }).then(res => {
        if (res.status === 200)
            location.reload();
        else {
            let error = document.querySelector("#error");
            error.innerHTML = "Unable to create external specialist";
            error.classList.remove("hide");
        }
    });
}