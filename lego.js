'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = false;
var PRIORITIES = {
    'filterIn': 1,
    'sortBy': 2,
    'select': 3,
    'limit': 4,
    'format': 5
};

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 * @returns {Array}
 */
exports.query = function (collection) {
    var collectionCopy = collection.map(getCopy);
    var functions = [].slice.call(arguments, 1).sort(function (firstFunc, secondFunc) {
        return PRIORITIES[firstFunc.name] < PRIORITIES[secondFunc.name] ? -1 : 1;
    });
    for (var func = 0; func < functions.length; func++) {
        collectionCopy = functions[func](collectionCopy);
    }

    return collectionCopy;
};

function getCopy(object) {
    var copy = {};
    Object.keys(object).forEach(function (key) {
        copy[key] = object[key];
    });

    return copy;
}

/**
 * Выбор полей
 * @params {...String}
 * @returns {Function}
 */
exports.select = function () {
    var selectedKeys = [].slice.call(arguments);

    return function select(collection) {
        var newCollection = [];
        collection.forEach(function (record) {
            newCollection.push(selectRecord(record, selectedKeys));
        });

        return newCollection;
    };
};

function selectRecord(record, selectedKeys) {
    var selectedRecord = {};
    for (var key in record) {
        if (selectedKeys.indexOf(key) !== -1) {
            selectedRecord[key] = record[key];
        }
    }

    return selectedRecord;
}

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Function}
 */
exports.filterIn = function (property, values) {
    return function filterIn(collection) {
        var newCollection = [];
        collection.forEach(function (record) {
            if (isRecordContainsProperty(record, property, values)) {
                newCollection.push(record);
            }
        });

        return newCollection;
    };
};

function isRecordContainsProperty(record, property, values) {
    return record.hasOwnProperty(property) && (values.indexOf(record[property]) !== -1);
}

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Function}
 */
exports.sortBy = function (property, order) {
    return function sortBy(collection) {
        var sortingFactor = getSortingFactor(order);
        var newCollection = collection.sort(function (firstRecord, secondRecord) {
            return PRIORITIES[firstRecord[property]] < PRIORITIES[secondRecord[property]]
                ? sortingFactor * -1
                : sortingFactor;
        });

        return newCollection;
    };
};

function getSortingFactor(order) {
    if (order === 'asc') {
        return 1;
    }

    return -1;
}

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Function}
 */
exports.format = function (property, formatter) {

    return function format(collection) {
        collection.forEach(function (record) {
            record[property] = formatProperty(record, property, formatter);
        });

        return collection;
    };
};

function formatProperty(record, property, formatter) {
    return formatter(record[property]);
}

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Function}
 */
exports.limit = function (count) {

    return function limit(collection) {
        return collection.slice(0, count);
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
