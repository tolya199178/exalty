import Ember from 'ember';
import config from '../config/environment';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	authorize: Ember.inject.service(),
	oldpassword: null,
  	newpassword: null,
  	loadding:false,  	
  	validations: {
  		oldpassword: {
	      presence: true,
	    },
	    newpassword: {
	      presence: true,
	    }
  	},
	didInsertElement() {
		this._super();
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:500px;margin-top: 55px")
	},

	actions:{
		onsubmit(){
			let that = this;
			let oldpassword = this.get("oldpassword");
			let password = this.get("newpassword");
			let user = this.get("authorize").getUser();
			let ref = new Firebase(config.firebase);
			this.set("loadding", true);
			ref.changePassword({
			  email: user.get("email"),
			  oldPassword: oldpassword,
			  newPassword: password
			}, function(error) {
			  that.set("loadding", false);
			  if (error) {
			    switch (error.code) {
			      case "INVALID_PASSWORD":
			        console.log("The specified user account password is incorrect.");
			        that.get("showNotification")("The specified user account password is incorrect.", "error");
			        break;
			      case "INVALID_USER":
			        console.log("The specified user account does not exist.");
			        that.get("showNotification")("The specified user account does not exist.", "error");
			        break;
			      default:
			      	console.log("Error changing password:", error);
			      	that.get("showNotification")("Error changing password", "error");
			        
			    }
			  } else {
			    that.get("showNotification")("User password changed successfully", "success");
				Ember.run.later((function(){
					that.get("modalclose")();
				}),1000)
			  }
			});
		},
		close(){
			this.get("modalclose")();
		}
	}
});
