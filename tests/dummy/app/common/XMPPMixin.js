import Mixin from '@ember/object/mixin';
import EmberObject from '@ember/object';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import { A } from '@ember/array';
import conf from '../config/environment';

const MessageFactory = EmberObject.create({
	stack: A(),
	register(instance) {
		window.console.info('push fuck pick up instance ====> ' + instance);
		this.get('stack').pushObject(instance);
		window.console.info('register instances ====>' + this.stack);
	},
	unregisterLast() {
		this.get('stack').popObject();
	},
	doCall(msg) {
		try {
			let msg2Json = JSON.parse(msg);

			window.console.info('instances ====>' + this.get('stack'));
			window.console.info('instance ====>' + this.get('stack').lastObject);

			this.get('stack').lastObject.set('message', msg2Json);
		} catch (error) {
			window.console.info(error)
		}

	}
});

export default Mixin.create({
	xmpp: inject(),
	isConnected: computed(function () {
		return typeof this.get('xmpp').getConnection === 'undefined';
	}),
	xmppCallBack(instance) {
		window.console.info('xmppCallBack instance ====> ' + instance);
		let that = this;

		MessageFactory.register(instance);

		function onMessage(msg) {
			let from = msg.getAttribute('from'),
				type = msg.getAttribute('type'),
				elems = msg.getElementsByTagName('body');

			if (type === 'chat' && elems.length > 0) {
				let body = elems[0];

				window.console.info('ECHOBOT: I got a message from ' + from + ': ' + that.get('xmpp').getText(body));
				MessageFactory.doCall(that.get('xmpp').getText(body));
			}
			return true;
		}

		if (this.isConnected) {
			this.get('xmpp').connect('alex', '123456', conf, onMessage);
		}
	},
	xmppSendMessage(msg, to) {
		this.get('xmpp').send(to + '@localhost', msg);
	},
	unregisterLast() {
		MessageFactory.unregisterLast();
	}
});
