/**
 * JavaScript Power Core
 * @Author: AngusYoung
 * @Version: 2.4
 * @Since: 13-01-01
 */

PCORE = {};
/**
 * 扩展类属性
 * @param oObject {Object} 扩展目标对象
 * @param oClass {Object} 扩展父类对象
 * @param [bOverwrite] {Boolean} 是否覆盖原有属性，默认是不覆盖
 * @param [xExtends] {String || Array} 指定只扩展的属性，字符串以“，”分隔
 */
PCORE.extend = function (oObject, oClass, bOverwrite, xExtends) {
	var _w, i;
	if (oObject && oClass) {
		//bOverwrite = bOverwrite === void(0) || bOverwrite;
		if (xExtends) {
			xExtends = typeof xExtends == 'string' ? xExtends.replace(/\s+/g, '').split(',') : xExtends;
			for (i = xExtends.length; i--;) {
				_w = xExtends[i];
				if (_w in oClass && (bOverwrite || !(_w in oObject))) {
					oObject[_w] = oClass[_w];
				}
			}
		}
		else {
			for (_w in oClass) {
				if (bOverwrite || !(_w in oObject)) {
					oObject[_w] = oClass[_w];
				}
			}
		}
	}
	return oObject;
};
/**
 * 继承类
 * @param oClass {Object} 父类对象
 * @param xMember {Object} 继承的对象
 * @return {Function}
 */
PCORE.make = function (oClass, xMember) {
	function __class__() {
		this.events = {};
		var bAutoInit = arguments[0] !== false;
		//添加参数
		if (typeof this.config === 'function' && typeof arguments[0] !== 'boolean') {
			typeof arguments[0] === 'object' && this.config(arguments[0]);
		}
		//new 的时候就做HTML初始化
		if (typeof this.Init === 'function' && bAutoInit) {
			this.Init();
		}
	}

	var _obj = PCORE.extend(xMember, oClass);
	PCORE.extend(__class__.prototype, _obj);
	_obj = null;
	return __class__;
};
/**
 * 动态加载JS
 * @param xJsFile {String || Array} JS文件的字符串并接或者数组
 * @return {Object} 使用ready()方法执行callback函数
 */
