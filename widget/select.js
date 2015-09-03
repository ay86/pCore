/**
 * Select for pCore UI widget
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 12-11-28
 */

PCORE.ui.select = PCORE.make(PCORE.ui, {

});


/*Select Skin 110326(AngusYoung)*/
function mSelect(cVarName, cStylePath) {
	var newStyle;
	var oHead = document.getElementsByTagName('head')[0];
	var aLink = oHead.getElementsByTagName('link');
	for (var i = 0; i < aLink.length; i++) {
		if (aLink[i].href == cStylePath) {
			newStyle = true;
			break;
		}
	}
	if (!newStyle) {
		newStyle = document.createElement('link');
		newStyle.type = 'text/css';
		newStyle.rel = 'stylesheet';
		newStyle.href = cStylePath;
		oHead.appendChild(newStyle);
	}
	this.oo = cVarName;
}
mSelect.prototype = {
	Create:function (oSelect, cStyleName, lGlide) {
		var _this = this;
		if (oSelect.tagName.toLowerCase() == 'select') {
			var cSelectID = 'mSel_' + Math.round(Math.random() * 1000 + 1);
			oSelect.setAttribute('mSelectID', cSelectID);
			oSelect.style.display = 'none';
			var _select = document.createElement('span');
			_select.setAttribute('name', oSelect.name + '_mSel');
			_select.className = cStyleName + '_mSel_main';
			var nNormal = oSelect.selectedIndex;
			_select.innerHTML = '<a>' + oSelect.options[nNormal].text + '</a>';
			oSelect.parentNode.insertBefore(_select, oSelect);
			var nSpanW = mSel_GetCss(_select, 'width');
			if (!oSelect.disabled) {
				_select.onclick = function () {
					mSel_stopBubble(arguments[arguments.length - 1]);
					_this.Show(this, lGlide);
				};
				var _select_list = document.createElement('ul');
				_select_list.className = cStyleName + '_mSel_list';
				var cResult = '';
				for (var i = 0; i < oSelect.length; i++) {
					cResult += '<li';
					if (i == nNormal) {
						cResult += ' class="mSel_on"';
					}
					cResult += '><a';
					if (oSelect.options[i].disabled) {
						cResult += ' class="mSel_disable"';
					} else {
						cResult += ' href="mSelect://this" title="' + oSelect.options[i].text + '" target="_blank" onclick="return ' + _this.oo + '.Selected(this.parentNode,' + _this.oo + '.getSelectID(\'' + cSelectID + '\'),' + i + ');"';
					}
					cResult += '>' + oSelect.options[i].text + '</a></li>';
				}
				_select_list.innerHTML = '<li class="mSel_start"></li>' + cResult + '<li class="mSel_end"></li>';
				oSelect.parentNode.insertBefore(_select_list, oSelect);
				_select_list.style.display = 'block';
				var nUlW = _select_list.offsetWidth;
				_select_list.style.display = 'none';
				var __BL = mSel_GetCss(_select, 'borderLeftWidth'), __BR = mSel_GetCss(_select, 'borderRightWidth'), __PL = mSel_GetCss(_select, 'paddingLeft'), __PR = mSel_GetCss(_select, 'paddingRight');
				__BL = isNaN(parseInt(__BL)) ? 0 : __BL, __BR = isNaN(parseInt(__BR)) ? 0 : __BR, __PL = isNaN(parseInt(__PL)) ? 0 : __PL, __PR = isNaN(parseInt(__PR)) ? 0 : __PR;
				var _BL = mSel_GetCss(_select_list, 'borderLeftWidth'), _BR = mSel_GetCss(_select_list, 'borderRightWidth'), _PL = mSel_GetCss(_select_list, 'paddingLeft'), _PR = mSel_GetCss(_select_list, 'paddingRight');
				_BL = isNaN(parseInt(_BL)) ? 0 : _BL, _BR = isNaN(parseInt(_BR)) ? 0 : _BR, _PL = isNaN(parseInt(_PL)) ? 0 : _PL, _PR = isNaN(parseInt(_PR)) ? 0 : _PR;
				if (nUlW < nSpanW) _select_list.style.width = (nSpanW + __BL + __BR + __PL + __PR) - _BL - _BR - _PL - _PR + 'px'; else if (nUlW > nSpanW) _select.style.width = nUlW - __BL - __BR - __PL - __PR + 'px';
			}
			_this.Listen(oSelect);
		}
	},
	Show:function (oObj, lGlide) {
		var _this = this;
		var oSel_List = mSel_MoveNode(oObj, 1);
		var aSel_List_item = oSel_List.getElementsByTagName('li');
		_this.SelectedIndex = mSel_MoveNode(oSel_List, 1).selectedIndex;
		_this.Hover(aSel_List_item[_this.SelectedIndex + 1]);
		var fDocClick = document.documentElement.onclick || function () {
		};
		if (_this.ShowWhat == oSel_List) {
			fDocClick();
		} else {
			fDocClick();
			_this.ShowWhat = oSel_List;
			oSel_List.style.top = mSel_SeekTp(oObj, 2) - 1 + 'px';
			oSel_List.style.left = mSel_SeekTp(oObj, 3) + 'px';
			oSel_List.style.display = 'block';
			if (lGlide) {
				var nSourceHei = mSel_GetInnerSize(oSel_List, 1);
				oSel_List.style.overflow = 'hidden';
				oSel_List.style.height = '0px';
				_this.Glide(oSel_List, nSourceHei, nSourceHei, 20);
				document.documentElement.onclick = function () {
					if (_this.ShowWhat) {
						clearTimeout(_this.Timer);
						_this.ShowWhat.style.overflow = 'hidden';
						_this.Glide(_this.ShowWhat, nSourceHei, 0, 20);
						_this.ShowWhat = null;
					}
				};
			}
			else {
				document.documentElement.onclick = function () {
					if (_this.ShowWhat) {
						_this.ShowWhat.style.display = 'none';
						_this.ShowWhat = null;
					}
				};
			}
			fDocClick = document.documentElement.onclick;
			document.documentElement.onclick = function () {
				document.documentElement.onkeydown = null;
				fDocClick();
			}
			document.documentElement.onkeydown = function () {
				var e = arguments[arguments.length - 1];
				var evt = e || window.event;
				switch (evt.keyCode) {
					case 13:/*ENTER*/
						_this.Selected(aSel_List_item[_this.SelectedIndex + 1], mSel_MoveNode(oSel_List, 1), _this.SelectedIndex);
						var fRun = document.documentElement.onclick || function () {
						};
						fRun();
						break;
					case 38:/*UP*/
						if (_this.SelectedIndex > 0) {
							_this.gotoActive(aSel_List_item, 0);
						}
						break;
					case 40:/*DOWN*/
						if (_this.SelectedIndex < aSel_List_item.length - 3) {
							_this.gotoActive(aSel_List_item, 1);
						}
						break;
				}
				_this.Hover(aSel_List_item[_this.SelectedIndex + 1]);
				return false;
			};
		}
	},
	Selected:function (oItemObj, oSelect, nValue) {
		var _this = this;
		if (oSelect.selectedIndex !== nValue) {
			oSelect.selectedIndex = nValue;
			if (oSelect.onchange) {
				oSelect.onchange();
			}
			_this.Hover(oItemObj);
			mSel_MoveNode(oItemObj.parentNode, -1).innerHTML = '<a>' + oSelect.options[nValue].text + '</a>';
		}
		return false;
	},
	Glide:function (oObj, nShei, nThei, nTime) {
		var _this = this;
		var nSteps = Math.round(200 / nTime);
		if (nThei == 0) {
			nSteps /= 2;
			if (mSel_GetInnerSize(oObj, 1) > Math.round(nShei / nSteps)) {
				oObj.style.height = mSel_GetInnerSize(oObj, 1) - Math.round(nShei / nSteps) + 'px';
				_this.Timer = setTimeout(function () {
					_this.Glide(oObj, nShei, nThei, nTime);
				}, nTime);
			} else {
				oObj.style.height = nShei + 'px';
				oObj.style.overflow = 'visible';
				oObj.style.display = 'none';
			}
		} else {
			if (mSel_GetInnerSize(oObj, 1) < nThei - Math.round(nShei / nSteps)) {
				oObj.style.height = mSel_GetInnerSize(oObj, 1) + Math.round(nShei / nSteps) + 'px';
				_this.Timer = setTimeout(function () {
					_this.Glide(oObj, nShei, nThei, nTime);
				}, nTime);
			} else {
				oObj.style.height = nShei + 'px';
				oObj.style.overflow = 'visible';
			}
		}
	},
	gotoActive:function (aList_item, nStep) {
		var _this = this;
		if (nStep == 0) {
			for (var i = _this.SelectedIndex; i > 0; i--) {
				if (aList_item[i].getElementsByTagName('a')[0].className !== 'mSel_disable') {
					return _this.SelectedIndex = i - 1;
				}
			}
		} else {
			for (var i = _this.SelectedIndex + 2; i < aList_item.length - 1; i++) {
				if (aList_item[i].getElementsByTagName('a')[0].className !== 'mSel_disable') {
					return _this.SelectedIndex = i - 1;
				}
			}
		}
	},
	Hover:function (oObj) {
		var aList = oObj.parentNode.getElementsByTagName(oObj.tagName);
		for (i = 0; i < aList.length; i++) {
			if (aList[i].className == 'mSel_on') {
				aList[i].className = null;
			}
		}
		oObj.className = 'mSel_on';
	},
	Listen:function (oObj) {
		if (oObj.form) {
			if (oObj.form.getAttribute('mLit') !== 'yes') {
				var fFormReSet = oObj.form.onreset || function () {
				};
				oObj.form.onreset = function () {
					setTimeout(function () {
						var aS = oObj.form.getElementsByTagName('select');
						for (var i = 0; i < aS.length; i++) {
							var oMSel = mSel_MoveNode(mSel_MoveNode(aS[i], -1), -1);
							if (oMSel.getAttribute('name') == aS[i].name + '_mSel') {
								oMSel.innerHTML = '<a>' + aS[i].options[aS[i].selectedIndex].text + '</a>';
							}
						}
						fFormReSet();
					}, 100);
				};
				oObj.form.setAttribute('mLit', 'yes');
			}
		}
	},
	getSelectID:function (cID) {
		var aS = document.getElementsByTagName('select');
		for (var i = 0; i < aS.length; i++) {
			if (aS[i].getAttribute('mSelectID') == cID) {
				return aS[i];
			}
		}
	}
};
