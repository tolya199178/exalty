import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {	
	PhoneServices: Ember.A([
							{key:"",value:"Carrier"},
							{key:"Verizon",value:"Verizon"},
							{key:"T-Mobile",value:"T-Mobile"},
							{key:"Virgin-Mobile",value:"Virgin Mobile"},
							{key:"AT&T",value:"AT&T"},
							{key:"Tracfone",value:"Tracfone"}
						]),
	email: null,  	
  	firstName: null,
  	lastName: null,
  	phoneNumber: null,
  	phoneNumberChanged: Ember.observer('phoneNumber', function() {  		
  	   let number  = this.get("phoneNumber");  	   
  	   if(number == "(___)___-____"){
  	   		this.set("phoneNumber", null);
  	   }
	}),
  	phoneType: null,
  	phoneTypeRow:{},
  	phoneTypeRowChanged: Ember.observer('phoneTypeRow', function() {  		
  	   let row  = this.get("phoneTypeRow");  	   
	   this.set("phoneType", row["key"]?row["key"]:null); 
	   if(row.key){
	   		$("select", this.$()).removeClass("placeholder");
	   }else{
			$("select", this.$()).addClass("placeholder");
	   }
	}),
	
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
	    },	    
	    phoneType: {
	    	presence:{
			    'if': function(that, validator) {			    	
			    	let phoneNumber = that.get("phoneNumber");
			    	if(phoneNumber){
			    		return true;
			    	}else{
			    		return false;
			    	}
			    }
			}
	    },
  	},

  	didInsertElement() {
	  this._super();
	  $(".phonenumber input", this.$()).mask("(999)999-9999");
	  let row = this.get("PhoneServices").filterBy('key', this.get("phoneType"));
	  if(row.length == 0){
	  	this.set("phoneTypeRow", {});
	  }else{
	  	this.set("phoneTypeRow", row[0]);
	  }	  
	},
	actions:{
		removeMusician(row){
			this.get("removeMusician")(row);
		}
	}
});