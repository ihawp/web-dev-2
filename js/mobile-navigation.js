
const l = document.getElementById("mobile-nav");
let navigation = document.getElementById("navigation");
l.addEventListener('click', () => {
   if (navigation.classList.contains('display-sm')) {
       return navigation.classList.remove('display-sm');
   }
   navigation.classList.add('display-sm');
});