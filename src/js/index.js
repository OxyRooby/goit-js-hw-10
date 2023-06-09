import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import NewApiServices from "./getimage.js";

const form = document.querySelector(".search-form");
const gallery = document.querySelector(".gallery");
const loadMoreBtn = document.querySelector(".load-more");
const sentielEl = document.querySelector(".sentiel");

const lightbox = new SimpleLightbox(".gallery a", {});
const newsApiServices = new NewApiServices();

form.addEventListener("submit", onSearch);
loadMoreBtn.addEventListener("click", onLoadMoreBtn);

function onSearch(e) {
    e.preventDefault();

    if (!getQuery()) { return; }

    try {
        fetchData();
    } catch (error) {
        console.log(error);
        Notiflix.Notify.failure("Oops, something went wrong...");
    }
}

function createImagesMarkup(images) {
    return images
        .map(
            ({
                webformatURL,
                largeImageURL,
                likes,
                views,
                comments,
                downloads,
                tags,
            }) => {
                return `
        <div class="photo-card">
          <div class="thumb">
            <a class="image" href="${webformatURL}">
            <img src="${largeImageURL}" alt="${tags}" loading="lazy" />
            </a>
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </div>
      `;
            }
        )
        .join("");
}

function addImagesToGallery(markup) {
    gallery.insertAdjacentHTML("beforeend", markup);
    lightbox.refresh();
}

function clearGallery() {
    gallery.innerHTML = "";
}

function onScroll() {
  const { height: cardHeight } =
      gallery.firstElementChild.getBoundingClientRect();
    
  window.scrollBy({
    top: cardHeight,
    behavior: "smooth",
  });
}

async function onLoadMoreBtn() {
    try {
        const response = await newsApiServices.fetchImages();
        const nextPageMarkup = createImagesMarkup(response.data.hits);
        addImagesToGallery(nextPageMarkup);
        let timeoutScroll = setTimeout(onScroll, 500);

        if (response.data.total === response.data.totalHits) {
            endCollection();
        }
    } catch (error) {
        console.log(error);
        Notiflix.Notify.failure("Oops, something went wrong...");
    }
}

function endCollection() {
    loadMoreBtn.classList.toggle("is-hidden");
    Notiflix.Notify.info(
        "Were sorry, but you've reached the end of search results"
    );
}

function getQuery() {
    const formData = new FormData(form);
    newsApiServices.query = formData.get("searchQuery").trim();
    newsApiServices.resetPage();
    clearGallery();

    if (newsApiServices.query === "") {
        Notiflix.Notify.failure("Input query!");
        return false;
    }
    return true;
}

async function fetchData() {
    const response = await newsApiServices.fetchImages();
    const hits = response.data.hits;
    const totalHits = response.data.totalHits;
    
    if (hits.length === 0) {
        Notiflix.Notify.failure(
            "Sorry, there are no images matching your search query. Please try again."
        );
        clearGallery();
        return;
    }

    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    const imagesMarkup = createImagesMarkup(hits);
    addImagesToGallery(imagesMarkup);
    loadMoreBtn.classList.toggle("is-hidden");
}