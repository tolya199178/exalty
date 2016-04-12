import Ember from 'ember';

export default Ember.Component.extend({
	store: Ember.inject.service(),
	authorize: Ember.inject.service(),
	eventService: Ember.inject.service(),
	musicians:[],
	deletedMusicians:[],
	loadding:false,
	didInsertElement() {		
	  this._super();
	  $(this.$()).parents(".modal-dialog").attr("style", "width:1000px;max-width:1000px")
	  let that = this;
	  //this.set("musicians", this.get("store").findAll("musician"));
	  that.set("deletedMusicians",[]);
	  let musicians = this.get("store").find("musician",{
	  	orderBy: 'userId',
		equalTo:this.get("authorize").getUserId()
	  }).then(function(data){
	  	let rows = data.toArray();
	  	that.set("musicians", rows);
	  	if(rows.length == 0){

	  	}
	  });
	},
	actions:{
		addMusician(){
			let data = this.get("musicians");
			let row = this.get("store").createRecord("musician",{
				userId:this.get("authorize").getUserId(),
				createdAt:(new Date()).valueOf()
			})
			data.pushObject(row);
		},
		removeMusician(row){
			let data = this.get("musicians");
			this.get("deletedMusicians").pushObject(row);
			data.removeObject(row);
		},
		saveAll(){
			//$("input",this.$()).trigger("blur");
			$("form",this.$()).trigger("submit");
			let that = this;
			this.set("loadding", true);
			Ember.run.later((function() {
			  if($(".has-error",that.$()).length>0){
			  	that.set("loadding", false);
			  }else{
				let deltedRows = that.get("deletedMusicians");
				deltedRows.forEach(function(row){
					row.destroyRecord();
				})
				that.set("deletedMusicians",[]);
				let data = that.get("musicians");
				data.forEach(function(row){
					row.save();
				})
				that.get("showNotification")("Successfully saved", "success");
				that.get("eventService").updateMusicians(data);
				Ember.run.later((function(){
						that.get("modalclose")();
					}),1000)
				
			  }
			}), 1000);			
		},
		closeModal(){
			this.get("modalclose")();
		}
	}
});
