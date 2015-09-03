/**
 * Cart for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 12-10-18
 */

PCORE.ui.cart = PCORE.make(PCORE.ui, {
	id:'ui-cart',
	maxLength:0,
	length:0,
	limit:10,
	item:{},
	text:'Select',
	submit:'<button type="button">Submit</button>',
	Init:function () {
		var oFrag = document.createDocumentFragment();
		var oDiv = this.uiDOM = document.createElement('div');
		oFrag.appendChild(oDiv);
		oDiv.id = this.id;
		var sHTML = '<div id="' + this.id + '-info">' + this.text + ' ( <strong><span id="' + this.id + '-total">0</span>';
		if (this.maxLength > 0) {
			sHTML += ' / ' + this.maxLength;
		}
		sHTML += '</strong> )</div>';
		oDiv.innerHTML = sHTML;
		if (typeof this.submit === 'string') {
			oDiv.innerHTML += this.submit;
		}
		else {
			this.submit.style.display='block';
			oDiv.appendChild(this.submit);
		}

		document.body.appendChild(oFrag);
		this.fire('INIT_OK', this);
	},
	addItem:function () {
		if (this.length == 0) {
			this.show();
		}
		this.length++;
		this.sync();
	},
	removeItem:function () {
		this.length--;
		if (this.length == 0) {
			this.hide();
		}
		this.sync();
	},
	sync:function () {
		document.getElementById(this.id + '-total').innerHTML = this.length;
		this.fire('SYNC', this);
	},
	show:function () {
		$(this.uiDOM).fadeIn();
		this.fire('SHOW', this);
	},
	hide:function () {
		$(this.uiDOM).fadeOut();
		this.fire('HIDE', this);
	}
});