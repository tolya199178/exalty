import Ember from 'ember';

export default Ember.Service.extend({
	event:null,
	serviceItems:Ember.A([]),
	musicians:[],
	musicianUsers:[],
	store: Ember.inject.service(),
	authorize: Ember.inject.service(),
	initObj(){
		this.set("event", null);
		this.set("serviceItems", Ember.A([]));
		this.set("musicians", Ember.A([]));
		let event = this.get("store").createRecord("event",{
				userId:this.get("authorize").getUserId(),
				createdAt:(new Date()).valueOf()
			})
		this.set("event", event);
		this.setMusicianUsers();
	},
	getEvent(){
		return this.get("event");
	},
	setEvent(event){
		this.set("event", event);
	},
	getServiceItems(){
		return this.get("serviceItems");	
	},
	getMusicianItems(){
		return this.get("musicians");
	},
	setMusicianUsers(){
		let that = this;
		that.set("musicianUsers", [{id:"", name:"Select Musician"}]);
		this.get("store").find("musician",{
	  		orderBy: 'userId',
			equalTo:this.get("authorize").getUserId()
	  	}).then(function(data){
	  		let rows = data.toArray();
	  		that.get("musicianUsers").pushObjects(rows);
	  	});
	},
	getMusicianUsers(){
		return this.get("musicianUsers");
	}
});
