import {
    isMatching
} from './helpers';

import {
    vkLogin,
    callApi
} from './model';

// элементы поиска
const mainSearch = document.querySelector('#mainSearch');
const sortedSearch = document.querySelector('#sortedSearch');

// блоки обертки списка друзей
const mainList = document.querySelector('#mainList');
const sortedList = document.querySelector('#sortedList');

// кнопка сохранения в локальном хранилище
const friendsSaveBtn = document.querySelector('#friendsSaveBtn');

// массивы для хранения друзей
let mainFriends = [];
let sortedFriends = [];

// Рендер списка друзей
function renderFriends(element, friends, btnClassName) {
    let list = '<ul class="friends__list">';

    for (let i = 0; i < friends.length; i++) {
        // проверка на отсутствие фотки
        if (!friends[i].photo_200) {
            continue;
        }

        // соединяем имя и фамилию
        let friendFullName = `${friends[i].first_name} ${friends[i].last_name}`;

        // создаем пункт друга, и заполняем его данными
        list += `<li class="friend" data-id="${i}" data-vk-id="${friends[i].id}" draggable="true">
            <div class="friend__left">
                <div class="friend__img">
                    <img src="${friends[i].photo_200}" alt="${friendFullName}">
                </div>
                <h4 class="friend__name">${friendFullName}</h4>
            </div>
            <button class="${btnClassName}" data-id="${i}" data-vk-id="${friends[i].id}"></button>
        </li>`;
    }

    list += '</ul>';

    // рендерим весь список в элемент
    element.innerHTML = list;
}

// подключение к VK API
vkLogin()
    .then(
        () => console.log('1. Подключились к VK API')
    )
    .then(
        () => {
            // отправляем запрос на получение друзей
            return callApi('friends.get', {
                v: '5.62',
                fields: ['city', 'photo_200']
            })
        }
    )
    // получили друзей из ВК
    .then(
        data => {
            // проверка на наличие в локальном хранилище друзей
            if (localStorage.getItem('mainFriends') && localStorage.getItem('sortedFriends')) {
                mainFriends = JSON.parse(localStorage.getItem('mainFriends'));
                sortedFriends = JSON.parse(localStorage.getItem('sortedFriends'));
            } else {
                mainFriends = data.response.items;
                sortedFriends = [];
            }

            // рендерим списки друзей
            renderFriends(mainList, mainFriends, 'friend__plus');
            renderFriends(sortedList, sortedFriends, 'friend__delete');
        }
    )
    .catch(error => console.error('1. Не удалось подключиться к VK API', error));


/*EVENTS*/

// событие добавления друзей, нажав на элемент плюс
mainList.addEventListener('click', event => {
    let element = event.target;

    // если это кнопка добавление с классом friend__plus
    if (element.classList.contains('friend__plus')) {
        // получаем ID вконтакте друга и приводим к number через +
        let friendId = +element.getAttribute('data-id');
        // получаем порядковый ID друга
        let friendVkId = +element.getAttribute('data-vk-id');

        // создаем переменную для хранения текущего друга
        let currentFriend = mainFriends.find(item => item.id === friendVkId);

        // удаляем из массива слева нашего друга
        mainFriends.splice(friendId, 1);

        // добавляем нашего друга в список справа
        sortedFriends.push(currentFriend);

        // рендерим списки друзей
        renderFriends(mainList, mainFriends, 'friend__plus');
        renderFriends(sortedList, sortedFriends, 'friend__delete');
    }
});

// событие удаления друзей, нажав на элемент крестик
sortedList.addEventListener('click', event => {
    // выбираем элемент по которому нажали
    let element = event.target;

    // если это крестик, кнопка удаления
    if (element.classList.contains('friend__delete')) {
        // получаем порядковый ID друга
        let friendId = +element.getAttribute('data-id');
        // получаем VK id для перебора друга из массива
        let friendVkId = +element.getAttribute('data-vk-id');

        // получаем текущего друга сортируя по vk id
        let currentFriend = sortedFriends.find(item => item.id === friendVkId);

        // добавляем его в основной список, вперед
        mainFriends.unshift(currentFriend);

        // удаляем из выбранного списка, использя порядковый id
        sortedFriends.splice(friendId, 1);

        // рендерим списки друзей
        renderFriends(mainList, mainFriends, 'friend__plus');
        renderFriends(sortedList, sortedFriends, 'friend__delete');
    }
});

