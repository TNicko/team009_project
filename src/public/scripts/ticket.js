function closeTicket(id) {
    fetch("/ticket/" + id + "/close", {
        method: "POST"
    }).then(() => location.reload());
}

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