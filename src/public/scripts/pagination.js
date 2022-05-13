// Redirects the user to the previous page
function prevPage(openTickets = false) {
    let url = new URL(location.href);
    let paramName = openTickets ? "openPage" : "page";
    let page = url.searchParams.get(paramName);
    page = page === null ? 2 : parseInt(page) - 1;
    url.searchParams.set(paramName, page);
    location.href = url.href;
}

// Redirects the user to the next page
function nextPage(openTickets = false) {
    let url = new URL(location.href);
    let paramName = openTickets ? "openPage" : "page";
    let page = url.searchParams.get(paramName);
    page = page === null ? 2 : parseInt(page) + 1;
    url.searchParams.set(paramName, page);
    location.href = url.href;
}