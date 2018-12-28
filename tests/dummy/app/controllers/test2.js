import Controller from '@ember/controller';
import { observer } from '@ember/object';

export default Controller.extend({
	fluResult: observer('message', function () {
		this.set('showText2', `instance =>> ${this}, text =>> ${JSON.stringify(this.get('message'))}`)
	}),
});
