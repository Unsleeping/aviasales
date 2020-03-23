// data
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



// инициализация функций

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
};

const renderCheapDay = (cheapTicketOnThatDay) => {
    console.log(cheapTicketOnThatDay); 
};

const renderCheapYear = (cheapTickets) => {
    cheapTickets.sort((a, b) => {
        if (a.date > b.date) {
          return 1;
        }
      });
    console.log(cheapTickets); 
};

const renderCheap = (data, date) => { 
    const CheapTickets = JSON.parse(data).best_prices;    
    const CheapTicketOnThatDay = CheapTickets.filter((item) => item.depart_date === date);

    renderCheapYear(CheapTickets);
    renderCheapDay(CheapTicketOnThatDay);

};



// обработчики событий

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

formSearch.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
        from: city.find((item) => inputCitiesFrom.value === item.name).code,  // search the same item.code in the cities and return it if found
        to: city.find((item) => inputСitiesTo.value === item.name).code,
        date: inputDateDepart.value,
    };

    // the same but with interpolation
    const requestString2 = `?depart_date=${formData.date}&origin=${formData.from}&destination=${formData.to}&one_way=true`;

    const requestString = '?depart_date=' + formData.date +
     '&origin=' +formData.from +
     '&destination=' + formData.to +
     '&one_way=true';

    getData(calendar + requestString, (response) => {
        renderCheap(response, formData.date);
    });
});

// вызов функций

/* 
getData(citiesApi, (data) => {  // proxy + citiesApi_link
    city = JSON.parse(data).filter(() => {
        return item.name
    });
 });
 */

// the same but shortest
getData(proxy + citiesApi_link, 
    (data) => city = JSON.parse(data).filter((item) => item.name));



/* check prices for one direction Ekaterinburg -> Kaliningrad

getData(proxy + calendar +
    '?depart_day=2020-05-29&origin=SVX&destination=KGD&one_way=true&token=' + API_KEY,
    (data) => {
    const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === '2020-05-29')
    console.log(cheapTicket);
});
*/

// upd check prices for any direction

