import Ember from 'ember';
import config from '../config/environment';


export default Ember.Controller.extend({
	applicationController: Ember.inject.controller('application'),
	eventwizard:Ember.inject.service(),
	routing: Ember.inject.service(),
	actions: {
		clicked(event, jsEvent, view){
			console.log(`${event.title} was clicked!`)
			// Prints: Hackathon was clicked! 
		},
		createEvent(){
			this.get("eventwizard").initObj();
			this.get("applicationController").send("showModal", "Create Event", "event-form");
		},
		manageMusicians(){
			this.get("applicationController").send("showModal", "Manage musicians", "musician-form");
		},
		myAccount(){

		},
		contactus(){
			this.get("applicationController").send("showModal", "Contact Us", "contact-us");
		},
		logout(){
			let ref = new Firebase(config.firebase);
  			ref.unauth();
			this.get("routing").transitionTo('landing');
		}
	}
});
