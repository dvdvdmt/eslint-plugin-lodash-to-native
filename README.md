# ШРИ 2020. Домашнее задание 4. "Плагин для ESLint"

## Результат

Был написан плагин [lodash-to-native](https://github.com/dvdvdmt/eslint-plugin-lodash-to-native) для ESLint. Он содержит правило `map` которое предлагает
выполнить замену `_.map()` на метод `Array#map`, там где это возможно. Для правила были написаны
тесты которые можно запустить командой `npm run test`.  

Плагин устанавливается командой:  
`npm install --save-dev https://github.com/dvdvdmt/eslint-plugin-lodash-to-native.git`

Для активации плагина достаточно добавить строку `plugin:lodash-to-native/recommended` в массив
`extends` файла `.eslintrc`.

## Описание задачи

### Разработка в IDE и терминале - написание правила для ESLint

В библиотеке Lodash есть [функция map](https://lodash.com/docs/4.17.15#map). Она может
использоваться как с массивами, так и с объектами.

Надо написать для ESLint плагин, в котором будет своё правило с фиксом.

- [Документация по плагинам ESLint.](https://eslint.org/docs/developer-guide/working-with-plugins)
- [Документация по правилам ESLint.](https://eslint.org/docs/developer-guide/working-with-rules)

Правило должно находить использование функции `_.map`, например `_.map(collection, fn)`, и, если это
возможно, предлагать заменить его на использование нативного `Array#map`.

Фикс должен заменять код таким образом:

- при необходимости надо добавить проверку, что первый параметр является массивом (может быть как
  массивом, так и объектом)
- надо сделать вызов нативного `Array#map`, если параметр - массив
- надо сделать вызов `_.map` в противном случае Например, код

```js
return _.map(collection, fn);
```

надо заменить на

```js
if (проверка, что collection - это массив) {
    return collection.map(fn);
} else {
    return _.map(collection, fn);
}
```

или на

```js
return (проверка, что collection - это массив) ?
    collection.map(fn) :
    _.map(collection, fn);
```

Правило должно работать как для кода Node.JS, так и для браузерного кода, в котором нет никаких
`import` и `require`, а `_` является глобальным символом. То есть `import` и `require` могут
присутствовать в коде, но проверять их на "правильность импортирования lodash" не нужно.

Результат должен быть представлен в виде репозитория, название репозитория -
`eslint-plugin-lodash-to-native`, полное название правила - `lodash-to-native/map`, сокращённое -
`map`. Структура репозитория:

```
lib/
    rules/
        map.js <- файл правила
tests/
    lib/
       rules <- тесты
index.js <- список правил и конфигураций
package.json <- описание npm пакета
```

При использовании в каком-либо проекте плагин/правило устанавливается через
`npm install -S github.com/MyName/eslint-plugin-lodash-to-native.git` и подключается в
`.eslintrc.js` так:

```js
  "plugins": [
      "lodash-to-native"
  ],
  "rules": {
      "lodash-to-native/map": "warn"
  },
```

---

### Бонусы

1. Если `_` был переопределён, то правило не должно срабатывать после переопределения
   ```js
   var m1 = _.map([], fn); // здесь должно сработать
   _ = {map: () => []};
   var m2 = _.map([], fn); // здесь НЕ должно сработать
   ```
2. Если при вызове явно указан литерал массива, то фикс должен генерировать код без проверки, что
   параметр - это массив:
   ```js
   _.map([1, 2, 3], fn);
   ```
   можно смело заменить на
   ```js
   [1, 2, 3].map(fn);
   ```
3. Если можно точно определить, что `_.map` вызывается не для массива, а для объекта, например
   `_.map({a: 1, b: 2}, fn)`, то правило не должно генерировать никаких сообщений и не должно
   предлагать замены (использование `_.map()` с объектами считается валидным)
4. Наличие тестов - бонус
