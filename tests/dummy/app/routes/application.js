import Route from '@ember/routing/route';
import { computed } from '@ember/object';
import { Strophe, $pres, $msg } from 'strophe.js';



export default Route.extend({
	connection: null,
	init() {
		console.info(Strophe);
		this._super(...arguments);
	},
	actions: {
		connect() {
			let that = this;
			function onConnect(status) {
				if (status == Strophe.Status.CONNECTING) {
					console.info('Strophe is connecting.');
				} else if (status == Strophe.Status.CONNFAIL) {
					console.info('Strophe failed to connect.');
				} else if (status == Strophe.Status.DISCONNECTING) {
					console.info('Strophe is disconnecting.');
				} else if (status == Strophe.Status.DISCONNECTED) {
					console.info('Strophe is disconnected.');
				} else if (status == Strophe.Status.CONNECTED) {
					console.info('Strophe is connected.');
					that.get('connection').addHandler(onMessage, null, 'message', null, null,  null);
					that.get('connection').send($pres().tree());
				}
			}
			function onMessage(msg) {
				var to = msg.getAttribute('to');
				var from = msg.getAttribute('from');
				var type = msg.getAttribute('type');
				var elems = msg.getElementsByTagName('body');
				debugger
				if (type == "chat" && elems.length > 0) {
					var body = elems[0];

					console.info('ECHOBOT: I got a message from ' + from + ': ' +
						Strophe.getText(body));

					var reply = $msg({ to: from, from: to, type: 'chat' })
						.cnode(Strophe.copyElement(body));
					that.get('connection').send(reply.tree());

					console.info('ECHOBOT: I sent ' + from + ': ' + Strophe.getText(body));
				}

				// we must return true to keep the handler alive.
				// returning false would remove it after it finishes.
				return true;
			}
			let BOSH_SERVICE = 'http://192.168.100.172:7070/http-bind/';
			this.set('connection', new Strophe.Connection(BOSH_SERVICE, {'keepalive': true}))
			this.get('connection')
				.connect('alex@localhost', '123456', onConnect)

		},
		disconnect() {
			this.get('connection')
				.disconnect()
		}
	},
	afterModel(model, transition) {

		this._super(...arguments);
	},
});
