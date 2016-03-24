import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	cardNumber:null,
  	expireDate:null,
  	cvc:null,
  	didInsertElement() {
		this._super();		
		$(".expiredate input", this.$()).mask("99/99");		
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
});
