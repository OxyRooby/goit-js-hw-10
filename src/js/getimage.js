"use strict";
import axios from "axios";

export default class NewsApiServices {
  constructor() {
    this.searchQuery = "";
    this.page = 1;
  }

  fetchImages() {
    const API_KEY = "35030411-cc5af9211173040252eb66c74";
    const BASE_URL = "https://pixabay.com/api/";
    const response = axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
    );
    this.incrementPage();
    return response;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
