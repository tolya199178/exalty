import Ember from 'ember';
import config from '../config/environment';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	store: Ember.inject.service(),
	authorize: Ember.inject.service(),
	routing: Ember.inject.service(),
	email: null,	
  	firstName: null,
  	lastName: null,
  	loadding:false,

  	editCreditcard:false,

  	cardNumber:null,
  	expireDate:null,
  	cvc:null,


  	passwordRequiredModalView:false,
  	resolve:null,

  	changepasswordModalView:false,

  	crediticardModalView:false,


  	validations: {
  		firstName: {
	      presence: true,
	    },
	    lastName: {
	      presence: true,
	    },
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
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:600px");
		let user = this.get("authorize").getUser();
		this.set("firstName", user.get("firstName"));
		this.set("lastName", user.get("lastName"));
		this.set("email", user.get("email"));
		this.set("password", "");


		/**
		 * card
		 */
		/*
		this.set("cardNumber", null);
		this.set("expireDate", null);
		this.set("cvc", null);
		*/

	},
	getCurrentPassword(){
		this.set("passwordRequiredModalView", true);
		let that = this;
		return new Ember.RSVP.Promise(function(resolve) {
			that.set("resolve", resolve);
		})
	},
	/*
	isValidCC(inputNum) {
	   var digit, digits, flag, sum, _i, _len;
	    flag = true;
	    sum = 0;
	    digits = (inputNum + '').split('').reverse();        
	    for (_i = 0, _len = digits.length; _i < _len; _i++) {       
	      digit = digits[_i];      
	      digit = parseInt(digit, 10);          
	      if ((flag = !flag)) {                      
	        digit *= 2;               
	      }
	      if (digit > 9) {               
	        digit -= 9;                    
	      }      
	      sum += digit;          
	    }    
	    return sum % 10 === 0; 
  	},*/
	actions:{
		saveUser(){
			let that = this;
			let user = this.get("authorize").getUser();
			if(user.get("email") == this.get("email")){
				user.set("firstName", this.get("firstName"));
				user.set("lastName", this.get("lastName"));
				user.set("email", this.get("email"));
				user.save();
				that.get("showNotification")("Successfully saved", "success");
				Ember.run.later((function(){
					that.get("modalclose")();
				}),1000)
			}else{				
				this.getCurrentPassword().then(function(password){					
					that.set("loadding", true);
					let ref = new Firebase(config.firebase);
					ref.changeEmail({
					  oldEmail: user.get("email"),
					  newEmail: that.get("email"),
					  password: password
					}, function(error) {
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
					      	console.log("Error creating user:", error);
					      	that.get("showNotification")("Error creating user", "error");
					    }
					  } else {
					  	user.set("firstName", that.get("firstName"));
						user.set("lastName", that.get("lastName"));
						user.set("email", that.get("email"));
						user.save();
						that.set("loadding", false);
					    that.get("showNotification")("Successfully saved", "success");
						Ember.run.later((function(){
							that.get("modalclose")();
						}),1000)
					  }
					});
				})
			}
			return true;
		},
		closeRequiredPasswordModal(){
			this.set("passwordRequiredModalView", false);
		},
		onInputPassword(password){
			this.set("passwordRequiredModalView", false);
			this.get("resolve")(password);
		},
		changePassword(){
			this.set("changepasswordModalView", true);
		},
		changePasswordModalClose(){
			this.set("changepasswordModalView", false);
		},

		editCreditCard(){
			this.set("crediticardModalView", true);
		},
		creditiCardModalClose(){
			this.set("crediticardModalView", false);
		},

		showNotification(message, type){
			this.get("showNotification")(message, type);
		},

		deleteAccount(){
			let that = this;
			let user = this.get("authorize").getUser();
			if(confirm("Are you sure you want to delete your account? This is irreversible, and you will be unable to recover any of your information.")){
				this.getCurrentPassword().then(function(oldpassword){
					let ref = new Firebase(config.firebase);
					ref.removeUser({
					   email: user.get("email"),
				  	   password: oldpassword					  
					}, function(error) {
					  if (error) {
					    switch (error.code) {
					      case "INVALID_USER":
					        console.log("The specified user account does not exist.");
					        that.get("showNotification")("The specified user account does not exist.", "error");
					        break;
					      case "INVALID_PASSWORD":
					        console.log("The specified user account password is incorrect.");
					        that.get("showNotification")("The specified user account password is incorrect.", "error");
					        break;
					      default:
					        console.log("Error removing user:", error);
					        that.get("showNotification")("Error removing user.", "error");
					    }
					  } else {
					  	that.get("showNotification")("User account deleted successfully!", "success");
						Ember.run.later((function(){												    
							that.get("modalclose")();
							ref.unauth();
							that.get("routing").transitionTo('landing');
						}),1000)
					  }
					})
				})
			}
		}
	}
});
