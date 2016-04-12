import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {	
	PhoneServices: Ember.A([
							{key:"",value:"Carrier"},
							{key:"vtext.com",value:"Verizon"},
							{key:"tmomail.net",value:"T-Mobile"},
							{key:"vmobl.com",value:"Virgin Mobile"},
							{key:"txt.att.net",value:"AT&T"},
							{key:"mmst5.tracfone.com",value:"Tracfone"},
							{key:"number@tmomail.net",value:"T-Mobile"},
							{key:"messaging.sprintpcs.com",value:"Sprint"},
							{key:"mymetropcs.com",value:"Metro PCS"},
							{key:"myboostmobile.com",value:"Boost Mobile"},
							{key:"sms.mycricket.com",value:"Cricket"},
							{key:"messaging.nextel.com",value:"Nextel"},
							{key:"number@message.alltel.com",value:"Alltel"},
							{key:"ptel.com",value:"Ptel"},
							{key:"tms.suncom.com",value:"Suncom"},
							{key:"qwestmp.com",value:"Qwest"},
							{key:"email.uscc.net",value:"U.S. Cellular"}
						]),
	email: null,  	
  	firstName: null,
  	lastName: null,
  	phoneNumber: null,
  	/*phoneNumberChanged: Ember.observer('phoneNumber', function() {  		
  	   let number  = this.get("phoneNumber");  	   
  	   if(number == "(___)___-____"){
  	   		this.set("phoneNumber", null);
  	   }
	}),*/
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
	      format: {
	      	allowBlank: true,
	        with: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
	        message: 'Invalid email address.'
	      }
	    },	    
	    phoneType: {
	    	presence:{
			    'if': function(that, validator) {
			    	let number  = that.get("phoneNumber");  	   
					if(number == "(___)___-____"){
				  		that.set("phoneNumber", null);
				  	}			    	
			    	let phoneNumber = that.get("phoneNumber");
			    	if(phoneNumber && phoneNumber){
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