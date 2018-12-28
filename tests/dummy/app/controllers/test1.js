import Controller from '@ember/controller';
import { observer } from '@ember/object';

export default Controller.extend({
	init() {
		this._super(...arguments);
	},
	fluResult: observer('message', function () {
		this.set('showText1', `instance =>> ${this}, text =>> ${JSON.stringify(this.get('message'))}`)
	}),
});
