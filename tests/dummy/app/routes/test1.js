import Route from '@ember/routing/route';
import XMPPMixin from '../common/XMPPMixin';

export default Route.extend(XMPPMixin, {
	beforeModel() {
		this.xmppCallBack(this.controllerFor('test1'));
	}
});
