# babel-plugin-es-to-ymodules

[![travis](http://img.shields.io/travis/bem-contrib/babel-plugin-es-to-ymodules.svg?style=flat)](https://travis-ci.org/bem-contrib/babel-plugin-es-to-ymodules)


Babel плагин трансформация ES2015 модулей в [YModules](https://bem.info/tools/bem/modules/)
Основан на [transform-es2015-modules-commonjs](https://www.npmjs.com/package/babel-plugin-transform-es2015-modules-commonjs) и идеях
[babel-plugin-bem](https://github.com/bem/babel-plugin-bem).


## Основные фичи
- Поддержка именнованного экcпорта
- Совместимость с текущими модулями
- Преобразование не ym вызова в обычный require
- Патчинг нативых модулей на работу с ES2015 модулями
- Покрыто тестами

## Зачем
Это удобно, особенно в случаях, кода необходимо подключить с десяток модулей. Также на дворе 2018 год. Имплементации ES2015 модулей уже везде.


## Есть ведь [bem-import](https://github.com/bem/babel-plugin-bem-import)
Мы тоже ждём единых импортов во всех bem-проектах. Исторически сложившееся использовование ymodules с завязкой на либах не даёт возможности использовать их без боли. 

Текущий плагин позволяет не меняя привычной схемы упростить разработку.

## В планах
- Использование нотации импортов из bem-import
- Технология для enb с транфсормацией модулей
- Технология для спеков с использованием трансофрмаций 

## Ньюансы
- Каждый модуль (с экспортом) обязан иметь имя в шапке `/** @module my-module-name */`
- Плагин не работает на собранный бандл, каждый модуль нужно обрабатывать отдельно.
- Требует обкатки (по тестам то всё хорошо...)

## Примеры

### 1. Декларация модуля
```js
/** @module my-block */
import bemDom from 'ym:i-bem-dom';

export default bemDom.declBlock('my-block', {
    onSetMod : {
        // ...
    }
});
```

Аналогичен следующей записи

```js
modules.define('my-block', 
    ['i-bem-dom'], 
    function(provide, $) {

provide(bemDom.declBlock('my-block', {
    onSetMod : {
        // ...
    }
}));

});
```

### 3. Доопределение модуля

```js
/** @module button */
import Button from 'ym:button';

export default Button.declMod({ modName : 'type', modVal : 'link' }, {
    onSetMod : {
        /* ... */
    }
});
```

Аналогичен

```js
module.define('button', 
    function(provide, Button) {

provide(Button.declMod({ modName : 'type', modVal : 'link' }, {
    onSetMod : {
        /* ... */
    }
}));

});
```
### 3. Обычное подключение
```js
import bemDom from 'ym:i-bem-dom';
```

Аналогично

```js
modules.require('i-bem-dom', function(bemDom) {

});
```

### 4. Подключение либ из node_modules
```js
import bemDom from 'ym:i-bem-dom';
import mobx from 'mobx';
```

Аналогично

```js
modules.require('i-bem-dom', function(bemDom) {

const mobx = require('mobx');

}); 
```

Более подробные примеры можно [постмотреть в тестах](tests/fixtures).
## License

MIT