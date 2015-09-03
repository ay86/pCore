/**
 * pCore base UI
 * @Author: AngusYoung
 * @Version: 1.6
 * @Since: 13-01-01
 */

PCORE.ui = {
	uiID: 0,
	uiDOM: null,
	//config
	config: function (jConfig) {
		PCORE.extend(this, jConfig || {}, true);
	},
	fit: function (oElement) {
		this.Init();
		$(this.uiDOM).insertAfter(oElement);
		oElement.remove();
	},
	//fire the event
	fire: function (cEventName, oEl) {
		var aEvent = this.events[cEventName];
		if (aEvent) {
			var aArgument = [];
			for (var j = 2; j < arguments.length; j++) {
				aArgument.push(arguments[j]);
			}
			for (var i = 0; i < aEvent.length; i++) {
				if (typeof aEvent[i] === 'function') {
					aEvent[i].apply(oEl, aArgument);
				}
			}
		}
	},
	//add Listener events
	on: function (cEventName, fEventAction) {
		var aEvent = this.events[cEventName];
		if (!aEvent) {
			this.events[cEventName] = [];
		}
		this.events[cEventName].push(fEventAction);
	}
};
PCORE.widget = {};