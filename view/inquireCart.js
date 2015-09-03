/**
 * Inquire 选中列表
 * @Author: AngusYoung
 * @Version: 1.1
 * @Update: 12-11-27
 */

PCORE.view.inquireCart = PCORE.make(PCORE.view, {
	Init:function () {
		var _this = this;
		PCORE.use('ui;widget/scrollContent;widget/tips;widget/cart').ready(function () {
			_this.cart = new PCORE.ui.cart(false);
			_this.tips = new PCORE.ui.tips(false);
			_this.list = new PCORE.ui.scrollContent({
				id:'cart-select',
				step:300
			});
			_this.tips.config({
				arrowDirection:'Y',
				hasClose:false,
				width:507,
				delay:300
			});
			_this.cart.config({
				id:'cart',
				maxLength:20,
				limit:10
			});
			//将list附到cart
			_this.cart.on('INIT_OK', function () {
				$('#' + this.id + '-info').after(_this.list.uiDOM);
				_this.update('<ul></ul>');
			});
			_this.fire('INIT_OK', _this);
		});
	},
	update:function (x) {
		this.list.updateContent(x);
	}
});