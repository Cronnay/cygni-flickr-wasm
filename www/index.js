import { get_flickr_images } from "wasm-brownbag";
const catInput = document.querySelector(".cat-input");
const catButton = document.querySelector(".cat-button");

let photoList = [];
let pageNumberCurrent = 1;
let pageNumberLast = 0;
let currentCat = "dog";

catButton.addEventListener("click", getNewImageCategory);
window.onscroll = function (ev) {
  if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
    loadNextPage();
  }
};

async function getNewImageCategory(event) {
  event.preventDefault();
  document.getElementById("gridRow").innerHTML = "";
  if (catInput.value != "") {
    await getImagesForGrid(catInput.value, true);
    currentCat = catInput.value;
    catInput.value = "";
  } else {
    alert("Please enter in a Tag to search for");
  }
}

async function getImagesForGrid(tag, create) {
    isLoading("toploader", true);
    const responseData = await get_flickr_images(currentCat, pageNumberCurrent);
    if (responseData.photos != null) {
        pageNumberLast = responseData.photos.pages;
        photoList = responseData.photos.photo;
        photoList = filterImages(photoList);
        generateGrid(photoList, create);
    } else {
        alert("Invalid Api Request");
    }
    isLoading("toploader", false);
}

function isLoading(position, value) {
  if (value) {
    document.getElementById(position).style.display = "block";
  } else {
    document.getElementById(position).style.display = "none";
  }
}

async function loadNextPage() {
  pageNumberCurrent++;
  isLoading("botloader", true);
  if (pageNumberCurrent <= pageNumberLast) {
    await getImagesForGrid(currentCat, false);
  } else {
    alert("No more images to load");
  }
  isLoading("botloader", false);
}

function generateGrid(photoList, create) {
  let colLength = Math.floor((photoList.length - 10) / 4);
  for (let i = 0; i < 4; i++) {
    let imgCol = "";
    let imgNew = "";
    if (create == true) {
      imgCol = document.createElement("div");
      imgCol.classList.add("column");
      imgCol.setAttribute("id", "col" + i);
    } else {
      imgCol = document.getElementById("col" + i);
    }
    for (let j = 0; j < colLength; j++) {
      let arrayId = colLength * i + j;
      imgNew = document.createElement("img");
      imgNew.setAttribute(
        "src",
        generateImageUrl(
          photoList[arrayId].farm,
          photoList[arrayId].server,
          photoList[arrayId].id,
          photoList[arrayId].secret
        )
      );
      imgNew.setAttribute("class", "imgGrid");
      imgCol.appendChild(imgNew);
      const grid = document.getElementById("gridRow");
      grid.appendChild(imgCol);
    }
  }
}

function filterImages(photoList) {
  let newList = [];
  for (let j = 0; j < photoList.length; j++) {
    if (photoList[j].server != 0) {
      newList.push(photoList[j]);
    }
  }
  return newList;
}

function generateImageUrl(farm, server, id, secret) {
  let url =
    "http://farm" +
    farm +
    ".staticflickr.com/" +
    server +
    "/" +
    id +
    "_" +
    secret +
    ".jpg";
  return url;
}

function start() {
    getImagesForGrid(currentCat, true);
    isLoading("botloader", false);
};
start();