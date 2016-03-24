import Ember from 'ember';
import config from '../config/environment';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	store: Ember.inject.service(),	
	email: null,
  	loadding:false,
  	validations: {  		
	    email: {
	      presence: true,
	      format: {
	        with: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
	        message: 'Invalid email address.'
	      }
	    }
  	},
  	didInsertElement() {		
	  this._super();
	  $(this.$()).parents(".modal-dialog").attr("style", "max-width:500px")	
	},
  	actions:{
		resetPasswd(){
			this.set("loadding", true);
			let that = this;
  			let ref = new Firebase(config.firebase);
  			ref.resetPassword({
			  email: that.get("email")
			}, function(error) {
				that.set("loadding", false);			        
				if (error) {
					switch (error.code) {
					  case "INVALID_USER":
					    console.log("The specified user account does not exist.");
					    that.get("showNotification")("The specified user account does not exist.", "error");
					    break;
					  default:
					  	that.get("showNotification")("Error resetting password", "error");
					    console.log("Error resetting password:", error);
					}
				} else {
					that.get("showNotification")("Password reset email sent successfully", "success");
					that.get("modalclose")();
				}
			});
		}
  	}
});
