// Redirects the user to the previous page
function prevPage() {
    let url = new URL(location.href);
    let page = url.searchParams.get("page");
    page = page === null ? 2 : parseInt(page) - 1;
    url.searchParams.set("page", page);
    location.href = url.href;
}

// Redirects the user to the next page
function nextPage() {
    let url = new URL(location.href);
    let page = url.searchParams.get("page");
    page = page === null ? 2 : parseInt(page) + 1;
    url.searchParams.set("page", page);
    location.href = url.href;
}