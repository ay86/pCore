#JS Power Core
> 这是一个JavaScript UI 框架，使用动态加载技术，分模块加载资源文件，分别以组件形式或者模版形式渲染界面。

> Since: 2013-1-1

> Author: AngusYoung <angusyoung@mrxcool.com>

##PCORE.extend

	扩展类属性
	@param oObject {Object} 扩展目标对象
	@param oClass {Object} 扩展父类对象
	@param [bOverwrite] {Boolean} 是否覆盖原有属性，默认是不覆盖
	@param [xExtends] {String || Array} 指定只扩展的属性，字符串以“,”分隔

扩展属性方法，通过复制父类对象的属性往目标对象，**程序内部使用**也可外部应用但是不建议。

```js
var oParent = {
	name: 'Angus',
	age: 28
};
var oTarget = {
	gender: 'Male'
};
// oTarget : { name: 'Angus', age: 28, gender: 'Male' }
PCORE.extend(oTarget, oParent);
```
##PCORE.make

	继承类
	@param oClass {Object} 父类对象
	@param xMember {Object} 继承的对象
	@return {Function}

定义组件时使用，内部通过[PCORE.extend](#pcoreextend)方法继承类，并提供一个初始化时自动执行的事件（需组件类存在`Init()`方法）。
```js
PCORE.widget.Window = PCORE.make(PCORE.ui, {
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
PCORE.use(['ui','widget/window']).ready(function () {
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
##PCORE.selector

	DOM选择器
	@param sExpression {String || Object} DOM对象或者表达式字符串，支持一般的类型查找
	@param oScopeDOM {Object} DOM对象，做为查找对象的父级元素
	@returns {Object} 返回一个查找结果集以及相关的方法

移植自[jClass](http://github.com/ay86/jClass)，使用方法与jQuery的基本一致，但只提供部分API。  
支持`tagName`, `className`, `name`, `id`, `attribute`, `string` 等方式选择或创建DOM对象。   支持链式表达，暂不支持只对子级进行查找模式（`div > p`）*默认子孙级都查找*，查找`name`时请使用识别码`@`，比如：`@username`。

- `each()`
- `remove()`
- `removeAttr()`
- `html()`
- `after()`
- `before()`
- `append()`
- `clone()`
- `attr()`
- `outHtml()`

以上API的使用与jQuery的使用一致，支持链式操作。`outHtml()`是jClass自有的API，支持返回DOM元素的HTML代码，包含自身标签。
```js
var $=PCORE.selector;
$('#open').append($('div p.test').clone().attr('title', 'this is clone.'));
```
##PCORE.ajax

	AJAX请求
	@param jConfig {Object} 请求的参数配置
	@returns {XMLHttpRequest} 返回XHR对象

移植自[jClass](http://github.com/ay86/jClass)，使用方法与jQuery的基本一致，但只提供部分API。  
方法执行后返回XHR对象，可将此对象赋值给变量后，执行`abort()`操作。  
本方法提供AJAX重发功能，可在触发`error`回调时执行`retry()`方法，重新执行AJAX请求，重试次数由配置`retryCount`指定，默认为3次。  
**注意本方法只提供`success`, `error`的回调，与jQuery支持的回调方法略有不同，并且不支持`$.get()`, `$.post()`等方法。**
```js
var xhr = PCORE.ajax({
	url: 'http://www.simple.com/simple.php',
	type: 'POST',
	dataType: 'JSON',
	data: {
		user: 'Angus',
		age: 28,
		list: [1, 2, 3, 4]
	},
	success: function (jData, xhr){
		// success callback
		// this === jConfig
	},
	error: function (nStatus) {
		// error callback
		// this.retry();
	}
});
```
##PCORE.cache

	缓存仓库
存储各种缓存数据
##PCORE.resource

	资源路径
配置资源路径，用于[PCORE.use](#pcoreuse)加载JS的相对路径，默认为“/”，可以根据项目情况定义。
##PCORE.isDebug

	调试开关
接收Boolean值：True / False，默认为False关闭状态。当开启时PCORE会在运行的过程中通过[PCORE.debug](#pcoredebug)输出相关信息至浏览器的开发工具控制台。
##PCORE.debug

	调试信息发送器
当[PCORE.isDebug](#pcoreisdebug)为True时，程序内部的所有内置调试信息将输出到控制台。也可以在开发组件时使用此方法，以便在开发环境里输出调试信息。

目前支持在第一个参数里以字符串的形式声明以下几种特殊调试信息的输出：
+ （**:**） —— `console.time()`
+ （**::**）—— `console.timeEnd()`
+ （**!**） —— `console.warn()`

第一个参数不指定类型或者非字符串格式都将作为普通的文字信息通过`console.debug()`输出。  
**注意`console.time()`必须与`console.timeEnd()`成对使用。**
```js
PCORE.debug(':', 'JS Loader');          // 开启计时器JS Loader
PCORE.debug('!', 'Invalid expression'); // 输出警告信息
PCORE.debug('Hello world!');            // 输出普通信息
PCORE.debug('::', 'JS Loader');         // 输出计时器JS Loader时间
```
***
##开发的事
> 感谢ExtJs, Ant.js启发部分代码思路

> 感谢以下友人在开发过程中的探讨以及帮助

> * @天涯
> * @Vincent
> * @vfasky

> 欢迎提出你的意见或建议，如有任何疑问可随时与我联系！
