
document.querySelectorAll('.admin_panel').forEach(function(card) {
    card.addEventListener('click', function (e) {

        const type = card.querySelector('.panel_title').firstElementChild.innerHTML;
        
        location.href = "/?type="+type

    });
});