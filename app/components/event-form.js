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
  	durationValidtion:"inValid",
  	validations: {
  		title: {
	      presence: true,
	    },
	    dateAlias: {
	      presence: true,
	    },
		startHour: {
	    	presence:{
			    'if': function(that, validator) {
			    	/**
			    	 * check valid duration
			    	 */
			    	let startHour = that.get("startHour");
			    	let startMinute = that.get("startMinute");
			    	let startHalf = that.get("start_half");
			    	let endHour = that.get("endHour");
			    	let endMinute = that.get("endMinute");
			    	let endHalf = that.get("end_half");
			    	let date = moment().format("YYYY-M-D");
		    		let startTimeString = date + " " + startHour + ":" + startMinute + " " + startHalf;
		    		if(moment(startTimeString).isValid()){
		    			that.set("startTime", moment(startTimeString).format("HH:mm"));
		    		}else{
		    			that.set("startTime", null);
		    		}
		    		let endTimeString = date + " " + endHour + ":" + endMinute + " " + endHalf;
		    		if(moment(endTimeString).isValid()){
		    			that.set("endTime", moment(endTimeString).format("HH:mm"));
		    		}else{
		    			that.set("endTime", null);
		    		}
			    	if(startHour && endHour){
			    		let diff = moment(startTimeString).diff(endTimeString);			    		
			    		if(isNaN(diff) == false && diff>=0){
			    			that.set("durationValidtion", "inValid");
			    		}else{
			    			that.set("durationValidtion", "ok");

			    		}
			    	}else{
			    		that.set("durationValidtion", "ok");
			    	}		    	
			    	/*----end---*/			    	
			    	
			    	if(startMinute){
			    		return true;
			    	}else{
			    		return false;
			    	}
			    }
			}
	    },
	    startMinute: {
	    	presence:{
			    'if': function(that, validator) {			    	
			    	let startHour = that.get("startHour");
			    	if(startHour){
			    		return true;
			    	}else{
			    		return false;
			    	}
			    }
			}
	    },
	    endHour: {
	    	presence:{
			    'if': function(that, validator) {			    	
			    	let endMinute = that.get("endMinute");
			    	if(endMinute){
			    		return true;
			    	}else{
			    		return false;
			    	}
			    }
			}
	    },
	    endMinute: {
	    	presence:{
			    'if': function(that, validator) {			    				    	
			    	let endHour = that.get("endHour");
			    	if(endHour){
			    		return true;
			    	}else{
			    		return false;
			    	}
			    }
			}
	    },
	    durationValidtion:{
	    	format: { with: /^ok$/, allowBlank: false, message: 'End Time must be after Start Time' }
	    }
  	},  	
  	/**
  	 * Duration Selector
  	 */
	hours: Ember.A([
					{key:"",value:"Hour"},
					{key:"1",value:"1"},
					{key:"2",value:"2"},
					{key:"3",value:"3"},
					{key:"4",value:"4"},
					{key:"5",value:"5"},
					{key:"6",value:"6"},
					{key:"7",value:"7"},
					{key:"8",value:"8"},
					{key:"9",value:"9"},
					{key:"10",value:"10"},
					{key:"11",value:"11"},
					{key:"12",value:"12"},					
				]),
	minutes: Ember.A([
					{key:"",value:"Minute"},
					{key:"00",value:"00"},
					{key:"15",value:"15"},
					{key:"30",value:"30"},
					{key:"45",value:"45"},
				]),
	startHour:null,
	startHourRow:{},
	startHourRowChanged: Ember.observer('startHourRow', function() {
  	   let row = this.get("startHourRow");
  	   this.set("startHour", row.key);
  	   if(row.key){
	   		$(".starthour select", this.$()).removeClass("placeholder");
	   }else{
			$(".starthour select", this.$()).addClass("placeholder");
	   }
	   let minute = this.get("startMinute");
	   if(minute == null){
	   		let minuteRows = this.get("minutes");
			this.set("startMinuteRow", minuteRows[1]);
	   }
	}),
	startMinute:null,
	startMinuteRow:{},
	startMinuteRowChanged: Ember.observer('startMinuteRow', function() {
  	   let row = this.get("startMinuteRow");  	   
  	   this.set("startMinute", row.key);
  	   if(row.key){
	   		$(".startminute select", this.$()).removeClass("placeholder");
	   }else{
			$(".startminute select", this.$()).addClass("placeholder");
	   }
	}),	
	
	endHour:null,
	endHourRow:{},
	endHourRowChanged: Ember.observer('endHourRow', function() {
  	   let row = this.get("endHourRow");  	   
  	   this.set("endHour", row.key);
  	   if(row.key){
	   		$(".endhour select", this.$()).removeClass("placeholder");
	   }else{
			$(".endhour select", this.$()).addClass("placeholder");
	   }
	   let minute = this.get("endMinute");
	   if(minute == null){
	   		let minuteRows = this.get("minutes");
			this.set("endMinuteRow", minuteRows[1]);
	   }
	}),
	endMinute:null,
	endMinuteRow:{},
	endMinuteRowChanged: Ember.observer('endMinuteRow', function() {
  	   let row = this.get("endMinuteRow");  	   
  	   this.set("endMinute", row.key);
  	   if(row.key){
	   		$(".endminute select", this.$()).removeClass("placeholder");
	   }else{
			$(".endminute select", this.$()).addClass("placeholder");
	   }
	}),
	

	didInsertElement() {
		this._super();
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:600px");
		
		/**
		 * initalze value
		 */
		let event = this.get("eventwizard").getEvent();
		this.set("event", event);
		this.set("title", event.get("title"));
		this.set("date", event.get("date"));

		/**
		 * Initailize Value of time selector
		 */
		let date = moment().format("YYYY-M-D");
		let hoursOptions = this.get("hours");
		let minuteOptions = this.get("minutes");

		let startTime = event.get("startTime");		
		let StMoment = moment(date + " " + startTime);
		if(StMoment.isValid()){
			this.set("startTime", startTime);
			this.set("start_half",StMoment.format("A"));
			let hour = StMoment.format("h");
			
			this.set("startHourRow", hoursOptions[hour]);
			let minute = StMoment.format("mm");
			let row = minuteOptions.filterBy('key', minute);
			if(row.length == 0){
				this.set("startMinuteRow", minuteOptions[1]);
			}else{
			 	this.set("startMinuteRow", row[0]);
			}
		}else{
			this.set("startTime", null);
			this.set("startHourRow", {});
			this.set("startMinuteRow", {});
			this.set("start_half","AM");
		}

		let endTime = event.get("endTime");		
		let EtMoment = moment(date + " " + endTime);
		if(EtMoment.isValid()){
			this.set("endTime", endTime);
			this.set("end_half",EtMoment.format("A"));
			let hour = EtMoment.format("h");						
			this.set("endHourRow", hoursOptions[hour]);
			let minute = EtMoment.format("mm");
			let row = minuteOptions.filterBy('key', minute);			
			if(row.length == 0){
				this.set("endMinuteRow", minuteOptions[1]);
			}else{
			 	this.set("endMinuteRow", row[0]);
			}
		}else{
			this.set("endTime", null);
			this.set("endHourRow", {});
			this.set("endMinuteRow", {});
			this.set("end_half","AM");
		}
		/**-------end---------*/
	

		/**
		 * show/hide delete button
		 */
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