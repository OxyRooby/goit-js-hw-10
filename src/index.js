import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import listItemTemplate from './templates/list.hbs';
import cardTemplate from './templates/card.hbs';


const DEBOUNCE_DELAY = 300;

const searchInputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

countryListEl.style.listStyle = "none";


const handleCountryInput = (event) => {
    event.preventDefault();

    const seekedCountry = event.target.value.trim();

    fetchCountries(seekedCountry).then(data => {
        if (!data) {
            countryListEl.innerHTML = '';
            countryInfoEl.innerHTML = '';
        } else if (data.length === 1) {
          countryListEl.innerHTML = '';
          countryInfoEl.innerHTML = cardTemplate({
            name: data[0].name,
            flags: data[0].flags,
            capital: data[0].capital.join(', '),
            population: data[0].population,
            languages: Object.values(data[0].languages).join(', '),
          });
        } else if (data.length > 10) {
          countryListEl.innerHTML = '';
          countryInfoEl.innerHTML = '';
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else {
          const countryes = data.reduce(
            (total, country) => total + listItemTemplate(country),
            ''
          );

          countryListEl.innerHTML = countryes;
        } 
    });
};

searchInputEl.addEventListener(
  'input',
  debounce(handleCountryInput, DEBOUNCE_DELAY)
);