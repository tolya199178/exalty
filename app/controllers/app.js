import Ember from 'ember';
import config from '../config/environment';


export default Ember.Controller.extend({
	applicationController: Ember.inject.controller('application'),
	eventwizard:Ember.inject.service(),
	routing: Ember.inject.service(),
	eventService: Ember.inject.service(),
	eventData:[],
	loading:false,
	init(){
		let that = this;
		this.get("eventService").initObj();
		this.get("eventService").addObserver("eventCalendarData", function(evnets){
			that.set("eventData", that.get("eventService").get("eventCalendarData"));
		});
	},
	actions: {
		clicked(event, jsEvent, view){
			let that = this;
			let eId = event.eId;
			this.set("loading", true);
			this.get("eventwizard").initObj(eId).then(function(){
				that.set("loading", false);
				that.get("applicationController").send("showModal", "Schedule Event", "event-form", false);
			});
		},
		dayClicked(date, jsEvent, view){
			let clickedDate = date._d;
			console.log(clickedDate);
			this.get("eventwizard").initObj();
			let event = this.get("eventwizard").get("event");
			event.set("date", moment(clickedDate).format("YYYY-MM-DD"));
			this.get("eventwizard").setEvent(event);
			this.get("applicationController").send("showModal", "Schedule Event", "event-form", false);
			
		},
		createEvent(){
			this.get("eventwizard").initObj();
			this.get("applicationController").send("showModal", "Schedule Event", "event-form", false);
		},
		manageMusicians(){
			this.get("applicationController").send("showModal", "Musicians", "musician-form", false);
		},
		myAccount(){
			this.get("applicationController").send("showModal", "My Account", "myaccount-form");
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