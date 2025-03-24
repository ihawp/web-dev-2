// Grabbing elements from the page
const table = document.getElementById("data-rows");
const searchInput = document.getElementById("search");
const allTagsRow = document.getElementById("all-tags-row");
const slider = document.getElementById("table-slider");
const mainChecker = document.getElementById("main-checker");

// Creating variables for different svg that will appers
const negative =
  '<svg width="9" height="8" viewBox="0 0 9 8" fill="none" xmlns="http://www.w3.org/2000/svg" q:key="Pl_0"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.933058 0.683058C1.17714 0.438981 1.57286 0.438981 1.81694 0.683058L7 5.86612V2.375C7 2.02982 7.27982 1.75 7.625 1.75C7.97018 1.75 8.25 2.02982 8.25 2.375V7.375C8.25 7.72018 7.97018 8 7.625 8H2.625C2.27982 8 2 7.72018 2 7.375C2 7.02982 2.27982 6.75 2.625 6.75H6.11612L0.933058 1.56694C0.688981 1.32286 0.688981 0.927136 0.933058 0.683058Z" fill="#D10412"></path></svg>';

const positive =
  '<svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" q:key="Jl_0"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.933058 8.06694C1.17714 8.31102 1.57286 8.31102 1.81694 8.06694L7 2.88388V6.375C7 6.72018 7.27982 7 7.625 7C7.97018 7 8.25 6.72018 8.25 6.375V1.375C8.25 1.02982 7.97018 0.75 7.625 0.75H2.625C2.27982 0.75 2 1.02982 2 1.375C2 1.72018 2.27982 2 2.625 2H6.11612L0.933058 7.18306C0.688981 7.42714 0.688981 7.82286 0.933058 8.06694Z" fill="#057A53"></path></svg>';

const arrow =
  '<svg class="drop-down-arrow" width="25" height="25" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="table-cell-expand" on:click="q-MMJyi2EO.js#s_DQ72LegYCx8[0]" q:key="SH_0" q:id="lc"><path d="M6 4L11 8L6 12V4Z" fill="#B2B2C2"></path></svg>';

// adding the svg to the first row
allTagsRow.lastElementChild.innerHTML += positive;

// Basic data to appear on the page
let fullTableContentsArray = [
  ["", "AI Grouped Tags", "123k", "45%", "decrease", []],
  ["", "Common Words Tagds", "123k", "45%", "increase", []],
  ["", "Common Words Tagdas", "123k", "45%", "increase", []],
  ["", "Common Words Tagsds", "123k", "45%", "increase", []],
  [
    "Word",
    "Contains 'prices'",
    "123k",
    "45%",
    "increase",
    [
      [
        "Word",
        "Contains 'prices' + 'cheap'",
        "123k",
        "45%",
        "increase",
        [
          [
            "Word",
            "Contains 'prices' + 'cheap' + 'best",
            "123k",
            "45%",
            "increase",
            [],
          ],
          [
            "Word",
            "Contains 'prices' + 'cheap' + '1best'",
            "123k",
            "45%",
            "increase",
            [],
          ],
        ],
      ],
    ],
  ],
  ["", "Contains ads", "123k", "45%", "increase", []],
];

// Creating arrays to hold rows and content
let tableContentsArray = [];
let subRows = [];
let newRowsArray = [];
let rows = document.querySelectorAll(".table-row");

// initial population of the table and grabbing the rows in a list
populateTable();

// Initializing the search function to repopulate the list based on input
searchInput.addEventListener("keyup", function () {
  clearTable();
  mainChecker.classList.remove('table-checkbox-checked');
  populateTable(searchInput.value);
  rows = document.querySelectorAll(".table-row");
});

// Reveals the checkbox when the toggle is clicked
slider.addEventListener("click", function () {
  rows.forEach(function (row) {
    row.querySelector(".table-checkbox").classList.toggle("hidden");
  });
});

// Selects all items when the main checker is active
mainChecker.addEventListener("click", function () {
  mainChecker.classList.toggle("table-checkbox-checked");
  let checked = mainChecker.classList.contains("table-checkbox-checked");

  rows.forEach(function (row) {
    if (checked) {
      row
        .querySelector(".table-checkbox")
        .classList.add("table-checkbox-checked");
    } else {
      row
        .querySelector(".table-checkbox")
        .classList.remove("table-checkbox-checked");
    }
  });
});

// Sets the hover states foro the final column of the rows
function setHoverStates() {
  rows = document.querySelectorAll(".table-row");

  rows.forEach(function (row) {
    let isPositive = row.innerHTML.includes(positive);
    let isNegative = row.innerHTML.includes(negative);

    row.addEventListener("mouseover", function () {
      if (isPositive) {
        row.lastElementChild.innerHTML = "42%";
        row.lastElementChild.classList.add("hover-column-positive");
      } else if (isNegative) {
        row.lastElementChild.innerHTML = "-3%";
        row.lastElementChild.classList.add("hover-column-negative");
      }
    });

    row.addEventListener("mouseout", function () {
      if (isPositive) {
        row.lastElementChild.innerHTML = `45%${positive}`;
        row.lastElementChild.classList.remove("hover-column-positive");
      } else if (isNegative) {
        row.lastElementChild.innerHTML = `45%${negative}`;
        row.lastElementChild.classList.remove("hover-column-negative");
      }
    });
  });
}

