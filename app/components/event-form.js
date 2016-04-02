import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	eventwizard:Ember.inject.service(),
	eventService: Ember.inject.service(),
	event:null,
	title: null,
	date:null,
  	dateAlias: null,
  	dateAliasChanged: Ember.observer('dateAlias', function() {
  	   let date  = this.get("dateAlias");
  	   if(moment(date).format("YYYY-MM-DD")){
  	   		this.set("date", moment(date).format("YYYY-MM-DD")); 	
  	   };
	}),
  	startTime: null,
  	endTime: null,
  	validations: {
  		title: {
	      presence: true,
	    },
	    dateAlias: {
	      presence: true,
	    }
  	},
	didInsertElement() {
		this._super();
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:600px");
		$(".starttime input", this.$()).mask("99:99");
		$(".endTime input", this.$()).mask("99:99");
		let event = this.get("eventwizard").getEvent();
		this.set("event", event);
		this.set("title", event.get("title"));
		this.set("date", event.get("date"));		
		this.set("startTime", event.get("startTime"));
		this.set("endTime", event.get("endTime"));

		let editMode = this.get("eventwizard").getEditMode();
		if(editMode == "update"){
			this.set("showDeleteButton", true);
		}else{
			this.set("showDeleteButton", false);
		}		

		let dateValue = event.get("date");
		if(dateValue){
			this.set("dateAlias", moment(dateValue).toDate());
		}
	},
	actions:{
		next(){
			let event = this.get("event");
			event.set("title", this.get("title"));
			event.set("date", this.get("date"));		
			event.set("startTime", this.get("startTime"));
			event.set("endTime", this.get("endTime"));
			this.get("eventwizard").setEvent(event);
			let modal = this.get("modal");
			Ember.set(modal, "modalTitle", "Schedule Event");
			Ember.set(modal, "modalTemplete", "eventdetail-form");
		},
		deleteEvent(){
			let that = this;
			this.set("deleting", true);
			let serviceItems = this.get("eventwizard").getServiceItems();
			serviceItems.forEach(function(row){
				row.destroyRecord();
			})
			let musicianItems = this.get("eventwizard").getMusicianItems();
			musicianItems.forEach(function(row){
				row.destroyRecord();
			})
			let event = this.get("eventwizard").getEvent();
			event.destroyRecord()
			this.get("showNotification")("Successfully deleted", "success");
			Ember.run.later((function() {
				that.get("eventService").updateEvent();				
				that.get("modalclose")();
			}), 1000)
			
		},
		closeModal(){			
			this.get("modalclose")();
		}
	}
});