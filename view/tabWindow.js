/**
 * 组合一个带有Tab的Window
 * @Author: AngusYoung
 * @Version: 1.2
 * @Update: 12-11-27
 */
PCORE.view.tabWindow = PCORE.make(PCORE.view, {
	Init:function () {
		var _this = this;
		PCORE.use('ui;widget/window;widget/tab').ready(function () {
			//add Window widget in tabWindow View
			_this.window = new PCORE.ui.window(false);
			//add Tab widget in tabWindow View
			_this.tab = new PCORE.ui.tab(false);
			_this.fire('INIT_OK', _this);
		});
	}
});