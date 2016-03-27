import Ember from 'ember';

export default Ember.Component.extend({
	store:Ember.inject.service(),
	eventwizard:Ember.inject.service(),
	authorize:Ember.inject.service(),
	eventService: Ember.inject.service(),
	event:null,

	serviceItems:Ember.A([]),
	deletedServiceItems:[],
	openSongEditModal:false,
	activedSong:null,
	songEditMode:null,
	sondmodalTitle:null,

	musicianItems:[],
	deletedMusicianItems:[],

	loadding:false,
	didInsertElement() {
		this._super();
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:800px");	
		this.set("event", this.get("eventwizard").getEvent());

		this.set("serviceItems", this.get("eventwizard").getServiceItems());
		this.set("musicianItems", this.get("eventwizard").getMusicianItems());
		this.set("deletedServiceItems", []);
		this.set("deletedMusicianItems", []);
	},
	actions:{
		/**
		 * Servcie Item
		 */
		addService(){
			let row = this.get("store").createRecord("event-service",{
					eventId:this.get("event").get("id"),
					itemType:"service",
					userId:this.get("authorize").getUserId(),
					createdAt:(new Date()).valueOf()
				})
			let data = this.get("serviceItems")
			data.pushObject(row);
		},
		removeServiceItem(row){
			let data = this.get("serviceItems");
			this.get("deletedServiceItems").pushObject(row);
			data.removeObject(row);
		},
		addSong(){			
			let row = this.get("store").createRecord("event-service",{
					eventId:this.get("event").get("id"),
					itemType:"song",
					userId:this.get("authorize").getUserId(),
					createdAt:(new Date()).valueOf()
				})
			this.set("activedSong", row);
			this.set("sondmodalTitle", "Add Song");
			this.set("songEditMode", "create");
			this.set("openSongEditModal", true);
		},
		addSongItem(songRow){
			let data = this.get("serviceItems")
			data.pushObject(songRow);
			this.set("songEditMode", "");			
			this.set("openSongEditModal", false);
		},
		closeSongModal(){
			this.set("openSongEditModal", false);
		},
		editSong(songRow){
			let row = songRow;			
			this.set("activedSong", row);
			this.set("sondmodalTitle", "Edit Song");
			this.set("songEditMode", "edit");
			this.set("openSongEditModal", true);
		},

		/**
		 * Add Muscian
		 */
		addMusician(){
			let row = this.get("store").createRecord("event-musician",{
					eventId:this.get("event").get("id"),
					userId:this.get("authorize").getUserId(),
					createdAt:(new Date()).valueOf()
				})
			let data = this.get("musicianItems")
			data.pushObject(row);
		},
		removeMusician(row){
			let data = this.get("musicianItems");
			this.get("deletedMusicianItems").pushObject(row);
			data.removeObject(row);
		},

		backdrop(){
		},

		save(){

			$("form",this.$()).trigger("submit");
			let that = this;
			this.set("loadding", true);
			Ember.run.later((function() {				
			  if($(".has-error",that.$()).length>0){
			  	that.set("loadding", false);
			  }else{
			  	/* Save Event */
			  	let eventRow = that.get("event");
			  	eventRow.save();

			  	/*ServcieItem */
				let deltedServiceItemRows = that.get("deletedServiceItems");
				deltedServiceItemRows.forEach(function(row){
					row.destroyRecord();
				})
				that.set("deletedServiceItems",[]);				


				let serviceItems = that.get("serviceItems");
				serviceItems.forEach(function(row){
					row.save();
				})

				/*Musician Item */
				let deltedMusicianItemRows = that.get("deletedMusicianItems");
				deltedMusicianItemRows.forEach(function(row){
					row.destroyRecord();
				})
				that.set("deletedMusicianItems",[]);				


				let musicianItems = that.get("musicianItems");
				musicianItems.forEach(function(row){
					row.save();
				})



				that.get("showNotification")("Successfully saved", "success");
				Ember.run.later((function(){
						that.set("loadding", false);
						that.get("modalclose")();
						that.get("eventService").updateEvent();
					}),1000)
				
			  }
			}), 1000);	
		},

		closeModal(){
			this.get("modalclose")();
		}

	}
});