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
	showAlert:false,
	alertText:null,
	showdisalbealertbtn:false,


	trial_end:null,
	card:null,


	init(){
		let that = this;
		this.get("eventService").initObj();
		this.get("eventService").addObserver("eventCalendarData", function(evnets){
			that.set("eventData", that.get("eventService").get("eventCalendarData"));
			that.setAlert(that);
		});
		this.get("eventService").addObserver("musicians", function(){
			that.setAlert(that);			
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
		    	that.set("trial_end", plan.trial_end);		    	

		    	cardsRef.on("value", function(snapshot) {		    		
				    let data = snapshot.val();
				    let row = null
				    if(data && data.length){
				    	row = data[data.length-1];
				    }else{
				    	row = null;
				    }
				    that.set("card", row);
				    that.setAlert(that);

				    if(card){
				    	return true;
				    }
				    let trialEnd = moment(plan.trial_end*1000);
				    card = row;
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
	setAlert(that){
		that.set("showdisalbealertbtn", false);
		let musicians = that.get("eventService").get("musicians");
		if(musicians.length == 0){
			that.set("showAlert", true);
			that.set("alertText", "Congratulations! Planning worship is about to become a lot easier. We're going to help you get started. Begin by adding in a few of your musicians, using the \"Create/Manage Musicians\" option above. Try adding yourself!");
			return true;
		}

		let event = that.get("eventService").get("events");
		if(event.length == 0){
			that.set("showAlert", true);
			that.set("alertText", "Now that you have musicians in the system, try creating an event using the \"Schedule an Evnet\" option above. Try booking yourself playing a song or two, then hit \"Finish\" to send yourself a notification.");
			return true;
		}

		let user = that.get("authorize").getUser();
		if(!user.get("disalbeAlert")){
			that.set("showAlert", true);
			that.set("showdisalbealertbtn", true);
			that.set("alertText", "You've done it! Wasn't that easy? We'll let you take it from here. Add in the other members of your team(s) and start scheduling! Let them know of your new system, and they'll start practicing what you send them.");
			return true;
		}

		
		if(that.get("trial_end") && !that.get("card")){
			let diff = moment().diff(moment(that.get("trial_end")*1000), "days")*(-1);			
			if(diff <= 15 && diff>=0){
				that.set("showAlert", true);
				that.set("alertText", "You have " + diff + " days remaining on your free trial. Add a credit card in \"My Account\" to prevent loss of account access.");
				return true;
			}			
		}

		that.set("showAlert", false);
		that.set("alertText", "");

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
		},
		hideAlert(){
			let user = this.get("authorize").getUser();
			user.set("disalbeAlert", 1);
			user.save();
			this.get("setAlert")(this);
		}
	}
});


$(document).on("keydown", function (event) {	
	if ((event.which === 8 || event.which === 46) && !$(event.target).is("input, textarea")) {
		event.preventDefault();
	}
});