PCORE.use = function (xJsFile) {
	PCORE.debug('use now...');
	var oHead = document.getElementsByTagName('head')[0];
	if (!oHead) {
		return {ready: function () {
			PCORE.debug('!', 'DOM Error, stop this.');
		}};
	}
	var sResource = PCORE.resource + (PCORE.resource.slice(-1) === '/' ? '' : '/');
	var aJsFiles = typeof xJsFile === 'string' ? xJsFile.split(';') : xJsFile;
	var i;

	//检查是否外部链接
	function __fCheckOutside(sURL) {
		return (sURL.substr(0, 1) === '/' || sURL.substr(0, 7) === 'http://');
	}

	//拼接引用JS的URL
	function __fGetPath(sSrc) {
		var sJsSrc = '';
		if (__fCheckOutside(sSrc)) {
			sJsSrc = sSrc + (sSrc.slice(-3) === '.js' ? '' : '.js');
		}
		else {
			// 在资源路径后面加上/，假如没有的话
			sJsSrc = sResource + sSrc + (sSrc.slice(-3) === '.js' ? '' : '.js');
		}
		return sJsSrc;
	}

	// 组装类格式文本xx.Xx
	function __fFormatClass(aArray) {
		return aArray.join('.').replace(/\.\w/g, function (s) {
			return s.toUpperCase();
		});
	}

	PCORE.debug('Use list', aJsFiles);
	//判断本次导入的文件是否存在于现有的importList中，存在则移除
	if (PCORE.importList && PCORE.importList.length > 0) {
		for (i = 0; i < aJsFiles.length; i++) {
			var _path = __fGetPath(aJsFiles[i]);
			if ((';' + PCORE.importList.join(';') + ';').indexOf(';' + _path + ';') > -1) {
				PCORE.debug('Script in the list, Delete it', aJsFiles[i]);
				aJsFiles.splice(i, 1);
				i--;
			}
		}
	}
	//TODO 是否在这时判断removeList是否存在
	//取得现有的JS列表，拼装src
	var aScript = document.getElementsByTagName('script');
	var _aSrc = [];
	for (i = 0; i < aScript.length; i++) {
		if (aScript[i].getAttribute('src')) {
			_aSrc.push(aScript[i].getAttribute('src'));
		}
	}
	var _cSrcList = '|' + _aSrc.join('|') + '|';
	//检查是否欲加载的JS已存在于列表，是的话就移除
	for (i = 0; i < aJsFiles.length; i++) {
		//存在于文件src引入
		if (_cSrcList.indexOf('|' + __fGetPath(aJsFiles[i]) + '|') > 0) {
			PCORE.debug('Script in head, Delete it', aJsFiles[i]);
			aJsFiles.splice(i, 1);
			i--;
		}
		//存在于合并引入
		else {
			//只对PCORE组件进行对象判断
			if (!__fCheckOutside(aJsFiles[i])) {
				//判断所用对象是否存在
				if (aJsFiles[i].indexOf('ui') >= 0) {
					//判断UI父类
					if (typeof PCORE.ui === 'object') {
						PCORE.debug('UI is exists, Delete', aJsFiles[i]);
						aJsFiles.splice(i, 1);
						i--;
					}
				}
				else if (aJsFiles[i].indexOf('view') >= 0) {
					//判断VIEW父类
					if (typeof PCORE.view === 'object') {
						PCORE.debug('View is exists, Delete', aJsFiles[i]);
						aJsFiles.splice(i, 1);
						i--;
					}
				}
				else {
					var _js_object = aJsFiles[i].replace(/\.js$/, '').split('/');
					PCORE.debug('What\'s Class: ', __fFormatClass(_js_object));
					//如果是自带类则进行以下判断，否则不判断
					if (_js_object[0] === 'widget' || _js_object[0] === 'view') {
						//先判断是否有父类
						var _hasPO;
						eval('_hasPO = (typeof PCORE.' + _js_object[0] + ')');
						//如果父类已经存在，判断自身是否有
						if (_hasPO !== 'undefined') {
							eval('_hasPO = (typeof PCORE.' + __fFormatClass(_js_object) + ')');
							//如果自身存在，移除出列表
							if (_hasPO === 'function') {
								PCORE.debug('Class is exits.');
								aJsFiles.splice(i, 1);
								i--;
							}
						}
					}
				}
			}
		}
	}
	//将全路径加入，避免resource被多次修改造成后续程序的判断
	for (i = 0; i < aJsFiles.length; i++) {
		aJsFiles[i] = __fGetPath(aJsFiles[i]);
	}
	!PCORE.importCallBack && (PCORE.importCallBack = []);
	/**
	 * 检查是否非空的importList
	 * 如果非空表示有程序进行中，只做添加操作
	 **/
	var bLoadIt = true;
	if (PCORE.importList && PCORE.importList.length > 0) {
		//添加本次加载列表进importList
		PCORE.importList = PCORE.importList.concat(aJsFiles);
		PCORE.debug('Has a progress, stop this and append in the progress.');
		//go to ready and not load.
		bLoadIt = false;
	}
	else {
		//对空importList进行添加并加载操作
		PCORE.importList = aJsFiles;
	}
	//加载js
	function __fJsLoader(js) {
		PCORE.debug(':', 'JS Loader');
		PCORE.debug('Show import list', PCORE.importList);
		PCORE.debug('Will remove list', PCORE.removeList);
		if (js) {
			var oJs = document.createElement('script');
			oJs.type = 'text/javascript';
			oJs.src = js;
			oHead.appendChild(oJs);

			//添加一个移除NODE的列表
			!PCORE.removeList && (PCORE.removeList = []);
			PCORE.removeList.push(oJs);
		}
		else {
			// 没有JS引用，但也需要去启动callback
			__fCallImportOK();
			return;
		}

		if (document.all) {
			oJs.onreadystatechange = function () {
				if (oJs.readyState == 'loaded' || oJs.readyState == 'complete') {
					__fCallImportOK();
				}
			}
		}
		else {
			oJs.onload = function () {
				PCORE.debug(this.src + ' loaded.');
				__fCallImportOK();
			};
			oJs.onerror = function () {
				PCORE.debug('!', oJs.src + ' load fail.');
				__fCallImportOK();
			}
		}

		function __fCallImportOK() {
			PCORE.debug('Import complete.');
			PCORE.importList.splice(0, 1);
			PCORE.debug('Remain', PCORE.importList.length, 'js in list.');
			//列表还存在未导入数据
			if (PCORE.importList.length > 0) {
				PCORE.debug('Next:', PCORE.importList[0]);
				__fJsLoader(PCORE.importList[0]);
			}
			//列表全部导完
			else {
				//移除新添加的JS NODE，减少内存占用
				if (PCORE.removeList) {
					for (var i = 0; i < PCORE.removeList.length; i++) {
						var _script = PCORE.removeList[i];
						var _parent = _script.parentNode;
						//DEBUG模式不从HEAD中移除导入的JS NODE
						!PCORE.isDebug && _parent.removeChild(_script);
					}
					PCORE.removeList = null;
					delete PCORE.removeList;
				}
				PCORE.debug('::', 'JS Loader');
				PCORE.debug(':', 'Callback');
				//回调callbackList，反转顺序执行
				var _callback = PCORE.importCallBack.reverse();
				//引用完即干掉，避免多生枝节
				PCORE.importCallBack = null;
				delete PCORE.importCallBack;
				PCORE.debug('Run callback...');
				for (var v in _callback) {
					if (typeof _callback[v] == 'function') {
						try {
							_callback[v]();
						}
						catch (e) {
							PCORE.debug('!', 'callback has error, maybe js file loaded fail.');
							PCORE.debug(e);
						}
					}
				}
				PCORE.debug('All callback ran.');
				PCORE.debug('::', 'Callback');
			}
		}
	}

	//run it
	function __fRunReady() {
		//对importList进行加载
		PCORE.debug('Loader is ready to run, running...');
		__fJsLoader(PCORE.importList[0]);
	}

	// 当没有使用回调的情况下，如果JS都加载完了做延时运行
	// 使用延时运行的目的是为了，在存在回调的情况下有机会
	// 去清除掉当前的加载器，以便在回调时去正式运行
	if (bLoadIt) {
		var _xTime = setTimeout(__fRunReady, 200);
	}

	return {
		ready: function () {
			//如果存在加载器，则清除，等新的callback加载完后再开启
			_xTime && clearTimeout(_xTime);
			//添加本次的callback
			var xCallBack = arguments[0];
			PCORE.importCallBack.push(xCallBack);
			PCORE.debug('Push callback to list.');
			bLoadIt && __fRunReady();
		}
	};
};

