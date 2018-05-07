// элементы поиска
const friendsSearch = document.querySelector('#friendsSearch');
const sortedSearch = document.querySelector('#sortedSearch');

// блоки обертки списка друзей
const friends = document.querySelector('#friends');
const sortedFriends = document.querySelector('#sortedFriends');

// кнопка сохранения в локальном хранилище
const friendsSaveBtn = document.querySelector('#friendsSaveBtn');


// массивы для хранения друзей
let leftFriends = [];
let rightFriends = [];

// авторизация vk
function vkLogin() {
    return new Promise((resolve, reject) => {
        // инициализируем приложение
        VK.init({
            apiId: 5900685 // 5267932
        });

        // авторизовываемся
        VK.Auth.login(data => {
            if (data.session) {
                console.log('vk ok');
            }
            // если не удалось соединиться
            if (data.status !== "connected") {
                reject();
            } else {
                // если соединение удалось
                resolve()
            }
        }, 2) // метка 2 - получение информации о друзьях
    })
}

// отправка запросов в api vk
function callApi(metod, params) {
    return new Promise((resolve, reject) => {
        VK.api(metod, params, result => {
            if (result.error) {
                reject(result);
            }
            resolve(result)
        });
    })
}


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

        // console.log(friends[i]);

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

// поиск друзей
function searchFriend() {
    console.log('Поиск...');
}

// сохранение друзей в локальном хранилище
function saveFriends() {
    console.log('Сохранение...');
    console.log('leftFriends', leftFriends);
    console.log('rightFriends', rightFriends);
    localStorage.setItem('mainFriends', JSON.stringify(leftFriends));
    localStorage.setItem('sortedFriends', JSON.stringify(rightFriends));
}

// добавление друзей
function addFriend(event) {
    let element = event.target;

    // если это кнопка добавление с классом friend__plus
    if (element.classList.contains('friend__plus')) {
        // получаем ID вконтакте друга и приводим к number через +
        let friendId = +element.getAttribute('data-id');
        // получаем порядковый ID друга
        let friendVkId = +element.getAttribute('data-vk-id');

        console.log('friendId', friendId);
        console.log('friendVkId', friendVkId);

        // создаем переменную для хранения текущего друга
        let currentFriend = leftFriends.find(item => item.id === friendVkId);

        // удаляем из массива слева нашего друга
        leftFriends.splice(friendId, 1);

        // добавляем нашего друга в список справа
        rightFriends.push(currentFriend);

        // cons
        console.log('currentFriend', currentFriend);
        console.log('rightFriends', rightFriends);

        // рендерим списки друзей
        renderFriends(friends, leftFriends, 'friend__plus');
        renderFriends(sortedFriends, rightFriends, 'friend__delete');
    }
}

// удаление друзей из списка
function deleteFriend(event) {
    // выбираем элемент по которому нажали
    let element = event.target;

    console.log('element', element);

    // если это крестик, кнопка удаления
    if (element.classList.contains('friend__delete')) {
        // получаем порядковый ID друга
        let friendId = +element.getAttribute('data-id');
        // получаем VK id для перебора друга из массива
        let friendVkId = +element.getAttribute('data-vk-id');
        console.log('friendId', friendId);
        console.log('friendVkId', friendVkId);

        // получаем текущего друга сортируя по vk id
        let currentFriend = rightFriends.find(item => item.id === friendVkId);

        // добавляем его в основной список, вперед
        leftFriends.unshift(currentFriend);

        // удаляем из выбранного списка, использя порядковый id
        rightFriends.splice(friendId, 1);

        // рендерим списки друзей
        renderFriends(friends, leftFriends, 'friend__plus');
        renderFriends(sortedFriends, rightFriends, 'friend__delete');
    }
}

vkLogin()
    .then(() => console.log('1. Подключились к VK API'))
    // отправляем запрос на получение друзей
    .then(() => {
        return callApi('friends.get', {v: '5.62', fields: ['city', 'photo_200']})
    })
    // получили друзей из ВК
    .then(data => {
        console.log('2. Получили друзей с ВК', data.response);

        // проверка на наличие в локальном хранилище друзей
        if (localStorage.getItem('mainFriends') && localStorage.getItem('sortedFriends')) {
            leftFriends = JSON.parse(localStorage.getItem('mainFriends'));
            rightFriends = JSON.parse(localStorage.getItem('sortedFriends'));
        } else {
            leftFriends = data.response.items;
            rightFriends = [];
        }

        // рендерим списки друзей
        renderFriends(friends, leftFriends, 'friend__plus');
        renderFriends(sortedFriends, rightFriends, 'friend__delete');
    })
    .catch(error => console.error('1. Не удалось подключиться к VK API', error));


/*EVENTS*/

// событие добавления друзей, нажав на элемент плюс
friends.addEventListener('click', addFriend);

// событие удаления друзей, нажав на элемент крестик
sortedFriends.addEventListener('click', deleteFriend);

// поиск слева
friendsSearch.addEventListener('keyup', searchFriend);

// поиск справа
sortedSearch.addEventListener('keyup', searchFriend);

// сохранение
friendsSaveBtn.addEventListener('click', saveFriends);
