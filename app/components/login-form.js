import Ember from 'ember';
import config from '../config/environment';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	store: Ember.inject.service(),	
	routing: Ember.inject.service(),
	email: null,  	
  	password: null,
  	loadding:false,
  	validations: {  		
	    email: {
	      presence: true,
	      format: {
	        with: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
	        message: 'Invalid email address.'
	      }
	    },
	    password: {
	      presence: true,     
	    }
  	},
  	didInsertElement() {		
	  this._super();
	  $(this.$()).parents(".modal-dialog").attr("style", "max-width:500px");
	},
  	actions:{
  		login(){
  			this.set("loadding", true);
  			let that = this;
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
			  	console.log("Authenticated successfully with payload:", authData);
			  	that.get('routing').transitionTo('app');
			  	that.get("modalclose")();
			  }
			});
		},
		forgetPassword(){
			let modal = this.get("modal");
			Ember.set(modal, "modalTitle", "Reset Password");
			Ember.set(modal, "modalTemplete", "reset-form");
		}
  	}
});
