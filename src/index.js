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

vkLogin()
    .then(() => console.log('1. Подключились к VK API'))
    // отправляем запрос на получение друзей
    .then(() => {
        return callApi('friends.get', {v: '5.62', fields: ['city', 'photo_200']})
    })
    .then(data => {
        console.log('data', data.response);
    })
    .catch(error => console.error('1. Не удалось подключиться к VK API', error));
