import Ember from 'ember';

export default Ember.Component.extend({		
	musician:null,
	musicianTextChanged:Ember.observer('musician.sent_text', function() {	   
  	   this.get("clickCheckbox")();  	   
	}),
	musicianEmailChanged:Ember.observer('musician.sent_email', function() {
  	   this.get("clickCheckbox")();
	}),
	eventwizard: Ember.inject.service(),	
	musicianUsers:[],

	enableText:true,
	enableEmail:true,


	didInsertElement() {
	  this._super();
	  let musicianUsers = this.get("eventwizard").getMusicianUsers();
	  this.set("musicianUsers", musicianUsers);
	  let rows = musicianUsers.filterBy('id', this.get("musicianId"));
	  let row = null
	  if(rows.length == 0){
	  	row = {};
	  }else{
	  	row = rows[0];	
	  }
	  this.set("activedmusicianRow", row);	  
	  let musician = this.get("musician");
	  musician.set("name", row.get("name"));
	  if(row.get("email")){
	  	musician.set("email", row.get("email"));
	  	this.set("enableEmail", true);
	  	musician.set("sent_email", true);
	  }else{
		this.set("enableEmail", false);
	  }
	  if(row.get("phoneNumber")){
	  	musician.set("phoneNumber", row.get("phoneNumber"));
	  	musician.set("phoneType", row.get("phoneType"));
	  	this.set("enableText", true);
	  	musician.set("sent_text", true);	  	
	  }else{
		this.set("enableText", false);
	  }
	},
});
