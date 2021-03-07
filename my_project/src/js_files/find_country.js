import * as _debounce from 'lodash/debounce';
import markup from '../hbs_files/country_markup.hbs';
import countryNames from '../hbs_files/country_names.hbs';
import * as PNotify from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

const MAIN_URL = 'https://restcountries.eu/rest/v2/';
const countriesDivRef = document.querySelector('.countries-div');
const inputRef = document.querySelector('.search-input');

let inputValue = '';

const answerMoreThenTen = answers => {
  console.log('no');
  PNotify.notice({
    title: 'NEED MORE TEXT',
    icon: false,
    sticker: false,
    delay: 1000,
  });
};

const answerMoreThenTwoLessThenTen = answers => {
  const countryName = answers.forEach(answer => {
    const name = countryNames(answer);
    return countriesDivRef.insertAdjacentHTML('beforeend', name);
  });
};

const answerIsOne = answers => {
  const forEachAnswer = answers.forEach(answer => {
    countriesDivRef.innerHTML = '';
    const country = markup(answer);
    return countriesDivRef.insertAdjacentHTML('beforeend', country);
  });
};

const findCountry = () => {
  inputValue = inputRef.value;
  countriesDivRef.innerHTML = '';
  if (inputValue === '') {
    countriesDivRef.innerHTML = '';
  }
  fetch(`${MAIN_URL}name/${inputValue}`)
    .then(response => {
      return response.json();
    })
    .then(answers => {
      console.log(answers);
      if (answers.length > 10) {
        answerMoreThenTen(answers);
      } else if (answers.length >= 2 && answers.length <= 10) {
        answerMoreThenTwoLessThenTen(answers);
      } else if (answers.length === 1) {
        answerIsOne(answers);
      }
    });
};

const debouncedfindCountry = _debounce(findCountry, 500);

inputRef.addEventListener('input', debouncedfindCountry);
