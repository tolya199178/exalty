import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {	    
	    signup(){
			console.log("sign up");
		},
		login(){
			console.log("log in");
		},
		contact(){
			console.log("contact us");
		}
	  }
});