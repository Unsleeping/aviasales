const formSearch = document.querySelector('.form-search'),
    inputCitiesFrom = formSearch.querySelector('.input__cities-from'),
    dropdownCitiesFrom = formSearch.querySelector('.dropdown__cities-from'),
    inputСitiesTo = formSearch.querySelector('.input__cities-to'),
    dropdownCitiesTo = formSearch.querySelector('.dropdown__cities-to');

const city = ['Moscow', 'St. Petersburg', 'Minsk', 'Karaganda', 
    'Chelyabinsk', 'Kerch', 'Volgograd', 'Samara', 'Dnepropetrovsk', 
    'Ekaterinburg', 'Odessa', 'Uhan', 'Shemkent', 'Nizhniy Novgorod',
    'Kaliningrad', 'Vrotclav', 'Rostov-na-dony'];


const showCity = (input, list) => {
    list.textContent = '';

    if (input.value === '') return

    const filterCity = city.filter((item, i) => {
        const fixItem = item.toLowerCase();
        return fixItem.includes(input.value.toLowerCase())
    });

    filterCity.forEach((item) => {
        const li = document.createElement('li');
        li.classList.add('dropdown__city');
        li.textContent = item;
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
    showCity(inputCitiesFrom, dropdownCitiesFrom)
});

dropdownCitiesFrom.addEventListener('click', () => {
    placeCity(event, inputCitiesFrom, dropdownCitiesFrom)
});

inputСitiesTo.addEventListener('input', () => {
    showCity(inputСitiesTo, dropdownCitiesTo)
});

dropdownCitiesTo.addEventListener('click', () => {
    placeCity(event, inputСitiesTo, dropdownCitiesTo)
});