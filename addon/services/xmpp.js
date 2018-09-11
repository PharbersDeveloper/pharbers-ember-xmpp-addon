import Service from '@ember/service';
import { computed } from '@ember/object';
import { Strophe, $pres, $msg } from 'strophe.js';

export default Service.extend({
    connection: null,
    getConnection: computed('connection', function() {
        return this.get('connection');
    }),
    
});
