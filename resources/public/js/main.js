// hanlde clase alert
const closeAlertBtn = document.querySelector('.close-alert');
if (closeAlertBtn) {
    closeAlertBtn.onclick = () => {
        closeAlertBtn.parentElement.style.display = 'none';
    };
}

// handle select filter
// filter
const filter = document.getElementById('filter');

if (filter) {
    filter.onchange = () => {
        filter.options[filter.selectedIndex].value &&
            (window.location = filter.options[filter.selectedIndex].value);
    };
}

// handle checked input place banner
const inputPlaces = Array.from(document.querySelectorAll('.input-place-banner'));
inputPlaces.forEach((input) => {
    input.onchange = (e) => {
        inputPlaces.forEach((input) => {
            input.checked = false;
        });
        e.target.checked = true;
    };
});
