// функция поиска подстроки в строке
export function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    return full.indexOf(chunk) + 1 ? true : false;
}
