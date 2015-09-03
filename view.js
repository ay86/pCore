/**
 * pCore base view
 * @Author: AngusYoung
 * @Version: 2.0
 * @Update: 13-01-01
 */

PCORE.view = {
	//config
	config:function (jConfig) {
		PCORE.extend(this, jConfig || {}, true);
	},
	//fire the event
	fire:function (cEventName, oEl) {
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
	on:function (cEventName, fEventAction) {
		var aEvent = this.events[cEventName];
		if (!aEvent) {
			this.events[cEventName] = [];
		}
		this.events[cEventName].push(fEventAction);
	}
};