// Clears the contents of the table
function clearTable() {
  while (table.childElementCount != 0) {
    if (table.firstChild.classList.contains("hidden")) {
      table.firstChild.classList.remove("hidden");
    }
    table.removeChild(table.firstChild);
  }
}

// Adds contents to the table in rows
function populateTable(keyword = "") {
  tableContentsArray = [];

  if (keyword != "") {
    fullTableContentsArray.forEach(function (item) {
      if (item[1].startsWith(keyword)) {
        console.log(item[1]);
        tableContentsArray.push(item);
      }
    });
  } else {
    tableContentsArray = fullTableContentsArray;
  }

  if (tableContentsArray.length != 0) {
    newRowsArray = [];

    tableContentsArray.forEach(function (row) {
      addRows(row);
    });

    newRowsArray.forEach(function (row) {
      if (row) {
        table.appendChild(row);
      }
    });

    setHoverStates();
  }
}

// Adds rows to the newRowsArray to be added to the table later
function addRows(row, hidden = false, parentRow = null, grandparentRow = null) {
  let newRow = createRow(row);
  let saved = newRow.firstElementChild.firstElementChild;
  let firstColumn = newRow.firstElementChild;

  if (row[5].length != 0) {

    let arrowDiv = document.createElement("div");
    arrowDiv.style.display = "inline";
    arrowDiv.classList.add("arrow-container");
    arrowDiv.innerHTML = arrow;

    firstColumn.insertBefore(arrowDiv, saved);

    newRowsArray.push(newRow);
    row[5].forEach(function (subRow) {
      let newSubRow;
      if (hidden && parentRow) {
        newSubRow = addRows(subRow, true, newRow, parentRow);
      } else {
        newSubRow = addRows(subRow, true, newRow);
      }
      newRowsArray.push(newSubRow);
    });
  } else {

    let spaceDiv = document.createElement("div");
    spaceDiv.style.display = "inline";
    spaceDiv.classList.add('space-div');

    firstColumn.insertBefore(spaceDiv, saved);

    newRowsArray.push(newRow);
  }

  if (hidden && parentRow) {
    let parentToggle =
      parentRow.firstElementChild.querySelector(".table-checkbox");

    selectOtherToggle(parentToggle, newRow);

    if(grandparentRow) {
      let grandparentToggle = grandparentRow.firstElementChild.querySelector('.table-checkbox');

      selectOtherToggle(grandparentToggle, parentRow);
      selectOtherToggle(grandparentToggle, newRow);
    }

    newRow.classList.add("hidden");
    let dropDownArrow =
      parentRow.firstElementChild.firstElementChild.firstElementChild;
    dropDownArrow.addEventListener("click", function () {
      newRow.classList.toggle("hidden");
      if (newRow.classList.contains("hidden")) {
        dropDownArrow.setAttribute("transform", "rotate(0)");
      } else {
        dropDownArrow.setAttribute("transform", "rotate(90)");
      }
      if (grandparentRow) {
        let grandparentArrow =
          grandparentRow.firstElementChild.firstElementChild;
        grandparentArrow.addEventListener("click", function () {
          if (parentRow.classList.contains("hidden")) {
            newRow.classList.add("hidden");
          }
        });
      }
    });
  }
}

// Creates a row elements and returns it
function createRow(row) {
  let tags = row[0];
  let name = row[1];
  let volume = row[2];
  let visibility;
  if (row[4] == "increase") {
    visibility = row[3] + positive;
  } else {
    visibility = row[3] + negative;
  }

  let tableRow = document.createElement("tr");
  tableRow.classList.add("table-row");

  let tagsColumn = document.createElement("td");
  tagsColumn.classList.add("first-column");

  let radioButton = document.createElement("div");
  radioButton.classList.add("table-checkbox");

  let innerButton = document.createElement("span");
  innerButton.classList.add("table-checkbox-inner");

  let markButton = document.createElement("span");
  markButton.classList.add("table-checkbox-mark");

  innerButton.appendChild(markButton);
  radioButton.appendChild(innerButton);

  radioButton.addEventListener("click", function () {
    radioButton.classList.toggle("table-checkbox-checked");
  });
  tagsColumn.appendChild(radioButton);

  if (tags != "") {
    let tagToken = document.createElement("p");
    tagToken.classList.add("tag");
    tagToken.innerHTML = tags;
    tagsColumn.appendChild(tagToken);
  }

  let nameToken = document.createElement("p");
  nameToken.innerHTML = name;
  tagsColumn.appendChild(nameToken);

  let volumeColumn = document.createElement("td");
  volumeColumn.classList.add('center-column');
  volumeColumn.innerHTML = volume;

  let visColumn = document.createElement("td");
  visColumn.classList.add("percentage-col");
  visColumn.classList.add("center-column");
  visColumn.innerHTML = visibility;

  tableRow.appendChild(tagsColumn);
  tableRow.appendChild(volumeColumn);
  tableRow.appendChild(visColumn);

  return tableRow;
}

function selectOtherToggle(selected, rowToSelect) {
  selected.addEventListener("click", function () {
    let checked = selected.classList.contains("table-checkbox-checked");
    if (checked) {
      rowToSelect
        .querySelector(".table-checkbox")
        .classList.add("table-checkbox-checked");
    } else {
      rowToSelect
        .querySelector(".table-checkbox")
        .classList.remove("table-checkbox-checked");
    }
  });
}