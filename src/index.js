import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const ref = {
  search: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

ref.search.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  const search = e.target.value.trim();
  if (search !== '') {
    fetchCountries(search)
      .then(renderMarkup)
      .catch(error => console.log(error));
  }

  function renderMarkup(countries) {
    ref.countryList.innerHTML = '';
    ref.countryInfo.innerHTML = '';

    if (countries.length > 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
      return;
    }

    if (countries.length > 2 && countries.length < 10) {
      const markcupListCountries = countries
        .map(
          ({ name, flags }) =>
            `<li class='country'>
            <img class='country-flag' alt="${name.official}" src='${flags.svg}' width=30>
            <span class='country-name'>${name.official}</span></li>`
        )
        .join('');

      ref.countryList.innerHTML = markcupListCountries;
      return;
    }

    if (countries.length === 1) {
      const [{ name, flags, capital, population, languages }] = countries;
      ref.countryInfo.innerHTML = `<div class='container'>
                <img class='country-flag' alt=${name.official} src='${
        flags.svg
      }' width=70>
                <h1 class='country-title'>${name.official}</h1>
            </div>
            <p><span class='title-info'>Capital:</span> ${capital}</p>
            <p><span class='title-info'>Population:</span> ${population}</p>
            <p><span class='title-info'>Languages:</span> ${Object.values(
              languages
            ).join('')}</p>`;
      return;
    }
  }
}
