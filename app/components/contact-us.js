import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	store: Ember.inject.service(),
	email: null,  	
  	fullname: null,
  	title: null,
  	content: null,
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
	    title: {
	      presence: true,     
	    },
	    content: {
	      presence: true
	    }
  	}, 
  	didInsertElement() {
		this._super();
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:700px")
	},
  	actions:{
  		sentMessage(){
  			this.set("loadding", true);
  			let that = this;
  			let row = that.get('store').createRecord('contact-us', {
			  fullName: that.get("fullname"),
			  email: that.get("email"),
			  title: that.get("title"),
			  content: that.get("content"),			  
			  createdAt:(new Date()).valueOf()
			});
			console.log(row);
			row.save().then(function(){
				console.log(123);
				that.set("loadding", false);
				that.get("showNotification")("Successfully sent your message", "success");
				that.get("modalclose")();
			});
		},
  	}
});
