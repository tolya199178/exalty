import Ember from 'ember';
import config from '../config/environment';


export default Ember.Controller.extend({
	applicationController: Ember.inject.controller('application'),
	eventwizard:Ember.inject.service(),
	routing: Ember.inject.service(),
	eventService: Ember.inject.service(),
	authorize:Ember.inject.service(),
	eventData:[],
	loading:false,

	crediticardModalView:false,

	init(){
		let that = this;
		this.get("eventService").initObj();
		this.get("eventService").addObserver("eventCalendarData", function(evnets){
			that.set("eventData", that.get("eventService").get("eventCalendarData"));
		});

		/**
		 * Check Payment
		 */
		let userId = this.get("authorize").getUserId();
		let planRef = new Firebase(config.firebase + "/customers/" + userId + "/subscriptions/data");
		let cardsRef = new Firebase(config.firebase + "/customers/" + userId + "/sources/data");
		let plan = null;
		let card = null;
		planRef.on("value", function(snapshot) {
			if(plan){
				return true;
			}
		    let data = snapshot.val();
		    if(data && data.length){
		    	plan = data[data.length-1];
		    	cardsRef.on("value", function(snapshot) {
		    		if(card){
		    			return true;
		    		}
				    let data = snapshot.val();
				    if(data && data.length){
				    	card = data[data.length-1];
				    }else{

				    }
				    let trialEnd = moment(plan.current_period_end*1000);

				    that.get("requirePayment")(that);

				    if(moment().diff(trialEnd) > 0){
				    	/*ended trial period*/
				    	if(!card 
				    		|| (card.exp_year < moment().format("Y")) 
				    		|| (card.exp_year == moment().format("Y") && card.exp_month < moment().format("M"))){
				    		that.get("requirePayment")(that);
				    	}
				    }
				    /**
				     * Check Period
				     */

				}, function (errorObject) {
				  console.log("The read failed: " + errorObject.code);
				});
		    }else{
		    	let user = this.get("authorize").getUser();
		    	user.set("addedSubscription", false);
		    	user.save();
		    }
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		});
	},
	requirePayment(that){
		that.set("crediticardModalView", true);
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
			this.get("eventwizard").initObj();
			let event = this.get("eventwizard").get("event");
			event.set("date", moment(clickedDate).tz("Europe/London").format("YYYY-MM-DD"));
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
		},
		showNotification(message, type){
			this.get("applicationController").send("showNotification" ,message, type);
		},
		creditiCardModalClose(){
			this.set("crediticardModalView", false);
		}
	}
});