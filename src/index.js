// получаем элементы DOM
import {
    friendsSearch,
    sortedSearch,
    friends,
    sortedFriends,
    friendsSave
} from './elements';

import {
    vkLogin,
    callApi
} from './model';

import {
    renderFriends
} from './helpers';

vkLogin()
    // авторизовываемся
    .then(() => console.log('1. Подключились к VK API'))
    // отправляем запрос на получение друзей
    .then(() => {
        return callApi('friends.get', {v: '5.62', fields: ['city', 'photo_200']})
    })
    // получили друзей из ВК
    .then(data => {
        console.log('data', data.response);
        let friendItems = data.response.items;
        console.log('friendItems', friendItems);
        // рендерим всем полученных друзей
        renderFriends(friends, friendItems, 'friend__plus');
    })
    .catch(error => console.error('1. Не удалось подключиться к VK API', error));
