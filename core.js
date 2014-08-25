/**
 * JavaScript Power Core
 * @Author: AngusYoung
 * @Version: 2.3
 * @Since: 13-01-01
 */

PCORE = {};
/**
 * 扩展类属性
 * @param oObject {Object} 扩展目标对象
 * @param oClass {Object} 扩展父类对象
 * @param [lOverwrite] {Boolean} 是否覆盖原有属性，默认是不覆盖
 * @param [xExtends] {String || Array} 指定只扩展的属性，字符串以“，”分隔
 */
PCORE.extend = function (oObject, oClass, lOverwrite, xExtends) {
	var _w, i;
	if (oObject && oClass) {
		//lOverwrite = lOverwrite === void(0) || lOverwrite;
		if (xExtends) {
			xExtends = typeof xExtends == 'string' ? xExtends.replace(/\s+/g, '').split(',') : xExtends;
			for (i = xExtends.length; i--;) {
				_w = xExtends[i];
				if (_w in oClass && (lOverwrite || !(_w in oObject))) {
					oObject[_w] = oClass[_w];
				}
			}
		}
		else {
			for (_w in oClass) {
				if (lOverwrite || !(_w in oObject)) {
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
			alert('[pCore] DOM Error, stop this.');
		}};
	}
	var aJsFiles = typeof xJsFile === 'string' ? xJsFile.split(';') : xJsFile;
	var i;
	//拼接引用JS的URL
	function __fGetPath(sSrc) {
		var sJsSrc = '';
		if (sSrc.substr(0, 1) === '/' || sSrc.substr(0, 7) === 'http://') {
			sJsSrc = sSrc + (sSrc.slice(-3) === '.js' ? '' : '.js');
		}
		else {
			sJsSrc = PCORE.resource + (PCORE.resource.slice(-1) === '/' ? '' : '/') + sSrc + (sSrc.slice(-3) === '.js' ? '' : '.js');
		}
		return sJsSrc;
	}

	PCORE.debug('show use list', xJsFile);
	//判断本次导入的文件是否存在于现有的importList中，存在则移除
	if (PCORE.importList && PCORE.importList.length > 0) {
		PCORE.debug('has import list, show it', PCORE.importList.join(';'));
		for (i = 0; i < aJsFiles.length; i++) {
			var _path = __fGetPath(aJsFiles[i]);
			PCORE.debug(i + 1, _path);
			if ((';' + PCORE.importList.join(';') + ';').indexOf(';' + _path + ';') > 0) {
				PCORE.debug('exist in list, delete it', aJsFiles[i]);
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
		PCORE.debug('show script', aJsFiles[i]);
		if (_cSrcList.indexOf('|' + __fGetPath(aJsFiles[i]) + '|') > 0) {
			PCORE.debug('exist in head, delete it', aJsFiles[i]);
			aJsFiles.splice(i, 1);
			i--;
		}
		//存在于合并引入
		else {
			//只对pCore组件进行对象判断
			if (aJsFiles[i].substr(0, 1) !== '/' && aJsFiles[i].substr(0, 7) !== 'http://') {
				//判断所用对象是否存在
				if (aJsFiles[i].indexOf('ui') >= 0) {
					//判断UI父类
					if (typeof PCORE.ui === 'object') {
						PCORE.debug('exist in CLASS, delete', aJsFiles[i]);
						aJsFiles.splice(i, 1);
						i--;
					}
				}
				else if (aJsFiles[i].indexOf('view') >= 0) {
					//判断VIEW父类
					if (typeof PCORE.view === 'object') {
						PCORE.debug('exist in CLASS, delete', aJsFiles[i]);
						aJsFiles.splice(i, 1);
						i--;
					}
				}
				else {
					var _js_object = aJsFiles[i].split('/');
					//TODO 干掉.js
					PCORE.debug('what\'s class', _js_object);
					_js_object[0] === 'widget' && (_js_object[0] = 'ui');
					//如果是自带类则进行以下判断，否则不判断
					if (_js_object[0] === 'ui' || _js_object[0] === 'view') {
						//先判断是否有父类
						var _hasPO;
						eval('_hasPO = (typeof PCORE.' + _js_object[0] + ')');
						//如果父类已经存在，判断自身是否有
						if (_hasPO !== 'undefined') {
							eval('_hasPO = (typeof PCORE.' + _js_object.join('.') + ')');
							//如果自身存在，移除出列表
							if (_hasPO === 'function') {
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
	PCORE.debug('show old callback', PCORE.importCallBack);
	!PCORE.importCallBack && (PCORE.importCallBack = []);
	/**
	 * 检查是否非空的importList
	 * 如果非空表示有程序进行中，只做添加操作
	 **/
	var bLoadIt = true;
	if (PCORE.importList && PCORE.importList.length > 0) {
		//添加本次加载列表进importList
		PCORE.importList = PCORE.importList.concat(aJsFiles);
		PCORE.debug('has progress. stop this.');
		//go to ready and not load.
		bLoadIt = false;
	}
	else {
		//对空importList进行添加并加载操作
		PCORE.importList = aJsFiles;
	}
	//加载js
	function __fJsLoader(js) {
		PCORE.debug('show import list', PCORE.importList);
		PCORE.debug('will remove list', PCORE.removeList);
		if (js) {
			var oJs = document.createElement('script');
			oJs.type = 'text/javascript';
			oJs.src = js;
			oHead.appendChild(oJs);
			PCORE.debug('append js', oJs.src);

			//添加一个移除NODE的列表
			!PCORE.removeList && (PCORE.removeList = []);
			PCORE.removeList.push(oJs);
		}
		else {
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
				PCORE.debug(this.src, 'loaded.');
				__fCallImportOK();
			};
			oJs.onerror = function () {
				PCORE.debug(oJs.src + ' load fail.');
				__fCallImportOK();
			}
		}

		function __fCallImportOK() {
			PCORE.debug('import complete.');
			PCORE.importList = PCORE.importList.slice(1);
			PCORE.debug('remain', PCORE.importList.length, 'js in list.');
			//列表还存在未导入数据
			if (PCORE.importList.length > 0) {
				PCORE.debug('remain', PCORE.importList);
				PCORE.debug('next:', PCORE.importList[0]);
				__fJsLoader(PCORE.importList[0]);
			}
			//列表全部导完
			else {
				//移除新添加的JS NODE，减少内存占用
				PCORE.debug('remove node list', PCORE.removeList);
				if (PCORE.removeList) {
					for (var i = 0; i < PCORE.removeList.length; i++) {
						var _script = PCORE.removeList[i];
						var _parent = _script.parentNode;
						PCORE.debug('node info', _parent, _script);
						//DEBUG模式不从HEAD中移除导入的JS NODE
						//!PCORE.isDebug && _parent.removeChild(_script);
						//TODO 是不是一定要移除呢？
					}
					PCORE.removeList = null;
					delete PCORE.removeList;
				}
				//回调callbackList，反转顺序执行
				var _callback = PCORE.importCallBack.reverse();
				//引用完即干掉，避免多生枝节
				PCORE.importCallBack = null;
				delete PCORE.importCallBack;
				PCORE.debug('run callback...');
				for (var v in _callback) {
					if (typeof _callback[v] == 'function') {
						PCORE.debug('running', _callback[v]);
						try {
							_callback[v]();
						}
						catch (e) {
							PCORE.debug('callback has error, maybe js file load fail.');
						}
					}
				}
				PCORE.debug('all callback ran.');
			}
		}
	}

	if (bLoadIt) {
		var _xTime = setTimeout(function () {
			PCORE.debug('loader is timeout running...');
			//对importList进行加载
			__fJsLoader(PCORE.importList[0]);
		}, 200);
	}

	return {
		ready: function () {
			//如果存在加载器，则清除，等新的callback加载完后再开启
			_xTime && clearTimeout(_xTime);
			PCORE.debug('push callback to list.');
			var xCallBack = arguments[0];
			//添加本次的callback
			PCORE.importCallBack.push(xCallBack);
			PCORE.debug('show now callback', PCORE.importCallBack);
			if (bLoadIt) {
				//对importList进行加载
				PCORE.debug('loader is ready running...');
				__fJsLoader(PCORE.importList[0]);
			}
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
	var _option = {
		el: '',
		id: '',
		data: {},
		events: {}
	};
	oOption = PCORE.extend(oOption, _option);
	var oFn = function () {
		this.load(sTplPath);
	};
	oFn.prototype = {
		fire: function (sEvent) {
			switch (sEvent) {
				case 'ON_UPDATE':
					if (typeof oOption.events['update'] === 'function') {
						oOption.events['update'].call(this, this.el);
					}
					break;
				case 'ON_RENDER':
					if (typeof oOption.events['render'] === 'function') {
						oOption.events['render'].call(this, this.el);
					}
					break;
			}
		},
		load: function (sTplPath) {
			var _this = this;
			_this.data = PCORE.extend({}, oOption['data']);
			_this.vm._data = _this.data;
			// 判断模板是否存在于缓存区
			if (PCORE.cache['tpl'][sTplPath]) {
				_this.render(PCORE.cache['tpl'][sTplPath]);
			}
			else {
				// 加载模板文件
				$.ajax({
					type: 'GET',
					url: sTplPath,
					dataType: 'TEXT',
					cache: false,
					success: function (sTpl) {
						_this.render(sTpl);
					},
					error: function () {
						PCORE.debug('template file is fail.');
					}
				});
			}
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
				PCORE.debug('Parse Data ->', sProperty, oModel);
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
							PCORE.debug('This data:', 'var ' + v + '=this[\'' + v + '\']');
							eval('var ' + v + '=this[\'' + v + '\']');
						}
						// model data
						for (v in oModel) {
							PCORE.debug('Model data:', 'var ' + v + '=oModel[\'' + v + '\']');
							eval('var ' + v + '=oModel[\'' + v + '\']');
						}
						var _cmd;
						try {
							eval('_cmd =' + sExpression);
						}
						catch (e) {
							PCORE.debug('Invalid expression', sExpression);
						}
						return _cmd;
					}

					var _expr = __fRunEval.call(this, sProperty);
					PCORE.debug('Eval result:', _expr);
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
					PCORE.debug(s, $1, sVal);
					if (typeof sVal === 'object') {
						// 渲染组件
						return 'ob="' + _this.keyBox(sVal) + '"';
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
		render: function (sTpl) {
			// 将模板放入缓存
			PCORE.cache['tpl'][sTplPath] = sTpl;
			var _div = document.createElement('div');
			_div.innerHTML = sTpl;
			var _tag = _div.getElementsByTagName('script');
			// 读取指定模块，否则则认为整个模板文件只有一个模块
			var sTemplate;
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
			this.update(this.tpl);
			this.fire('ON_RENDER');
		},
		update: function (sTpl) {
			/* 开始渲染 */
			var _this = this;
			var _el;
			if (this.el) {
				_el = this.el;
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
			_el.innerHTML = sTpl || this.tpl;
			// 渲染指令
			$('[pc-if]', _el).each(function () {
				var $This = $(this);
				var _if = _this.vm.tagBuild($This.attr('pc-if'));
				PCORE.debug(typeof _if, _if);
				if (_if && _if.length) {
					$This.removeAttr('pc-if');
				}
				else {
					$This.remove();
				}
			});
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
			PCORE.debug('Tpl DOM:', _el);
			_el.innerHTML = _this.vm.htmlBuild(_el.innerHTML);
			// 初始化组件
			// TODO 是否要每次都 new
			$('[ob]', _el).each(function () {
				var $This = $(this);
				var _obc = $This.attr('ob');
				_this.vm._key[_obc].fit($This);
			});
			_this.el = _el;
			// 返回/回调
			_this.fire('ON_UPDATE');
		},
		sets: function (sPath, xValue) {
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
			PCORE.debug('Show tpl data:', this.data);
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
 * 输出调戏信息
 */
PCORE.debug = function () {
	var _arg = ['CORE_DEBUG:'];
	for (var i = 0; i < arguments.length; i++) {
		_arg.push(arguments[i]);
	}
	PCORE.isDebug && console && ((console.debug && console.debug.apply(console, _arg)) || (console.info && console.info(_arg)));
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