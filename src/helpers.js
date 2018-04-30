export function renderFriends(element, friends, btnClassName) {
    let list = '<ul class="friends__list">';

    friends.forEach((item) => {
        let friendFullName = `${item.first_name} ${item.last_name}`;
        list += `<li class="friend">
            <div class="friend__left">
                <div class="friend__img">
                    <img src="${item.photo_200}" alt="${friendFullName}">
                </div>
                <h4 class="friend__name">${friendFullName}</h4>
            </div>
            <button class="${btnClassName}"></button>
        </li>`;
    });

    list += '</ul>';

    element.innerHTML = list;
}
