import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	title:null,	
	validations: {
  		title: {
	      presence: true,
	    }
  	},
	actions:{
		editSong(row){
			this.get("editSong")(row);
		},
		removeServiceItem(row){
			this.get("removeServiceItem")(row);
		}
	}
});
