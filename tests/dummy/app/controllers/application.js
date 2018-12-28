import Controller from '@ember/controller';
import { observer } from '@ember/object';
import XMPPMixin from '../common/XMPPMixin';

export default Controller.extend(XMPPMixin, {
	content: '',
	message: null,
	init() {
		this._super(...arguments);
	},
	fluResult: observer('message', function () {
		this.set('showText', `instance =>> ${this}, text =>> ${JSON.stringify(this.get('message'))}`)
	}),
	actions: {
		send() {
			this.get('xmpp').send(this.get('to') + '@localhost', this.get('content'))
		},
		application() {
			this.unregisterLast()
			this.transitionToRoute('application')
		},
		test1() {
			this.unregisterLast()
			this.transitionToRoute('test1')
		},
		test2() {
			this.unregisterLast()
			this.transitionToRoute('test2')
		}
	}
});
