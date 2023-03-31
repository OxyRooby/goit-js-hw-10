'use strict';

import Notiflix from 'notiflix';

const BASE_URL = 'https://restcountries.com';

export const fetchCountries = name =>
  fetch(
    `${BASE_URL}/v3.1/name/${name}?fields=name,flags,capital,population,languages`
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    })
    .catch(err => {
      err = Notiflix.Notify.failure('Oops, there is no country with that name');
    });
