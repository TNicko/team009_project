function closeTicket(id) {
    fetch("/ticket/" + id + "/close", {
        method: "POST"
    }).then(() => location.reload());
}
