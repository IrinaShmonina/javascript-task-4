'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;
var FUNCTIONS_PRIORITY = ['filterIn', 'sortBy', 'limit', 'format', 'select'];

function getCopy(object) {
    var copy = {};
    Object.keys(object).forEach(function (key) {
        copy[key] = object[key];
    });

    return copy;
}

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var collectionCopy = collection.map(getCopy);
    var functions = [].slice.call(arguments, 1).sort(function (a, b) {
        return FUNCTIONS_PRIORITY.indexOf(a.name) < FUNCTIONS_PRIORITY.indexOf(b.name) ? -1 : 1;
    });

    return functions.reduce(function (currentCollection, operator) {

        return operator(currentCollection);
    }, collectionCopy);
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var selectedKeys = [].slice.call(arguments);

    return function select(collection) {
        return collection.map(function (record) {
            return selectedKeys.reduce(function (selectedRecord, key) {
                if (record.hasOwnProperty(key)) {
                    selectedRecord[key] = record[key];
                }

                return selectedRecord;
            }, {});
        });
    };
};

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {

        return collection.filter(function (entry) {
            return values.indexOf(entry[property]) !== -1;
        });
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        var sortingFactor = order === 'asc' ? 1 : -1;

        return collection.sort(function (a, b) {
            return sortingFactor * (a[property] <= b[property] ? -1 : 1);
        });
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {

    return function format(collection) {
        collection.forEach(function (record) {
            record[property] = formatter(record[property]);
        });

        return collection;
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {

    return function limit(collection) {
        return collection.slice(0, Math.max(0, count));
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.or = function () {
        return;
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     */
    exports.and = function () {
        return;
    };
}
