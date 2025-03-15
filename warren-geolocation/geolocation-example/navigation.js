// Mobile Navigation
const l = document.getElementById("mobile-nav");
let navigation = document.getElementById("navigation");

let stored = l.innerHTML;

l.addEventListener('click', function() {
    if (navigation.classList.contains('display-sm')) {
        l.innerHTML = '&#x2718;';
        return navigation.classList.remove('display-sm');
    }
    l.innerHTML = stored;
    navigation.classList.add('display-sm');
    stored = l.innerHTML;
});