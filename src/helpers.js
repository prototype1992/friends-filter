// функция поиска подстроки в строке
export function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    if (full.indexOf(chunk) + 1) {
        return true;
    } else {
        return false;
    }
}