// поиск слева
mainSearch.addEventListener('keyup', event => {
    // создаем новый массив для найденных друзей
    let searchFriends = [];

    console.log('searchMainFriends');

    // получаем значение со строки поиска
    let value = event.target.value;

    // проходимся циклом по всем друзьям
    for (let i = 0; i < mainFriends.length; i++) {
        // соединяем имя и фамилию
        let fullName = `${mainFriends[i].first_name} ${mainFriends[i].last_name}`;
        // если есть совпадение значения в fullName
        if (isMatching(fullName, value)) {
            // добавляем друга из текущей итерации
            searchFriends.push(mainFriends[i]);
        }
    }
    // вызываем рендер основного списка друзей
    renderFriends(mainList, searchFriends, 'friend__plus');
});

// поиск справа
sortedSearch.addEventListener('keyup', event => {
    // создаем новый массив для найденных друзей
    let searchFriends = [];

    console.log('searchSortedFriends');

    // получаем значение со строки поиска
    let value = event.target.value;

    // проходимся циклом по всем друзьям
    for (let i = 0; i < sortedFriends.length; i++) {
        // соединяем имя и фамилию
        let fullName = `${sortedFriends[i].first_name} ${sortedFriends[i].last_name}`;
        // если есть совпадение значения в fullName
        if (isMatching(fullName, value)) {
            // добавляем друга из текущей итерации
            searchFriends.push(sortedFriends[i]);
        }
    }
    // вызываем рендер основного списка друзей
    renderFriends(sortedList, searchFriends, 'friend__delete');
});

// сохранение
friendsSaveBtn.addEventListener('click', () => {
    localStorage.setItem('mainFriends', JSON.stringify(mainFriends));
    localStorage.setItem('sortedFriends', JSON.stringify(sortedFriends));
});

/* dnd events */
mainList.addEventListener('dragstart', event => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('friend', event.target.getAttribute('data-vk-id'));
    return true;
});

sortedList.addEventListener('dragstart', event => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('friend', event.target.getAttribute('data-vk-id'));
    return true;
});

sortedList.addEventListener('dragenter', moveDragEnter);
sortedList.addEventListener('dragover', moveDragOver);
sortedList.addEventListener('drop', event => {
    event.preventDefault();
    let friendVkId = +event.dataTransfer.getData('friend');
    let currentFriend = null;
    // перебираем друзей
    for (let i = 0; i < mainFriends.length; i++) {
        if (mainFriends[i].id === friendVkId) {
            // присваиваем найденого друга
            currentFriend = mainFriends[i];
            // добавляем друга в выбранный список
            sortedFriends.push(currentFriend);
            // удаляем друга из текущего списка
            mainFriends.splice(i, 1);
            // прерываем цикл
            break;
        }
    }
    // рендерим списки друзей
    renderFriends(mainList, mainFriends, 'friend__plus');
    renderFriends(sortedList, sortedFriends, 'friend__delete');

    // очищаем поля поиска
    mainSearch.value = '';
    sortedSearch.value = '';
});

mainList.addEventListener('dragenter', moveDragEnter);
mainList.addEventListener('dragover', moveDragOver);
mainList.addEventListener('drop', event => {
    event.preventDefault();
    let friendVkId = +event.dataTransfer.getData('friend');
    let currentFriend = null;
    // перебираем друзей
    for (let i = 0; i < sortedFriends.length; i++) {
        if (sortedFriends[i].id === friendVkId) {
            // присваиваем найденого друга
            currentFriend = sortedFriends[i];
            // добавляем друга в выбранный список
            mainFriends.unshift(currentFriend);
            // удаляем друга из текущего списка
            sortedFriends.splice(i, 1);
            // прерываем цикл
            break;
        }
    }
    // рендерим списки друзей
    renderFriends(mainList, mainFriends, 'friend__plus');
    renderFriends(sortedList, sortedFriends, 'friend__delete');

    // очищаем поля поиска
    mainSearch.value = '';
    sortedSearch.value = '';
});

function moveDragEnter(event) {
    event.preventDefault();
    return true;
}

function moveDragOver(event) {
    event.preventDefault();
}
