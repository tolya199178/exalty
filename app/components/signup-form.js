import Ember from 'ember';
import config from '../config/environment';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	store: Ember.inject.service(),	
	email: null,
  	password: null,
  	fullname: null,
  	loadding:false,
  	validations: {
  		fullname: {
	      presence: true,	      
	    },
	    email: {
	      presence: true,
	      format: {
	        with: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
	      }
	    },
	    password: {
	      presence: true,
	      length: { minimum: 6, maximum: 12}
	    }
  	},  	
  	actions:{
  		signup(){
  			this.set("loadding", true);
  			let that = this;
  			let ref = new Firebase(config.firebase);
			ref.createUser({
			  email: this.get("email"),
			  password: this.get("password")
			}, function(error, userData) {
			  if (error) {
			    switch (error.code) {
			      case "EMAIL_TAKEN":
			        console.log("The new user account cannot be created because the email is already in use.");
			        that.set("loadding", false);
			        that.get("showNotification")("The new user account cannot be created because the email is already in use.", "error");
			        break;
			      case "INVALID_EMAIL":
			      	that.set("loadding", false);
			        that.get("showNotification")("The specified email is not a valid email.", "error");
			        break;
			      default:			      
			        console.log("Error creating user:", error);
			        that.set("loadding", false);
			        that.get("showNotification")("Error creating user:", "error");
			    }
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			    var user = that.get('store').createRecord('user', {
				  fullName: that.get("fullname"),
				  email: that.get("email"),
				  userId:userData.uid,
				  createdAt:(new Date()).valueOf()
				});
				user.save().then(function(){
					that.set("loadding", false);
					that.get("showNotification")("Successfully created user account", "success");
					that.get("modalclose")();
				});
			  }
			});
		},
  	}
});
