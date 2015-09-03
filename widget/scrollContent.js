/**
 * scrollContent for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 12-10-18
 */

PCORE.ui.scrollContent = PCORE.make(PCORE.ui, {
	id:'',
	step:300,
	Init:function () {
		//创建代码片断
		var oFrag = document.createDocumentFragment();
		//创建scrollContent主体
		var oDiv = this.uiDOM = document.createElement('div');
		oDiv.id = this.id;
		oFrag.appendChild(oDiv);
		//创建左方向
		var oLeft = this.lefter = document.createElement('a');
		oLeft.className = 'scroll-content-left';
		oLeft.style.cssText = 'visibility: hidden;';
		oDiv.appendChild(oLeft);
		//创建内容区
		var oContent = this.content = document.createElement('div');
		oContent.className = 'scroll-content-main';
		oDiv.appendChild(oContent);
		//创建右方向
		var oRight = this.righter = document.createElement('a');
		oRight.className = 'scroll-content-right';
		oRight.style.cssText = 'visibility: hidden;';
		oDiv.appendChild(oRight);

		document.body.appendChild(oDiv);
		var _this = this;
		oLeft.onclick = function () {
			$(oContent).animate({
				scrollLeft:$(this).scrollLeft() - _this.step
			});
		};
		oRight.onclick = function () {
			$(oContent).animate({
				scrollLeft:$(this).scrollLeft() + _this.step
			});
		};
		this.fire('INIT_OK', this);
	},
	updateContent:function (xHTML) {
		if (typeof xHTML === 'string') {
			this.content.innerHTML = xHTML;
		}
		else {
			this.content.appendChild(xHTML);
		}
		this.fire('CHANGE', this);
	}
});