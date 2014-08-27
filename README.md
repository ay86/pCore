#JS Power Core
>这是一个JavaScript UI 框架，使用动态加载技术，分模块加载资源文件，分别以组件形式或者模版形式渲染界面。

>Since: 2013-1-1

>Author: AngusYoung angusyoung@mrxcool.com

##PCORE.extend
/**
 * 扩展类属性
 * @param oObject {Object} 扩展目标对象
 * @param oClass {Object} 扩展父类对象
 * @param [bOverwrite] {Boolean} 是否覆盖原有属性，默认是不覆盖
 * @param [xExtends] {String || Array} 指定只扩展的属性，字符串以“，”分隔
 */

扩展属性方法，通过复制父类对象的属性往目标对象，**程序内部使用**也可外部应用但是不建议。

	PCORE.extend(oTarget, oParent);
##PCORE.make
/**
 * 继承类
 * @param oClass {Object} 父类对象
 * @param xMember {Object} 继承的对象
 * @return {Function}
 */

定义组件时使用，内部通过PCORE.extend方法继承类，并提供一个初始化时自动执行的事件（须组件属性存在Init方法）。
##PCORE.use

##PCORE.parse

##PCORE.debug

##PCORE.cache

##PCORE.isDebug

##PCORE.resource