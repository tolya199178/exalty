import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	password: null,
	validations: {
  		password: {
	      presence: true,	      
	    }
  	},
	didInsertElement() {
		this._super();
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:400px;margin-top: 55px")		
	},
	actions:{
		onsubmit(){
			this.get("setpassword")(this.get("password"));
		},
		close(){
			this.get("modalclose")();
		}
	}
});