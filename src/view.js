// получаем элементы
import {
    friendsSearch,
    sortedSearch,
    friends,
    sortedFriends,
    friendsSaveBtn
} from './elements';

// Рендер списка друзей
export function renderFriends(element, friends, btnClassName) {
    let list = '<ul class="friends__list">';

    for (let i = 0; i < friends.length; i++) {
        if (!friends[i].photo_200) {
            continue;
        }
        let friendFullName = `${friends[i].first_name} ${friends[i].last_name}`;
        list += `<li class="friend" data-id="${friends[i].id}" draggable="true">
            <div class="friend__left">
                <div class="friend__img">
                    <img src="${friends[i].photo_200}" alt="${friendFullName}">
                </div>
                <h4 class="friend__name">${friendFullName}</h4>
            </div>
            <button class="${btnClassName}" data-id="${friends[i].id}"></button>
        </li>`;
    }

    list += '</ul>';

    element.innerHTML = list;
}

// поиск друзей
export function searchFriend() {
    console.log('Поиск...');
}

// сохранение друзей в локальном хранилище
export function saveFriends() {
    console.log('Сохранение...');
}

// добавление друзей
export function addFriend(event) {
    let element = event.target;

    // если это кнопка добавление с классом friend__plus
    if (element.classList.contains('friend__plus')) {
        // получаем ID вконтакте друга и приводим к number через +
        let friendId = +element.getAttribute('data-id');

        // вытаскиваем из локального хранилища всех друзей слева
        let leftFriends = JSON.parse(localStorage.getItem('leftFriends'));

        // создаем переменную для хранения текущего друга
        let currentFriend = leftFriends.filter(item => item.id === friendId);

        // удаляем из массива слева нашего друга
        leftFriends.splice(friendId, 1);

        // добавляем нашего друга в список справа
    }
}
