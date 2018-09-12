import Route from '@ember/routing/route';
import { inject } from '@ember/service';
import conf from '../config/environment';

export default Route.extend({
	xmpp: inject(),
	init() {
		let that = this;
		function onMessage(msg) {
			var to = msg.getAttribute('to');
			var from = msg.getAttribute('from');
			var type = msg.getAttribute('type');
			var elems = msg.getElementsByTagName('body');
			if (type == "chat" && elems.length > 0) {
				var body = elems[0];

				console.info('ECHOBOT: I got a message from ' + from + ': ' +
					that.get('xmpp').getText(body));
			}
			// we must return true to keep the handler alive.
			// returning false would remove it after it finishes.
			return true;
		}
		this.get('xmpp').
			connect('alex', '123456', conf, onMessage);
	},
	actions: {
		send() {
			this.get('xmpp').send('alfred@localhost', '小可爱')
		}
	}
});
