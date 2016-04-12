import Ember from 'ember';
import config from '../config/environment';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	authorize: Ember.inject.service(),
	cardNumber:null,
  	expireDate:null,
  	cvc:null,
  	requiredcard:false,
  	accouneEdit:true,
  	loadding:false,
  	didInsertElement() {
  		let that = this;
		this._super();
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:500px;margin-top:55px");
		$(".expiredate input", this.$()).mask("99/99");		
		if(this.get("requiredcard") == true){			
			$("body").addClass("fademodal");
			this.set("accouneEdit", false);
		}else{
			this.set("accouneEdit", true);
		}

		let userId = this.get("authorize").getUserId();
		let cardsRef = new Firebase(config.firebase + "/customers/" + userId + "/sources/data");
		let card = null
		cardsRef.on("value", function(snapshot) {
			if(card){
				return true;
			}
		    let data = snapshot.val();
		    if(data && data.length){
		    	let length = data.length;
		   		let row = data[length-1];
		   		card = row;
		   		let last4 = row.last4;		   		
		   		that.set("cardNumber", "************" + last4);
				that.set("expireDate", "**/**");
				that.set("cvc", "***");
		    }		   
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
	},
	validations: {
  		cardNumber: {
	      presence: true,
	      format: {
	        with: /^\d{16}$/
	      }
	    },
	    expireDate: {
	      presence: true,
	      format: {
	        with: /^[0-1][0-9]\/[0-9]{2}$/
	      }
	    },
	    cvc: {
	      presence: true,
	      format: {
	        with: /^[0-9]{3,4}$/
	      }
	    }
  	}, 

  	actions:{
		onsubmit(){
			let that = this;
		 	let cardNumber = this.get("cardNumber");
			let expireDate =  this.get("expireDate");
			let cvc =  this.get("cvc");
			let date = expireDate.split('/');		
			
			that.set("loadding", true);
			Stripe.setPublishableKey(config.stripePublishableKey);
			Stripe.card.createToken({			      
		      'number':cardNumber,
              'cvc':cvc,
              'exp-month':date[0],
              'exp-year':date[1],
		    }, function(status, response) {
		    	that.set("loadding", false);
			      if (response.error) {
			        that.get("showNotification")(response.error.message, "error"); 
			      } else {			      	
			        var token = response['id'];
			        var cardsRef = new Firebase(config.firebase + "/cards");
					cardsRef.child(that.get("authorize").getUserId()).set({
						card:token
					});
					$("body").removeClass("fademodal");	
					that.get("showNotification")("Your credit card changed successfully", "success");
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
