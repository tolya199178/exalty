import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {	
	PhoneServices: Ember.A([
							{key:"",value:""},
							{key:"Verizon",value:"Verizon"},
							{key:"T-Mobile",value:"T-Mobile"},
							{key:"Virgin-Mobile",value:"Virgin Mobile"},
							{key:"AT&T",value:"AT&T"},
							{key:"Tracfone",value:"Tracfone"},
						]),
	email: null,  	
  	name: null,
  	phoneNumber: null,
  	phoneType: null,
  	phoneTypeRow:{},
  	phoneTypeRowChanged: Ember.observer('phoneTypeRow', function() {
  	   let row  = this.get("phoneTypeRow");
	   this.set("phoneType", row["key"]?row["key"]:null); 
	}),
	
  	validations: {
  		name: {
	      presence: true,	      
	    },  		
	    email: {
	      presence: true,
	      format: {
	        with: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
	        message: 'Invalid email address.'
	      }
	    },
	    phoneNumber: {
	      presence: true,	      
	    }
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