let leftFriends = [];
let rightFriends = [];

// создаем метки в локальном хранилище, на выбранных друзей
localStorage.setItem('leftFriends', '');
localStorage.setItem('rightFriends', '');

// получаем элементы DOM
import {
    friendsSearch, sortedSearch, friends, sortedFriends, friendsSaveBtn
} from './elements';

import {
    vkLogin, callApi
} from './model';

import {
    renderFriends, searchFriend, saveFriends, addFriend
} from './view';

vkLogin()
    // авторизовываемся
    .then(() => console.log('1. Подключились к VK API'))
    // отправляем запрос на получение друзей
    .then(() => {
        return callApi('friends.get', {v: '5.62', fields: ['city', 'photo_200']})
    })
    // получили друзей из ВК
    .then(data => {
        console.log('2. Получили друзей с ВК', data.response);

        // проверка на наличие в локальном хранилище друзей
        if (localStorage.getItem('leftFriends') && localStorage.getItem('rightFriends')) {
            leftFriends = JSON.parse(localStorage.getItem('leftFriends'));
            rightFriends = JSON.parse(localStorage.getItem('rightFriends'));
        } else {
            leftFriends = data.response.items;
            localStorage.setItem('leftFriends', JSON.stringify(data.response.items));
        }

        // рендерим всем полученных друзей
        renderFriends(friends, leftFriends, 'friend__plus');
        renderFriends(sortedFriends, rightFriends, 'friend__delete');
    })
    .catch(error => console.error('1. Не удалось подключиться к VK API', error));

// событие добавления друзей, нажав на элемент списка
friends.addEventListener('click', () => {
    addFriend();
});

// поиск слева
friendsSearch.addEventListener('keyup', searchFriend);

// поиск справа
sortedSearch.addEventListener('keyup', searchFriend);

// сохранение
friendsSaveBtn.addEventListener('click', saveFriends);
