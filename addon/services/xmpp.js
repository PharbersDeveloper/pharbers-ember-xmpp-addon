import Service from '@ember/service';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { Strophe, $pres, $msg } from 'strophe.js';

export default Service.extend({
	getConnection: computed('connection', function () {
		return this.get('connection');
	}),
	getText(body) {
		return Strophe.xmlunescape(Strophe.getText(body));
	},
	connect(userName, password, xmppConf, callback) {
		let that = this;
		let onConnect = function (status) {
			if (status == Strophe.Status.CONNECTING) {
				window.console.info('正在连接...');
			} else if (status == Strophe.Status.CONNFAIL) {
				window.console.info('连接失败.');
			} else if (status == Strophe.Status.DISCONNECTING) {
				window.console.info('正在关闭连接...');
			} else if (status == Strophe.Status.DISCONNECTED) {
				window.console.info('连接关闭结束.');
				reConnect();
			} else if (status == Strophe.Status.ATTACHED) {
				window.console.info('重新连接.')
				that.get('getConnection').
					addHandler(callback, null, 'message', null, null, null);
			} else if (status == Strophe.Status.CONNECTED) {
				window.console.info('长连接.');
				that.get('getConnection').
					addHandler(callback, null, 'message', null, null, null);
				that.get('getConnection').
					send($pres().tree());
			}
		}
		let reConnect = function () {
			window.console.info('10秒后重新连接...');
			later(that, function () {
				exec()
			}, 1000 * 10)
		}

		function exec() {
			const BOSH_SERVICE = xmppConf.xmppHost + ':' + xmppConf.xmppPort + xmppConf.xmppBosh;

			that.set('connection', new Strophe.Connection(BOSH_SERVICE, { 'keepalive': true }));

			try {
				if (typeof localStorage.getItem('xmppjid') === 'object') {
					localStorage.removeItem('xmppjid');
					that.get('getConnection').connect(userName + '@localhost', password, onConnect);
					localStorage.setItem('xmppjid', userName + '@localhost');
				} else {
					window.console.info("fuck")
					that.get('getConnection').restore(localStorage.getItem('xmppjid'), onConnect);
				}
			} catch (error) {
				localStorage.removeItem('xmppjid');
				exec();
			}
			// window.console.info(that.get('getConnection').connected)
		}
		exec()
	},
    /**
     * 现在只支持文字发送
     * @param  {[type]} to            [description]
     * @param  {[type]} conent        [description]
     * @param  {String} [type='chat'] [description]
     * @return {[type]}               [description]
     */
	send(to, conent, type = 'chat') {
		let msg = $msg({
			to: to,
			from: localStorage.getItem('xmppjid'),
			type: type
		}).c("body", null, conent);

		this.get('getConnection').send(msg.tree());
	},

	closeConnection() {
		this.get('getConnection').disconnect()
	}
});