/**
 * 模板解析器
 * @param sTplPath {String} 模板文件地址
 * @param oOption {Object} 参数选项
 * @returns {*}
 */
PCORE.parse = function (sTplPath, oOption) {
	PCORE.debug(':', 'Parser');
	var _option = {
		el: '',
		id: '',
		events: {}
	};
	oOption = PCORE.extend(oOption, _option);
	var oFn = function () {
		this.__load(sTplPath);
		PCORE.debug('::', 'Parser');
	};
	oFn.prototype = {
		__fire: function (sEvent) {
			// event ON_XXX, XXX对应外部触发器events里的属性
			// 比如ON_UPDATE事件对应触发events:{update:function(){}}
			// 外部触发器命名规则为驼峰
			var sEvName = sEvent.substr(3).toLowerCase();
			sEvName = sEvName.replace(/(_\w)/g, function ($1) {
				return $1.substr(1).toUpperCase();
			});
			if (typeof oOption.events[sEvName] === 'function') {
				oOption.events[sEvName].call(this, this.el);
			}
		},
		__load: function (sTplPath) {
			var _this = this;
			// 判断模板是否存在于缓存区
			if (PCORE.cache['tpl'][sTplPath]) {
				_this.__updateTpl(PCORE.cache['tpl'][sTplPath]);
				_this.render(oOption['data']);
			}
			else {
				// 加载模板文件
				$.ajax({
					type: 'GET',
					url: sTplPath,
					dataType: 'TEXT',
					cache: false,
					success: function (sTpl) {
						// 将模板放入缓存
						PCORE.cache['tpl'][sTplPath] = sTpl;
						_this.__updateTpl(sTpl);
						_this.render(oOption['data']);
					},
					error: function () {
						PCORE.debug('template file is fail.');
					}
				});
			}
		},
		__updateTpl: function (sTpl) {
			var _div = document.createElement('div');
			_div.innerHTML = sTpl;
			var _tag = _div.getElementsByTagName('script');
			var sTemplate;
			// 读取指定模块，否则将认为整个模板文件只有一个模块
			var sId = oOption['id'];
			if (sId) {
				for (var i = 0, nLen = _tag.length; i < nLen; i++) {
					if (_tag[i].id === sId) {
						sTemplate = _tag[i].innerHTML;
						break;
					}
				}
			}
			else {
				if (_tag.length) {
					if (_tag[0].type === 'text/tpl') {
						sTemplate = _tag[0].innerHTML;
					}
					else {
						sTemplate = sTpl;
					}
				}
			}
			this.tpl = sTemplate;
			this.__fire('ON_TPL_UPDATE');
		},
		__checkData: function () {
			return this.data && this.vm['_data'];
		},
		vm: {
			_key: {},
			_index: 0,
			// key匣
			keyBox: function (oObj) {
				this._index++;
				this._key[this._index] = oObj;
				return this._index;
			},
			/**
			 * 解析数据
			 * @param sProperty {String} 标签字符串
			 * @param [oModel] {Object} 数据模型
			 * @returns {*}
			 * @private
			 */
			parseData: function (sProperty, oModel) {
				var sVal;
				oModel = oModel || this;
				if (sProperty.indexOf('.') > -1) {
					var _var = sProperty.split('.');
					var _val = oModel;
					for (var i = 0, nLen = _var.length; i < nLen; i++) {
						if (!_val) {
							break;
						}
						_val = _val[_var[i]] || this[_var[i]];
					}
					sVal = _val;
				}
				else {
					sVal = oModel[sProperty] || this[sProperty];
				}
				if (typeof sVal === 'undefined') {
					// 解析表达式
					function __fRunEval(sExpression) {
						// 枚举变量声明
						var v;
						// this data
						for (v in this) {
							eval('var ' + v + '=this[\'' + v + '\']');
						}
						// model data
						for (v in oModel) {
							eval('var ' + v + '=oModel[\'' + v + '\']');
						}
						var _cmd;
						try {
							eval('_cmd =' + sExpression);
						}
						catch (e) {
							PCORE.debug('!', 'Invalid expression', '{' + sExpression + '}');
						}
						return _cmd;
					}

					var _expr = __fRunEval.call(this, sProperty);
					if (_expr != undefined) {
						sVal = _expr;
					}
				}
				return sVal;
			},
			/**
			 * 构建标签
			 * @param sAttr {String} 标签字符串
			 * @param [oModel] {Object} 数据模型
			 * @returns {*}
			 * @private
			 */
			tagBuild: function (sAttr, oModel) {
				sAttr = sAttr.replace('{{', '').replace('}}', '');
				return this.parseData.call(this._data, sAttr, oModel);
			},
			/**
			 * 构建HTML
			 * @param sHtml {String} html字符串
			 * @param [oModel] {Object} 数据模型
			 * @returns {*}
			 * @private
			 */
			htmlBuild: function (sHtml, oModel) {
				var _this = this;
				sHtml = sHtml.replace(/{{([^}}]*)}}/g, function (s, $1) {
					var sVal = _this.tagBuild($1.replace(/\s/g, ''), oModel);
					if (typeof sVal === 'object') {
						// 渲染组件
						return '<var ob="' + _this.keyBox(sVal) + '"></var>';
					}
					if (typeof sVal === 'function') {
						return (new sVal).toString();
					}
					else if (typeof sVal === 'string' || typeof sVal === 'number' || typeof sVal === 'boolean') {
						// 渲染变量
						return sVal;
					}
					else {
						return s;
					}
				});
				return sHtml;
			}
		},
		// 渲染程序
		render: function (oData) {
			if (!oData) {
				return;
			}
			// 确保data非引用状态
			this.data = PCORE.extend({}, oData);
			this.vm['_data'] = this.data;
			this.update();
			this.__fire('ON_RENDER');
		},
		update: function (sTpl) {
			if (!this.__checkData()) {
				return;
			}
			/* 开始渲染 */
			var _this = this;
			_this.tpl = sTpl || _this.tpl;
			var _el;
			if (_this.el) {
				_el = _this.el;
			}
			else {
				// 创建节点
				oOption['el'] = oOption['el'] || 'div';
				if (typeof oOption['el'] === 'string') {
					_el = document.createElement(oOption['el']);
				}
				else if (typeof oOption['el'] === 'object' && oOption['el'].ownerDocument) {
					_el = oOption['el'];
				}
			}
			_el.innerHTML = this.tpl;
			/*渲染指令，指令应注重优先顺序，具备先决条件的必须写在前面*/
			// 逻辑指令
			$('[pc-if]', _el).each(function () {
				var $This = $(this);
				var _if = _this.vm.tagBuild($This.attr('pc-if'));
				if (_if && _if.length) {
					$This.removeAttr('pc-if');
				}
				else {
					$This.remove();
				}
			});
			// 循环指令
			$('[pc-repeat]', _el).each(function () {
				var $This = $(this);
				var aData = _this.vm.tagBuild($This.attr('pc-repeat'));
				if (aData instanceof Array) {
					// 防止原数据被反转污染
					var _data = aData.concat([]);
					var _base = $('<div></div>').append($This.clone().removeAttr('pc-repeat')).html();
					for (var i = 0, nLen = _data.length; i < nLen; i++) {
						_data[i]['$index'] = i;
						$This.before(_this.vm.htmlBuild(_base, _data[i]));
					}
					$This.remove();
				}
			});
			// 渲染标签
			_el.innerHTML = _this.vm.htmlBuild(_el.innerHTML);
			// 初始化模板中存在的组件
			$('[ob]', _el).each(function () {
				var $This = $(this);
				var _obc = $This.attr('ob');
				var _vClass = _this.vm._key[_obc];
				if (_vClass.fit && typeof _vClass.fit === 'function') {
					_vClass.fit($This);
				}
				else {
					PCORE.debug('!', 'Invalid Widget or Object not support.');
					$This.remove();
				}
			});
			_this.el = _el;
			// 返回/回调
			_this.__fire('ON_UPDATE');
		},
		sets: function (sPath, xValue) {
			if (!this.__checkData()) {
				return;
			}
			if (typeof sPath === 'object') {
				this.data = sPath;
			}
			else {
				var _path = sPath.split('.');
				if (_path.length > 1) {
					var _obj = eval('this.data.' + sPath.slice(1).join('.'));
					_obj[_path[_path.length - 1]] = xValue;
				}
				else {
					this.data[_path[0]] = xValue;
				}
			}
			// TODO sets后续要做到不经update，可以单刷某值，核心作用在双向绑定
			this.update();
		}
	};
	return new oFn;
};
/**
 * 缓存仓库
 */
