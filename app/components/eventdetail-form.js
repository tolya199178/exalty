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

	openNotificationModal:false,

	musicianItems:[],
	deletedMusicianItems:[],

	loadding:false,
	resolve:null,

	didInsertElement() {
		this._super();
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:800px");	
		this.set("event", this.get("eventwizard").getEvent());

		this.set("serviceItems", this.get("eventwizard").getServiceItems());
		this.set("musicianItems", this.get("eventwizard").getMusicianItems());
		this.set("deletedServiceItems", []);
		this.set("deletedMusicianItems", []);
		$(".serviceitem-rows>div").removeAttr("draggable");
	},
	/**
	 *Setting Notification
	 */
	showNotificationModal(that){
		that.set("openNotificationModal", true);
		return new Ember.RSVP.Promise(function(resolve) {
			that.set("resolve", resolve);
		})
	},

	/**
	 * Save Event
	 */
	saveEvent(that, sentFlag){
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

		/**
		 *Sent Notification
		 */ 
		if(sentFlag == "sent"){
			let emailTitle = "";
			let emailContent = "";
			let textContnet = "";
			let accountEmail = that.get("authorize").getUser().get("email");
			let evnetDate = moment(eventRow.get("date"));
			let evnetStartTime = moment(eventRow.get("date") + ' ' + eventRow.get("startTime"));
			let evnetEndTime = moment(eventRow.get("date") + ' ' + eventRow.get("endTime"));
			/**-----Email Title------**/
			emailTitle = "Worship team notification for " + evnetDate.format("M/D");
			/**-----Email Conent------**/
			emailContent = "Event: " + eventRow.get("title") + ",";
			if(evnetStartTime.isValid()){
				emailContent += " "  + evnetStartTime.format("h:mm A");
			}
			if(evnetEndTime.isValid()){
				emailContent += " - "  + evnetEndTime.format("h:mm A");
			}
			emailContent += "<br/><br/><br/>";
			if(musicianItems.length > 0){
				emailContent += "TEAM:<br/>";
				musicianItems.forEach(function(row){
					emailContent += row.get("name") + " - " + row.get("musicianDesc") + "<br/>";
				});
				emailContent += "<br/><br/>";
			}

			if(serviceItems.length > 0){
				emailContent += "ORDER OF EVENTS:<br/>";
				serviceItems.forEach(function(row){
					if(row.get("itemType") == "service"){
						emailContent += row.get("title") + "<br/>";
					}else if(row.get("itemType") == "song"){
						emailContent += row.get("title");
						if(row.get("youtubeUrl")){
							emailContent += ' <a href="'+row.get("fullYoutubeUrl")+'">Listen</a>';
						}
						if(row.get("chordsUrl")){
							emailContent += ' <a href="'+row.get("fullChordsUrl")+'">Listen</a>';
						}
						emailContent +=  "<br/>";
					}
				});
				emailContent += "<br/><br/>";
			}
			emailContent += "If you have any questions or concerns, please contact your worship leader at " + accountEmail + ".";
			/**-----Text Conent------**/
			textContnet += "Your worship team scheduled you for "+ evnetDate.format("M/D");
			if(evnetStartTime.isValid()){
				textContnet += " @ "  + evnetStartTime.format("h:m A");
			}
			if(evnetEndTime.isValid()){
				textContnet += " - "  + evnetEndTime.format("h:m A");
			}
			textContnet += ".";
			textContnet += "Check your email for details! If this was sent in error, email " + accountEmail + "."
			/* -----Send Notification----- */
			musicianItems.forEach(function(row){
				if(row.sent_text){
					let phoneNumber = row.get("phoneNumber");
					phoneNumber = phoneNumber.replace(/\D/gi, "");
					let textRow = that.get("store").createRecord("notification-text",{
						toEmail:phoneNumber + "@" + row.get("phoneType"),
						phoneNumber:row.get("phoneNumber"),
						phoneType:row.get("phoneType"),
						content:textContnet,
						userId:that.get("authorize").getUserId(),
						createdAt:(new Date()).valueOf()
					});
					textRow.save();
				}
				if(row.sent_email){
					let emailRow = that.get("store").createRecord("notification-email",{
						toEmail:row.get("email"),						
						title:emailTitle,
						content:emailContent,
						userId:that.get("authorize").getUserId(),
						createdAt:(new Date()).valueOf()
					});
					emailRow.save();
				}
			});
		}

		that.get("showNotification")("Successfully saved", "success");
		Ember.run.later((function(){
			that.set("loadding", false);
			that.get("modalclose")();
			that.get("eventService").updateEvent();
		}),1000)
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
					order:10000,
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
					order:10000,
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

		/**
		 * Sort EndAction
		 */
		sortEndAction(){
			let serviceItems = this.get("serviceItems");
			let index = 0;
			serviceItems.forEach(function(row){
				row.set("order", index);
				index++;
			})			
		},

		backdrop(){
		},

		/**
		 *Setting Notification
		 */
		
		sendNotification(){
			this.set("openNotificationModal", false);
			this.get("resolve")("sent");
		},

		notSendNotifcation(){
			this.set("openNotificationModal", false);
			this.get("resolve")("notsent");
		},

		save(){
			$("form",this.$()).trigger("submit");
			let that = this;
			that.set("loadding", true);
			Ember.run.later((function() {
				that.set("loadding", false);
				if($(".has-error",that.$()).length>0){
				  	return true;
				}
				
				let musicianItems = that.get("musicianItems");
				if(musicianItems.length == 0){
					that.set("loadding", true);
					that.get("saveEvent")(that, "notsent");
				}else{
					that.get("showNotificationModal")(that).then(function(sentFlag){
						that.set("loadding", true);
						that.get("saveEvent")(that, sentFlag);
					});					
				}
				
			}), 1000);
		},
		back(){
			let modal = this.get("modal");
			Ember.set(modal, "modalTitle", "Schedule Event");
			Ember.set(modal, "modalTemplete", "event-form");
		},
		closeModal(){
			this.get("modalclose")();
		}

	}
});