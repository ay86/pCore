/**
 * JsonSelect for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 12-8-27
 */

/**
 * 根据指定的data数据，加载下拉框选项
 * data为数组，由多个JSON组成
 * JSON的格式为{id:Number, name:String [,subNode:Array]}
 * subNode里的格式与data一样
 */
PCORE.ui.jsonSelect = PCORE.make(PCORE.ui, {
	data:[],
	hasChange:false,
	defaultValue:'',
	changeFunction:function () {
	},
	Init:function () {
		if (!this.uiDOM) {
			return false;
		}
		if (this.hasChange) {
			this.uiDOM.onchange = this.changeFunction;
		}
		this.update();
		this.defaultValue && this.setDefault(this.defaultValue);
		this.fire('INIT_OK', this);
	},
	//添加子项
	addOption:function (itemText, itemValue) {
		var _item = new Option(itemText, itemValue);
		this.uiDOM.options.add(_item);
	},
	//更新选项
	update:function () {
		//清空原有子项
		this.uiDOM.options.length = 0;
		this.uiDOM.innerHTML = '';
		for (var i = 0; i < this.data.length; i++) {
			//如果ID为-1则添加为组
			if (this.data[i].id === -1) {
				var _optgroup = document.createElement('optgroup');
				_optgroup.setAttribute('label', this.data[i].name);
				this.uiDOM.appendChild(_optgroup);
			}
			else {
				if (this.data[i].id === 0) {
					this.addOption(this.data[i].name, '');
				}
				else {
					this.addOption(this.data[i].name, this.data[i].id);
				}
			}
		}
	},
	//设置默认值
	setDefault:function (nValue) {
		this.uiDOM.value = nValue;
		this.fire('SET_DEFAULT', this);
	},
	//从根据ID查找对应的数据
	findID:function (nID) {
		nID = parseInt(nID);
		for (var v in this.data) {
			if (this.data[v].id === nID) {
				return this.data[v];
			}
		}
	}
});