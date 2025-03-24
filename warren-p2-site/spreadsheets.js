
// Grabbing elements from the document
const scrollList = document.querySelector(".sliding-tabs");
const completeBar = document.querySelectorAll(".complete");
const tabList = document.querySelectorAll(".tab");

// Setting the index of the side scroller
let index = 0;

// Creating a list for timeouts
let timeoutList = [];

// Setting a perameter for if the side scroller should be scrolling
let scrolling = true;

// Starting the side scroller
let tabScroll = scrollLoop(tabList[0]);

// Allows user to click on an unfocused tab and make it the focused item
tabList.forEach(function(tab) {
  tab.addEventListener('click', function(event) {
    clearInterval(tabScroll);
    scrolling = false;
    timeoutList.forEach(function(timeout) {
      clearTimeout(timeout);
    })
    scrollList.scrollLeft += (event.clientX - tab.getBoundingClientRect().width);
    tabList.forEach(function(tabItem) {
      tabItem.classList.add('unfocused');
    })

    tab.classList.remove('unfocused');
    
    setTimeout(function() {
      scrolling = true
      tabScroll = scrollLoop(tab);
    }, 500);
  })
});

// Creates a basic scroll that will continue indefinetly
function scrollLoop(tab) {
  index = 0
  while(tabList[index] !== tab) {
    index++;
  }
  let time = (5000 * (tabList.length - index)) + 1000;
  timeOutLoop(index);
  return setInterval(timeOutLoop, time, 0);
}

// Sets timeouts so that the scroll continues periodically
function timeOutLoop(index) {
  let time = 1000;

  while(index < completeBar.length) {
    let timeout = setTimeout(progressBarLoad, time, completeBar[index]);
    time = time + 5000;
    timeoutList.push(timeout);
    index++;
  }
  reset = false;
}

// Moves the progress bars and scrolls the list
function progressBarLoad(bar) {
  let width = 1;
  let progressBarInterval = setInterval(frame, 50);

  function frame() {
    if (width >= 100) {
      clearInterval(progressBarInterval);
      tabList[index].classList.add("unfocused");
      if (index == 4) {
        scrollList.scrollLeft -= 10000;
      } else {
        // let {right} = tabList[index].getBoundingClientRect();
        scrollList.scrollLeft += 375;
      }
      index++;
      if (index < tabList.length) {
        tabList[index].classList.remove("unfocused");
      } else {
        index = 0;
        tabList[index].classList.remove("unfocused");
      }
    } else if (!scrolling) {
      clearInterval(progressBarInterval);
      return
    } else {
      width++;
      bar.style.width = width + "%";
    }
  }
}
