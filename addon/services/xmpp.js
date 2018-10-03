import Service from '@ember/service';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';
import { Strophe, $pres, $msg } from 'strophe.js';

export default Service.extend({
    getConnection: computed('connection', function() {
        return this.get('connection');
    }),
    getText(body) {
        return Strophe.xmlunescape(Strophe.getText(body));
    },
    connect(userName, password, xmppConf, callback) {
        let that = this;
        let onConnect = function(status) {
            if (status == Strophe.Status.CONNECTING) {
                console.info('正在连接...');
            } else if (status == Strophe.Status.CONNFAIL) {
                console.info('连接失败.');
                reConnect();
            } else if (status == Strophe.Status.DISCONNECTING) {
                console.info('正在关闭连接...');
            } else if (status == Strophe.Status.DISCONNECTED) {
                console.info('连接关闭结束.');
                reConnect();
            } else if (status == Strophe.Status.ATTACHED) {
                console.info('重新连接.')
                that.get('getConnection').
                    addHandler(callback, null, 'message', null, null,  null);
            } else if (status == Strophe.Status.CONNECTED) {
                console.info('长连接.');
                that.get('getConnection').
                    addHandler(callback, null, 'message', null, null,  null);
                that.get('getConnection').
                    send($pres().tree());
            }
        }
        let reConnect = function() {
            console.info('5秒后重新连接...');
            later(that, function() {
                exec()
            }, 1000 * 5)
        }

        // let rawInput = function(data) {
        //     console.info('RECV => ' + data)
        // }
        // let rawOutput = function(data) {
        //     console.info('SENT => ' + data)
        // }
        function exec() {
            if(that.get('getConnection') === undefined || !that.get('getConnection').connected) {
            
                const BOSH_SERVICE =
                    xmppConf.xmppHost + ':' + xmppConf.xmppPort + xmppConf.xmppBosh;
                
                
                that.set('connection',
                    new Strophe.Connection(BOSH_SERVICE, {'keepalive': true}));
    
                try {
                    that.get('getConnection').restore(userName + '@localhost', onConnect);
                } catch(e) {
                    localStorage.removeItem('xmppjid');
                    that.get('getConnection').
                        connect(userName + '@localhost', password, onConnect);
                }
                localStorage.setItem('xmppjid', userName + '@localhost')
                
    
                // that.get('getConnection').rawInput = rawInput
                // that.get('getConnection').rawOutput = rawOutput
            }
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
