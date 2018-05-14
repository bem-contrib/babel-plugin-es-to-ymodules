# babel-plugin-es-to-ymodules

Babel плагин трансформации ES2015 модулей в [YModules](https://bem.info/tools/bem/modules/). Основан на [transform-es2015-modules-commonjs](https://www.npmjs.com/package/babel-plugin-transform-es2015-modules-commonjs) и идеях [babel-plugin-bem](https://github.com/bem/babel-plugin-bem).

[![npm](https://img.shields.io/npm/v/babel-plugin-es-to-ymodules.svg?style=flat)](https://www.npmjs.com/package/babel-plugin-es-to-ymodules) [![travis](http://img.shields.io/travis/bem-contrib/babel-plugin-es-to-ymodules.svg?style=flat)](https://travis-ci.org/bem-contrib/babel-plugin-es-to-ymodules) ![license](https://img.shields.io/github/license/mashape/apistatus.svg)

## Основные фичи
- [x] Поддержка именнованного экcпорта
- [x] Совместимость с текущими модулями
- [x] Преобразование не `ym:*` вызова в обычный `require`
- [x] Патчинг старых модулей на работу с ES2015 модулями
(Извлечение `default` значения)

## Зачем
Множественные зависимости в YModules затрудняют поиск соответсвия `аргумент` <> `модуль`, ES стиль позволяет упростить этот процесс и писать меньше кода.

## Почему не [bem-import](https://github.com/bem/babel-plugin-bem-import)
`bem-import` меняет подход к работе с модулями (и нам нравится), но это требует больших правок в проекте. Исторически сложившееся использовование `ymodules` с завязкой на либах не даёт возможности это реализовать без боли.

## В планах
- [ ] Использование нотации импортов из bem-import
*не реализована, чтобы не вызывать путаницу*
*Возможно будет с ограничениями*
- [ ] Технология для `enb` с транфсормацией модулей
- [ ] Технология для `specs` с использованием трансформаций


## Установка

```
npm install --save-dev babel-plugin-es-to-ymodules
```
## Использование

```js
import { transformFile } from 'babel-core'

transformFile('path/to/my/module.js', {
    plugins : ['es-to-ymodules']
}, (err, res) => console.log(res.code));

```

### CLI
```
babel --plugins=es-to-ymodules path/to/my/module.js
```
## Ньюансы
- Модуль с `export` обязан иметь имя в шапке `/** @module my-module-name */` (для объявления его в `modules.define`)
- Модули нужно обрабатывать отдельно, а не в собрабнном бандле.
- Плагин делает **только трансформацию**, для раскрытия `require` сдедует использовать [enb-browserify](https://github.com/floatdrop/enb-browserify) или другой упаковщик
- Модули собираются через [deps-файлы](https://ru.bem.info/platform/deps/)
- Требует обкатки (по тестам то всё хорошо...)

### 1. Декларация модуля
**modules.define**
```js
/** @module my-block */
import bemDom from 'ym:i-bem-dom'

export default bemDom.declBlock('my-block', {
    onSetMod : {
        // ...
    }
});
```

Аналогично

```js
modules.define('my-block',
    ['i-bem-dom'],
    function(provide, bemDom) {

provide(bemDom.declBlock('my-block', {
    onSetMod : {
        // ...
    }
}));

});
```

### 3. Доопределение модуля
**modules.define**

```js
/** @module button */
import Button from 'ym:button'

export default Button.declMod({ modName : 'type', modVal : 'link' }, {
    onSetMod : {
        /* ... */
    }
});
```

Аналогично
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
**modules.require**

```js
import bemDom from 'ym:i-bem-dom'
```

Аналогично

```js
modules.require('i-bem-dom', function(bemDom) {

});
```

### 4. Подключение либ из node_modules
**modules.require**
```js
import bemDom from 'ym:i-bem-dom'
import mobx from 'mobx'
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
