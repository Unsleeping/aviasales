// data
const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputСitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to'),
    inputDateDepart = formSearch.querySelector('.input__date-depart'),
    cheapestTicket = document.getElementById('cheapest-ticket'),
    otherCheapTickets = document.getElementById('other-cheap-tickets');


let city = [];

const citiesApi = 'cities.json',
    citiesApi_link = 'http://api.travelpayouts.com/data/ru/cities.json',
    proxy = 'https://cors-anywhere.herokuapp.com/',
    API_KEY = 'a866e1486ad6e2654346f27969b715f3',
    calendar = 'http://min-prices.aviasales.ru/calendar_preload';
    MAX_COUNT = 10;



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
        // return fixItem.includes(input.value.toLowerCase()) // сортируем выпадающий список
        return fixItem.startsWith(input.value.toLowerCase())
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

const getNameCity = (code) => {
    const objCity = city.find((item) => item.code === code)
    return objCity.name;
};

const getDate = (date) => {
    return new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
};

const getChanges = (num) => {
    if (num) {
        return num === 1 ? 'С одной пересадкой' : 'С двумя пересадками';
    } else {
        return 'Без пересадок';
    }
};

const getLink = (data) => {
    let link = 'https://www.aviasales.ru/search/';
    link +=  data.origin;

    const date = new Date(data.depart_date);

    const day = date.getDay();
    link += day < 10 ? '0' + day : day;

    const month = date.getMonth() + 1; //  cause Jan -> 0, Feb -> 1 ...
    link += day < 10 ? '0' + month : month;

    link += data.destination;

    link += '1'; // $$$$: 1$$$ -> 1 adult, 11$$ -> 1 adult 1 children, 111$ -> 1 adult 1 children under 2 years old
    return link;
};

const createCard = (data) => {
    const ticket = document.createElement('artickle');
    ticket.classList.add('ticket');

    let deep;

    if (data) {
        deep = `
        <h3 class="agent">${data.gate}</h3>
        <div class="ticket__wrapper">
            <div class="left-side">
                <a href="${getLink(data)}" target="_blank" class="button button__buy">Купить
                    за ${data.value}₽</a>
            </div>
            <div class="right-side">
                <div class="block-left">
                    <div class="city__from">Вылет из города
                        <span class="city__name">${getNameCity(data.origin)}</span>
                    </div>
                    <div class="date">${getDate(data.depart_date)}</div>
                </div> 

                <div class="block-right">
                    <div class="changes">${getChanges(data.number_of_changes)}</div>
                    <div class="city__to">Город назначения:
                        <span class="city__name">${getNameCity(data.destination)}</span>
                    </div>
                </div>
            </div>
        </div>
        `;
    } else {
        deep = '<h3>К сожалению, билетов на текущую дату не нашлось</h3>'
    }

    ticket.insertAdjacentHTML('afterbegin', deep);
    return ticket;
};

const renderCheapDay = (cheapTicketOnThatDay) => {
    cheapestTicket.style.display = 'block';
    cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>';
    const ticket = createCard(cheapTicketOnThatDay[0]); 
    cheapestTicket.append(ticket);
};

const renderCheapYear = (cheapTickets) => {
    otherCheapTickets.style.display = 'block';
    otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>';

    cheapTickets.sort((a, b) => a.value - b.value);

    for (let i = 0; i < cheapTickets.length && i < MAX_COUNT; i++){
        const ticket = createCard(cheapTickets[i]);
        otherCheapTickets.append(ticket);
    }

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
        from: city.find((item) => inputCitiesFrom.value === item.name),  // search the same item.code in the cities and return it if found
        to: city.find((item) => inputСitiesTo.value === item.name),
        date: inputDateDepart.value,
    };
    if (formData.to && formData.from) {

        // using interpolation to make the GET request
        const requestString2 = `?depart_date=${formData.date}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`;

        getData(calendar + requestString2, (response) => {
            renderCheap(response, formData.date);
        });
    } else {
        alert('Введите корректное название города');
    };
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
    city.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
    });



/* check prices for one direction Ekaterinburg -> Kaliningrad

getData(proxy + calendar +
    '?depart_day=2020-05-29&origin=SVX&destination=KGD&one_way=true&token=' + API_KEY,
    (data) => {
    const cheapTicket = JSON.parse(data).best_prices.filter(item => item.depart_date === '2020-05-29')
    console.log(cheapTicket);
});
*/

// upd check prices for any direction

