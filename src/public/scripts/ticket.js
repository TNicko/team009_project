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

function assignToSelf(id) {
    assignRequest(id, currentUserId);
}

function dropTicket(id) {
    assignRequest(id, -1);
}

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