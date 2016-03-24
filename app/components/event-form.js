import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	eventwizard:Ember.inject.service(),
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
		let dateValue = event.get("date");
		console.log("123");
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
			Ember.set(modal, "modalTitle", "Event Details");
			Ember.set(modal, "modalTemplete", "eventdetail-form");
		},
		closeModal(){
			console.log(this.get("router.router"));
			this.get("modalclose")();
		}
	}
});