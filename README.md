#JS Power Core
> 这是一个JavaScript UI 框架，使用动态加载技术，分模块加载资源文件，分别以组件形式或者模版形式渲染界面。

> Since: 2013-1-1

> Author: AngusYoung <angusyoung@mrxcool.com>

##PCORE.extend

	扩展类属性
	@param oObject {Object} 扩展目标对象
	@param oClass {Object} 扩展父类对象
	@param [bOverwrite] {Boolean} 是否覆盖原有属性，默认是不覆盖
	@param [xExtends] {String || Array} 指定只扩展的属性，字符串以“，”分隔

扩展属性方法，通过复制父类对象的属性往目标对象，**程序内部使用**也可外部应用但是不建议。

```js
PCORE.extend(oTarget, oParent);
```
##PCORE.make

	继承类
	@param oClass {Object} 父类对象
	@param xMember {Object} 继承的对象
	@return {Function}

定义组件时使用，内部通过[PCORE.extend](#pcoreextend)方法继承类，并提供一个初始化时自动执行的事件（须组件属性存在`Init()`方法）。
```js
PCORE.ui.window = PCORE.make(PCORE.ui, {
	title: 'Normal Title',
	close: function () {
		// close windows function
	},
	Init: function () {
		// Init this widget function
	}
});
```
##PCORE.use

	动态加载JS
	@param xJsFile {String || Array} JS文件的字符串并接或者数组
	@return {Object} 使用ready()方法执行callback函数

一般应用在组件加载上，也可用于一般的JS动态加载后执行。加载的JS地址可以忽略`.js`的扩展名，支持直接数组或者以“;”分隔的字符串。地址可使用绝对地址或者相对地址，相对地址受到[PCORE.resource](#pcoreresource)配置的影响。
```js
PCORE.use('http://www.simple.com/simple.js').ready(function () {
	// callback
});
```
```js
PCORE.user(['ui','widget/window']).ready(function () {
	// callback
});
```
##PCORE.parse

	模板解析器
	@param sTplPath {String} 模板文件地址
	@param oOption {Object} 参数选项

模板解析器，通过加载模板文件并赋于一个数据模型进行界面渲染并返回模板对象。模板对象的`tpl`属性用于保存模板源码，`data`存储数据模型，`el`为模板对应的DOM元素。并且可以使用方法`update()`, `sets()`对模板进行更新。

`update()`：刷新模板，将数据模型的改动作用到模板上

`sets()`：更新模板数据，并刷新模板内容，不会更新数据模型
```js
var oTmpl=PCORE.parse('simple.tpl', {
	// 定义el,如果el为字符串则创建一个以el字符串做为tagName的元素，
	// 如果el为DOM元素，则对应此元素，如果为空则默认创建div元素
	el: 'div',
	// 指向模板ID，作用在一个模板文件存在多个模板模块的时候，不指定则默认整个文件为一个模板
	// 由于模板会缓存，所以可以应用在合并模板文件，减少HTTP请求数
	id: 'simpleId',
	// 指定数据模型，必须正确填写，否则模板将无法正常渲染
	data: {
		name: 'Angus',
		age: 28
	},
	// 声明事件回调，支持update, render事件
	events: {
		update: function () {
			// 模板更新时会触发
		},
		render: function () {
			// 模板初次渲染时触发，render执行后会同时触发update
		}
	}
});
```
##PCORE.cache

	缓存仓库
存储各种缓存数据
##PCORE.resource

	资源路径
配置资源路径，用于[PCORE.use](#pcoreuse)加载JS的相对路径，默认为“/”，可以根据项目情况定义。
##一二三事
> 感谢Extjs, Ant.js提供部分代码思路

> 感谢以下友人在开发过程中的探讨以及帮助
> * @天涯
> * @Vincent
> * @vfasky
