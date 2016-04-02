import Ember from 'ember';
import config from '../config/environment';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	store: Ember.inject.service(),
	routing: Ember.inject.service(),
	email: null,
  	password: null,
  	firstname: null,
  	lastname: null,
  	loadding:false,
  	validations: {
  		firstname: {
	      presence: true,
	    },
	    lastname: {
	      presence: true,
	    },
	    email: {
	      presence: true,
	      format: {
	        with: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
	        message: 'Invalid email address.'
	      }
	    },
	    password: {
	      presence: true,
	      length: { minimum: 6, maximum: 32}
	    }
  	}, 
  	didInsertElement() {		
	  this._super();
	  $(this.$()).parents(".modal-dialog").attr("style", "max-width:500px")	
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
				  firstName: that.get("firstname"),
				  lastName: that.get("lastname"),
				  email: that.get("email"),
				  userId:userData.uid,
				  createdAt:(new Date()).valueOf()
				});				
				user.save().then(function(){
					/**
					 *Create customer
					 */
	                var customerRef = new Firebase(config.firebase + "/customers");
	                customerRef.child(userData.uid).set({
									email: that.get("email"),
									description: 'Customer for ' + that.get("email")
								});
	                console.log("Auto Login");
	                /**
	                 * Auto Login
	                 */
	                let ref = new Firebase(config.firebase);
		  			ref.unauth();
					ref.authWithPassword({
					  "email": that.get("email"),
					  "password": that.get("password"),
					}, function(error, authData) {
					  console.log(arguments);
					  that.set("loadding", false);
					  if (error) {
					    console.log("Login Failed!  Incorrect username or password", error);
					    that.get("showNotification")("Login Failed! Incorrect username or password", "error");
					  } else {
					  	that.get("showNotification")("Successfully created user account", "success");
					  	Ember.run.later((function() {
					  		that.get("modalclose")();
							that.get('routing').transitionTo('app');
						}), 1000)
					  }
					});
					
	                
				});
			  }
			});
		},
  	}
});
