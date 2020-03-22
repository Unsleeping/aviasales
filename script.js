const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputСitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart');


let city = [];

const citiesApi = 'cities.json',
    citiesApi_link = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'a866e1486ad6e2654346f27969b715f3',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';

// get Data from the service
const getData = (url, callback) => {
    const request = new XMLHttpRequest(); //use constructor to create request

    request.open('GET', url); // obtain data from the server and send there our url 
    request.addEventListener('readystatechange', () => {
        if (request.readyState !== 4) return;

        if (request.status === 200) { //obtain positive data from the server
            callback(request.response);
        } else {
            console.error(request.status);
        }
    });
    request.send();
};

const showCity = (input, list) => {
    list.textContent = '';

    if (input.value === '') return

    const filterCity = city.filter((item) => {
        const fixItem = item.name.toLowerCase();
        return fixItem.includes(input.value.toLowerCase())
    });

    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item.name;
        list.append(li);
    });
};

const placeCity = (event, input, list) => {
    const target = event.target;
    if (target.tagName.toLowerCase() === 'li') {
        input.value = target.textContent;
        list.textContent = '';
    }
}

inputCitiesFrom.addEventListener('input', () => {
    showCity(inputCitiesFrom, dropdownCitiesFrom);
});

dropdownCitiesFrom.addEventListener('click', () => {
    placeCity(event, inputCitiesFrom, dropdownCitiesFrom);
});

inputСitiesTo.addEventListener('input', () => {
    showCity(inputСitiesTo, dropdownCitiesTo);
});

dropdownCitiesTo.addEventListener('click', () => {
    placeCity(event, inputСitiesTo, dropdownCitiesTo);
});

// getData(citiesApi, (data) => {  // proxy + citiesApi_link
//     city = JSON.parse(data).filter(() => {
//         return item.name
//     });
// });

// the same but shortest
getData(citiesApi, 
    (data) => city = JSON.parse(data).filter((item) => item.name));