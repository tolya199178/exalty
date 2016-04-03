import Ember from 'ember';

export default Ember.Service.extend({
	event:null,
	serviceItems:Ember.A([]),
	musicians:[],
	musicianUsers:[],
	editMode:"create",
	store: Ember.inject.service(),
	authorize: Ember.inject.service(),
	initObj(eId){
		let that = this;
		this.set("event", null);
		this.set("serviceItems", Ember.A([]));
		this.set("musicians", Ember.A([]));		
		this.setMusicianUsers();
		if(!eId){
			this.set("editMode", "create");
			/* create mode*/
			let event = this.get("store").createRecord("event",{
				userId:this.get("authorize").getUserId(),
				createdAt:(new Date()).valueOf()
			})
			this.set("event", event);
		}else{
			this.set("editMode", "update");
			return new Ember.RSVP.Promise(function(resolve) {

				//getEvent
				that.get("store").find("event",{
					equalTo:eId 
				}).then(function(res){
					var data = res.toArray();
					if(data.length > 0){
						that.set("event", data[0]);
					}else{
						let event = that.get("store").createRecord("event",{
							userId:that.get("authorize").getUserId(),
							createdAt:(new Date()).valueOf()
						})
						that.set("event", event);
					}
						//getServiceItem
						that.get("store").find("event-service",{
							orderBy: 'eventId',
							equalTo:eId 
						}).then(function(res){
							let  serviceItems = res.toArray().sortBy("order");
							that.set("serviceItems", serviceItems);

							//getMusician
							that.get("store").find("event-musician",{
								orderBy: 'eventId',
								equalTo:eId 
							}).then(function(res){
								let  musicians = res.toArray();
								that.set("musicians", musicians);
								//getServiceItem								
								resolve(true);
							})	
						})					
				})
			})
		}
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
	  		rows.forEach(function(row){
	  			row.name = row.get("firstName") + " " + row.get("lastName");
	  		})
	  		that.get("musicianUsers").pushObjects(rows);
	  	});
	},
	getMusicianUsers(){
		return this.get("musicianUsers");
	},
	getEditMode(){
		return this.get("editMode");	
	}
});