PCORE.cache = {
	tpl: {}
};
/**
 * PCORE选择器
 * @param sExpression {String} 查找表达式，支持一般的类型查找
 * @param oScopeDOM {Object} DOM对象，做为查找对象的父级元素
 * @returns {Object} 返回一个查找结果集以及相关的方法
 */
PCORE.selector = function (sExpression, oScopeDOM) {
	PCORE.debug(':', '<' + sExpression + '>');
	/**
	 * 数组内查找
	 * @param aArray 查询的数组对象
	 * @param sKey 查询的关键词
	 * @returns {boolean}
	 * @private
	 */
	function __fInArray(aArray, sKey) {
		for (var i = 0; i < aArray.length; i++) {
			if (aArray[i] === sKey) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 向上查找匹配对象
	 * @param aParentKey 父级的标识数组
	 * @param oChildren 归递查询的子元素
	 * @returns {Boolean}
	 * @private
	 */
	function __fFindParent(aParentKey, oChildren) {
		// 查找到根停止继续查找，返回假
		if (oChildren === document.documentElement) {
			return false;
		}
		// 如果已经没有断言条件了，返回真
		if (aParentKey.length === 0) {
			return true;
		}
		// 当前对象的父级进行断言，成功则断了往上，不成功则返回假
		if (__fAssert(oChildren.parentNode, aParentKey.slice(-1))) {
			return arguments.callee(aParentKey.slice(0, -1), oChildren.parentNode);
		}
		else {
			return arguments.callee(aParentKey, oChildren.parentNode);
		}
	}

	/**
	 * 链式分解
	 * @param sChain 链式字符串
	 * @returns {Array} 分解结果集
	 * @private
	 */
	function __fChain(sChain) {
		sChain = sChain.replace(/\./g, ' .').replace(/\[/g, ' [');
		return sChain.replace(/^ /, '').split(' ');
	}

	/**
	 *
	 * @param oObj 断言对象
	 * @param aAssert 断言条件
	 * @returns {boolean}
	 * @private
	 */
	function __fAssert(oObj, aAssert) {
		for (var i = 0; i < aAssert.length; i++) {
			var sCondition = aAssert[i].substr(1);
			switch (aAssert[i].substr(0, 1)) {
				case '#': // id
					if (oObj.getAttribute('id') !== sCondition) {
						return false;
					}
					break;
				case '.': // className
					if (!__fInArray(oObj.getAttribute('class').split(' '), sCondition)) {
						return false;
					}
					break;
				case '@': // name
					if (oObj.getAttribute('name') !== sCondition) {
						return false;
					}
					break;
				case '[': // property
					var aProp = sCondition.substring(0, sCondition.length - 1).split('=');
					if (aProp.length === 2) {
						if (oObj.getAttribute(aProp[0]) !== aProp[1]) {
							return false;
						}
					}
					else {
						if (!oObj.getAttribute(aProp[0])) {
							return false;
						}
					}
					break;
				default : // tagName
					if (oObj.tagName.toUpperCase() !== aAssert[i].toUpperCase()) {
						return false;
					}
			}
		}
		return true;
	}

	/**
	 * 获取单项对象
	 * @param sKey 表达式
	 * @returns {Array} 返回选择中的对象数组
	 * @private
	 */
	function __fSingle(sKey) {
		var aGet = [];
		var sVal = sKey.substr(1);
		var oScope = oScopeDOM || document;
		var oObj, i;
		switch (sKey.substr(0, 1)) {
			case '#': // ID
				oObj = document.getElementById(sVal);
				oObj && aGet.push(oObj);
				break;
			case '.': // Class name
				if (document.getElementsByClassName) {
					oObj = document.getElementsByClassName(sVal);
					oObj && (aGet = Array.prototype.slice.call(oObj, 0));
				}
				else {
					oObj = oScope.getElementsByTagName('*');
					for (i = 0; i < oObj.length; i++) {
						if (__fInArray(oObj[i].getAttribute('class').split(' '), sVal)) {
							aGet.push(oObj[i]);
						}
					}
				}
				break;
			case '@': // name
				oObj = document.getElementsByName(sVal);
				oObj && (aGet = Array.prototype.slice.call(oObj, 0));
				break;
			case '[': // property
				sVal = sKey.substring(1, sKey.length - 1);
				oObj = oScope.getElementsByTagName('*');
				var aProp = sVal.split('=');
				var sProp;
				if (aProp.length === 2) {
					sProp = aProp[0];
					sVal = aProp[1];
				}
				for (i = 0; i < oObj.length; i++) {
					if (sProp) {
						if (oObj[i].getAttribute(sProp) === sVal) {
							aGet.push(oObj[i]);
						}
					}
					else {
						if (oObj[i].getAttribute(sVal)) {
							aGet.push(oObj[i]);
						}
					}
				}
				break;
			default : // tag name
				oObj = oScope.getElementsByTagName(sKey);
				oObj && (aGet = Array.prototype.slice.call(oObj, 0));
		}
		return aGet;
	}

	function __fGet(sExpr) {
		var aResult = [];
		var aExpr = sExpr.split(' ');
		var nLast = aExpr.length - 1;
		var sCurrent = aExpr[nLast];
		if (aExpr.length > 1) {
			// multiple
			var aAssert = aExpr.slice(0, -1);
			var aChildren = __fGet(sCurrent);
			for (var j = 0; j < aChildren.length; j++) {
				var oChildren = aChildren[j];
				var bHas = __fFindParent(aAssert, oChildren);
				bHas && aResult.push(oChildren);
			}
		}
		else {
			// single
			var aChain = __fChain(sCurrent);
			var aCurrent = __fSingle(aChain[0]);
			if (aChain.length > 1) {
				// 存在链式
				for (var k = 0; k < aCurrent.length; k++) {
					if (__fAssert(aCurrent[k], aChain.slice(1))) {
						aResult.push(aCurrent[k]);
					}
				}
			}
			else {
				aResult = aCurrent;
			}
		}
		return aResult;
	}

	var oSelector = {
		elements: __fGet(sExpression),
		each: function (fCallBack) {
			if (typeof fCallBack === 'function') {
				for (var i = 0; i < this.elements.length; i++) {
					fCallBack.call(this.elements[i], i);
				}
			}
		}
	};
	PCORE.debug('::', '<' + sExpression + '>');
	return oSelector;
};
/**
 * 输出调戏信息
 */
PCORE.debug = function () {
	if (!PCORE.isDebug || !console) {
		return;
	}
	var xFirstArg = arguments[0];
	// 如果是特殊格式的debug将会忽略后续的参数，只使用第一、二个参
	var sTimerName, aArg = Array.prototype.slice.call(arguments, 0);
	switch (xFirstArg) {
		case ':':
			sTimerName = arguments[1] + ' Timer';
			console.time && console.time(sTimerName);
			break;
		case '::':
			sTimerName = arguments[1] + ' Timer';
			console.timeEnd && console.timeEnd(sTimerName);
			break;
		case '!':
			console.warn && console.warn(aArg.slice(1).join(' '));
			break;
		default :
			var _arg = ['CORE_DEBUG:'].concat(aArg);
			(console.debug && console.debug.apply(console, _arg)) || (console.info && console.info(_arg));
	}
};
/**
 * 是否开启调戏模式
 * @type {Boolean}
 */
PCORE.isDebug = false;
/**
 * 指定JS的资源目录路径
 * @type {String}
 */
PCORE.resource = '/';