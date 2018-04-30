// авторизация vk
export function vkLogin() {
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
        }, 2)
    })
}

// работа с api vk
export function callApi(metod, params) {
    return new Promise((resolve, reject) => {
        VK.api(metod, params, result => {
            if (result.error) {
                reject(result);
            }
            resolve(result)
        });
    })
}
