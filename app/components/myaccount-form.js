import Ember from 'ember';
import config from '../config/environment';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	store: Ember.inject.service(),
	authorize: Ember.inject.service(),
	routing: Ember.inject.service(),
	email: null,
	oldpassword: null,
  	password: null,
  	fullName: null,
  	loadding:false,

  	editCreditcard:false,

  	cardNumber:null,
  	expireDate:null,
  	cvc:null,



  	validations: {
  		fullName: {
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
		$(".email", this.$()).find("input").attr("readonly", "readonly");
		let user = this.get("authorize").getUser();
		this.set("fullName", user.get("fullName"));
		this.set("email", user.get("email"));
		this.set("password", "");


		/**
		 * card
		 */
		this.set("cardNumber", null);
		this.set("expireDate", null);
		this.set("cvc", null);

	},
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
  	},
	actions:{
		editCreditCard(){
			this.set("editCreditcard", true);
		},
		saveUser(){
			let that = this;
			let user = this.get("authorize").getUser();
			user.set("fullName", this.get("fullName"));			
			user.save();
			this.get("authorize").setUser(user);

			/** 
			 * Card
			 */
			if(this.get("editCreditcard") == true){
				let cardNumber = this.get("cardNumber");
				let expireDate =  this.get("expireDate");
				let cvc =  this.get("cvc");
				let date = expireDate.split('/')
				if(!cardNumber || !expireDate || !cvc){
					$("form", this.$()).find("form").find("input").trigger("blur");
					return true;
				}
				if(this.isValidCC(cardNumber) == false){
					$("form", this.$()).find("form").find(".cardnumber").addClass("has-error");
					return true;
				}

				/**
				 *Create Card
				 */				
				Stripe.setPublishableKey(config.stripePublishableKey);				

				Stripe.card.createToken({			      
			      'number':cardNumber,
	              'cvc':cvc,
	              'exp-month':date[0],
	              'exp-year':date[1],
			    }, function(status, response) {
			    	 console.log(status);
				      if (response.error) {
				         console.log(error)
				      } else {
				        // token contains id, last4, and card type
				        var token = response['id'];

				        /**
				         * Add Card
				         */
				        var cardsRef = new Firebase(config.firebase + "/cards");
						cardsRef.child(that.get("authorize").getUserId()).set({
							card:token
						});	
				    }
				});				
			}

			/** 
			 * Password
			 */

			let password = this.get("password");
			if(password){
				console.log(password)
				let oldpassword = this.get("oldpassword");
				let ref = new Firebase(config.firebase);
				ref.changePassword({
				  email: user.get("email"),
				  oldPassword: oldpassword,
				  newPassword: password
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
				      	console.log("Error changing password:", error);
				      	that.get("showNotification")("Error changing password", "error");
				        
				    }
				  } else {
				    that.get("showNotification")("Successfully saved", "success");
					Ember.run.later((function(){
						that.get("modalclose")();
					}),1000)
				  }
				});

			}else{				
				that.get("showNotification")("Successfully saved", "success");
				Ember.run.later((function(){
					that.get("modalclose")();
				}),1000)
			}
		},
		deleteAccount(){
			let that = this;
			let user = this.get("authorize").getUser();
			if(confirm("Are you sure")){
				let oldpassword = this.get("oldpassword");
				if(oldpassword){
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
					});

				}else{
					that.get("showNotification")("You should input Current Password", "error");
				}
			}
		}
	}
});
