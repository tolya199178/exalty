import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service(),
	authorize: Ember.inject.service(),
	events:[],
	eventsChanged: Ember.observer('events', function() {		
	    let events = this.get("events");
	    let data = Ember.A([]);
		events.forEach(function(row){					
			let time = null;
			if(row.get("date")){
				if(row.get("startTime")){
					time = moment((row.get("date") + ' ' + row.get("startTime"))).toDate();
				}else{
					time = moment(row.get("date")).toDate();
				}
			}
			data.pushObject({eId:row.get("id"), title: row.get("title"), start:time});
		});
		this.set("eventCalendarData", data)
	}),
	eventCalendarData:[],
	initObj(){
		this.set("events", []);
		this.set("eventCalendarData", []);
		this.updateEvent();

		this.set("musicians", []);		
		this.updateMusicians();
	},
	updateEvent(){
		let that= this;
		this.get("store").query("event",{
				orderBy: 'userId',
				equalTo:that.get("authorize").getUserId()
			}).then(function(res){
				let events = res.toArray();
				that.set("events", events);
			});
	},
	updateMusicians(rows){		
		let that= this;
		if(rows){
			that.set("musicians", rows);
		}else{
			this.get("store").query("musician",{
					orderBy: 'userId',
					equalTo:that.get("authorize").getUserId()
				}).then(function(res){
					let musicians = res.toArray();				
					that.set("musicians", musicians);
				});
		}		
	}
});
