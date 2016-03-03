/**
 * JS PowerCore Demo
 * @Author: AngusYoung
 * @Version: 1.0
 * @Update: 13-1-3
 */

//PCORE.isDebug = true;
PCORE.config({baseURL:'/js/pCore/'});
$(function () {
	var oWin;
	var $Open = $('#open');
	var $Close = $('#close');
	var $Tpl = $('#new-tpl');
	$Open.click(function () {
		PCORE.use('ui;widget/window').ready(function () {
			oWin = new PCORE.widget.Window(false);
			oWin.config({
				title: 'This is Open Window Title',
				hasClose: true,
				width: 400,
				height: 240
			});
			oWin.on('INIT_OK', function () {
				PCORE.use('ui;widget/message').ready(function () {
					new PCORE.widget.Message({
						hasMask: true,
						text: '<h1>the window is open complete.</h1>',
						buttonsHTML: '<a class="btn-32 btn-blue cancel-btn"><span>OK</span></a>',
						width: 300
					});
				});
				$Close.unbind('click').click(function () {
					alert('hey hey, close window when close button.');
					oWin.close();
					return false;
				});
			});
			oWin.on('CLOSE', function () {
				PCORE.use('ui;widget/message').ready(function () {
					new PCORE.widget.Message({
						isFade: true,
						hasMask: true,
						text: '<h1>window is closed.</h1>',
						buttonsHTML: '<a class="btn-32 btn-white cancel-btn"><span>OK</span></a>',
						width: 300
					});
				});
				$Close.unbind('click');
			});
			oWin.on('UPDATE_CONTENT', function () {
				alert('window is update content.');
			});
			oWin.Init();
			oWin.updateContent($('#content').val());
		});
		return false;
	});

	var oObj;
	PCORE.use('ui;widget/message').ready(function () {
		oObj = new PCORE.widget.Message(false);
		oObj.config({
			hasMask: true,
			text: '<h1>the window is start template.</h1>',
			buttonsHTML: '<a class="btn-32 btn-blue cancel-btn"><span>OK</span></a>',
			width: 300
		});
		//oTest.obj.al = oObj;
	});
	function abc(){}
	var oTest = {
		title: 'Hello world!',
		member: [
			{name: 'Angus', age: 28},
			{name: 'Nancy', age: 26},
			{name: 'Simon', age: 30},
			{name: 'Jim', age: 29}
		],
		times: [
			{time: '2014-03-10 16:20'},
			{time: Date}
		],
		content: 'Give me',
		obj: {
			tl: new abc
		}
	};
	$Tpl.on('click', function () {
		var _test = PCORE.parse('tpl/test.tpl', {
			el: 'div',
			id: 'test',
			data: oTest,
			events: {
				update: function () {
					//console.info('template update.');
				},
				render: function () {
					//console.info('template is render.');
					$('#tpl-cont').append(this.el);
				}
			}
		});
//		console.log(_test)
		setTimeout(function () {
			//console.warn('rebuild');
			// 修改Model Data是不会直接更新到模板上的，即使执行了update事件
			oTest.title = 'The world is bad!';
			_test.update();
			// 使用sets才可以更新模板的对应数据
			oTest.title = 'Changed from Sets';
			setTimeout(function () {
				_test.sets('title', oTest.title);
			}, 500)
		}, 1000);
	});
});