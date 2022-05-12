// Call the close endpoint for the ticket and reload the page to show it has been closed.
function closeTicket(id) {
    fetch("/ticket/" + id + "/close", {
        method: "POST"
    }).then(() => location.reload());
}

// Submit the user's feedback to the server with a POST request.
// Reload the page to show the feedback has been submitted.
function sendFeedback(id) {
    let feedback = document.getElementById("feedbackText").value;
    fetch("/ticket/" + id + "/feedback", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            feedback: feedback
        })
    }).then(() => location.reload());
}

// Submit the specialist's solution to the server with a POST request.
// Reload the page to show the solution has been submitted.
function sendSolution(id) {
    let solution = document.getElementById("solutionText").value;
    fetch("/ticket/" + id + "/solution", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            solution: solution
        })
    }).then(() => location.reload());
}

// Wraps around the assignRequest function to assign the ticket to the current specialist.
function assignToSelf(id) {
    assignRequest(id, currentUserId);
}

// Wraps around the assignRequest function to drop the ticket.
function dropTicket(id) {
    assignRequest(id, -1);
}

// Sends a POST request to assign the given ticket to the given specialist.
function assignRequest(ticketId, specialistId) {
    let data = {
        ticket: ticketId,
        specialist: specialistId
    };

    fetch("/ticket/assign", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(() => location.reload());
}


// Make the data fields editable.
function editTicketInfo(btn, id) {
    btn.innerHTML = "Save";
    btn.onclick = () => saveTicketInfo(btn, id);

    let parent = btn.parentNode.parentNode;
    for (const editable of parent.querySelectorAll(".editable-text")) {
        let text = editable.innerHTML.trim();
        let input = document.createElement("textarea");
        input.type = "text";
        input.classList = "editable-input"
        input.value = text;
        editable.innerHTML = "";
        editable.appendChild(input);
    }
}


// Make the data fields uneditable.
function saveTicketInfo(btn, id) {
    btn.innerHTML = "Edit";
    btn.onclick = () => editTicketInfo(btn, id);

    let parent = btn.parentNode.parentNode;
    for (const editable of parent.querySelectorAll(".editable-text")) {
        let input = editable.querySelector("textarea");
        let text = input.value.trim();
        editable.innerHTML = text;
    }

    let data = {
        id: id,
        title: parent.querySelector("#description").innerHTML,
        notes: parent.querySelector("#notes").innerHTML,
    };

    fetch("/ticket", {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    }).then(() => console.log("done"));
}