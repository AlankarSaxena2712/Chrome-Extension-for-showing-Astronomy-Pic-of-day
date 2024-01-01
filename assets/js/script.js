const API_KEY = "lzJ4sd50F2KeyDlu0MI1eM4Jvreku8uDvj22JZxL";
const loader = document.querySelector(".loader");
const changeDateBtn = document.querySelector("#changeDateBtn");
const mediaContainer = document.querySelector(".media-container");
const title = document.querySelector("#title");
const date = document.querySelector("#date");
const description = document.querySelector("#desc");

const showLoader = () => {
  loader.classList.remove("hidden");
};

const hideLoader = () => {
  loader.classList.add("hidden");
};

const showMediaLoader = () => {
  const loader = document.createElement("div");
  loader.classList.add("media-loader");
  mediaContainer.appendChild(loader);
};

const hideMediaLoader = () => {
  const mediaLoader = document.querySelector(".media-loader");
  mediaLoader && mediaLoader.classList.add("hidden");
};

const getAPOD = async (date = null) => {
  try {
    hideMediaLoader();
    showLoader();
    if (date === null) {
      date = new Date().toISOString().slice(0, 10);
    }
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}&thumbs=true`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  } finally {
    hideLoader();
  }
};

const renderAPOD = async (dt = null) => {
  const apod = await getAPOD(dt);
  const mediaType = apod.media_type;

  title.textContent = apod.title;
  date.textContent = new Date(apod.date).toDateString();
  description.textContent = apod.explanation;

  showMediaLoader();
  if (mediaType === "image") {
    const apodImage = document.createElement("img");
    apodImage.src = apod.url;
    apodImage.classList.add("media");
    apodImage.onload = () => {
      hideMediaLoader();
    };
    mediaContainer.appendChild(apodImage);
  } else if (mediaType === "video") {
    const apodVideo = document.createElement("iframe");
    apodVideo.src = apod.url;
    apodVideo.classList.add("media");
    apodVideo.onload = () => {
      hideMediaLoader();
    };
    mediaContainer.appendChild(apodVideo);
  } else {
    console.error("Unknown media type");
  }
};

changeDateBtn.addEventListener("click", async () => {
  $("#changeDateVal").datepicker("show");
});

$("#changeDateVal").datepicker({
  dateFormat: "yy-mm-dd",
  onSelect: async (date) => {
    mediaContainer.innerHTML = "";
    await renderAPOD(date);
  },
  gotoCurrent: true,
  maxDate: new Date(),
});

$(function () {
  $("#changeDateVal").datepicker();
});

renderAPOD();
