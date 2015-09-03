/**
 * 国家地区联动选择组件
 * @Author: AngusYoung
 * @Version: 1.3
 * @Update: 12-11-27
 */

PCORE.view.regionSelect = PCORE.make(PCORE.view, {
	Init:function () {
		var _this = this;
		PCORE.use('ui;widget/jsonSelect').ready(function () {
			//实例化国家，省，市下拉框
			_this.countrySel = new PCORE.ui.jsonSelect(false);
			_this.provinceSel = new PCORE.ui.jsonSelect(false);
			//市在实例时一同初始化
			_this.citySel = new PCORE.ui.jsonSelect({
				uiDOM:_this.city
			});

			//监听设置默认值事件
			_this.provinceSel.on('SET_DEFAULT', function () {
				this.changeFunction();
			});
			//配置省下拉框
			_this.provinceSel.config({
				uiDOM:_this.province,
				hasChange:true,
				changeFunction:function () {
					//取得当前选中省的市级数据
					var _data = _this.provinceSel.findID(_this.provinceSel.uiDOM.value);
					//如果存在则显示市级下拉框
					if (_data && _data.subNode) {
						_this.citySel.data = _data.subNode;
						//显示市级下拉框，因为默认设置了style="display:none;"，所以将整个属性都移除
						_this.citySel.uiDOM.removeAttribute('style');
						_this.citySel.update();
						//如果存在市级的默认值就设置上
						_this.defaultValue[2] && _this.citySel.setDefault(_this.defaultValue[2]);
					}
					//如果不存在市级数据，则将原有的市级下拉框清空并隐藏
					else {
						_this.citySel.uiDOM.length = 0;
						_this.citySel.uiDOM.style.display = 'none';
					}
					_this.provinceSel.fire('CHANGE', _this.provinceSel);
				}
			});
			//初始化省下拉框
			_this.provinceSel.Init();

			//监听设置默认值事件
			_this.countrySel.on('SET_DEFAULT', function () {
				this.changeFunction();
			});
			//配置国家下拉框
			if (!_this.defaultValue) {
				_this.defaultValue = [];
			}
			_this.countrySel.config({
				uiDOM:_this.country,
				hasChange:true,
				defaultValue:_this.defaultValue[0],
				data:_this.data,
				changeFunction:function () {
					//取得当前选中国家的省级数据
					var _data = _this.countrySel.findID(_this.countrySel.uiDOM.value);
					if (_data) {
						//保存countryCode到下拉框code属性
						_this.countrySel.uiDOM.setAttribute('code', _data.countryCode);
						//显示当前国家的国旗图标
						PCORE.debug('show country data', _data);
						var _flag = $(_this.countrySel.uiDOM).parent().children('.flags');
						if (_flag.length) {
							_flag.removeAttr('class').addClass('flags fs' + _data.id).show();
						}
						else {
							$(_this.countrySel.uiDOM).after('<span class="flags fs' + _data.id + '"></span>');
						}
					}
					else {
						_this.countrySel.uiDOM.setAttribute('code', '');
						$(_this.countrySel.uiDOM).parent().children('.flags').hide();
					}
					//如果存在则显示省级下拉框
					if (_data && _data.subNode) {
						_this.provinceSel.data = _data.subNode;
						//显示省级下拉框，因为默认设置了style="display:none;"，所以将整个属性都移除
						_this.provinceSel.uiDOM.removeAttribute('style');
						_this.provinceSel.update();
						//如果存在省级的默认值就设置上
						_this.defaultValue[1] && _this.provinceSel.setDefault(_this.defaultValue[1]);
					}
					//如果不存在省级数据，则将原有的省、市级下拉框清空并隐藏
					else {
						_this.provinceSel.uiDOM.length = 0;
						_this.provinceSel.uiDOM.style.display = 'none';
						_this.citySel.uiDOM.length = 0;
						_this.citySel.uiDOM.style.display = 'none';
					}
					_this.countrySel.fire('CHANGE', _this.countrySel);
				}
			});
			//初始化下拉框
			_this.countrySel.Init();
			_this.fire('INIT_OK', _this);
		});
	}
});