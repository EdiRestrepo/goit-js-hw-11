'use strict';
import '../css/common.css'
import '../css/styles.css';

import { services } from './axiosImages';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

//Adapter
const refs = {
  form: document.querySelector('.search-form'),
  btnForm: document.querySelector('[type="submit"]'),
  galleryCards: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};



//Proxy
const handleFormUtils = {
  getImages: function(event){
    event.preventDefault();
    let searchTerm = "asdfsaasdf";
    if(`${refs.form['searchQuery'].value}` !== ''){
      searchTerm = `${refs.form['searchQuery'].value}`;
    }
    layoutUtils.refreshImagesList(searchTerm);
  }
}

//Mediator
const layoutUtils = {
  renderImages: function (images){
    const markup = images
    .map(({webformatURL,largeImageURL,tags,likes,views,comments,downloads}) => {
      return `
      <div class="photo-card">
      <a class="gallery__item" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="270" height="180" />
  </a>
  <div class="info">
    <p class="info-item">
      <b><span>Likes</span></br>${likes}</b>
    </p>
    <p class="info-item">
      <b><span>Views</span></br>${views}</b>
    </p>
    <p class="info-item">
      <b><span>Comments</span></br>${comments}</b>
    </p>
    <p class="info-item">
      <b><span>Downloads</span></br>${downloads}</b>
    </p>
  </div>
</div>
      `;
    })
    .join("");
    refs.galleryCards.innerHTML = markup;
    let lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
   });
  },

  refreshImagesList: function(searchTerm){
    services.getImages(searchTerm).then(images => {
      if(images.data.hits.length === 0){
        Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        return;
      };
      Notify.success(`Hooray! We found ${images.data.totalHits} images.`);
      return this.renderImages(images.data.hits);
    });
  }
}

refs.form.addEventListener('submit', handleFormUtils.getImages);







