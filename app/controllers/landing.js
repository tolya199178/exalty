import Ember from 'ember';

export default Ember.Controller.extend({
	applicationController: Ember.inject.controller('application'),
	actions: {
	    signup(){
	    	this.get("applicationController").send("showModal", "Sign up", "signup-form");
		},
		createEvent(){

		},
		manageMusicians(){

		},
		myAccount(){

		},
		login(){
			this.get("applicationController").send("showModal", "Log in", "login-form");
		},
		contact(){
			this.get("applicationController").send("showModal", "Contact Us", "contact-us");
		}
	  }
});