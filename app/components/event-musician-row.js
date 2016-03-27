import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	store: Ember.inject.service(),
	authorize: Ember.inject.service(),
	eventwizard: Ember.inject.service(),
	musicianUsers:[],
	activedmusicianRow:{},
	musicianId:null,
	musicianDesc: null,
	validations: {
  		musicianId: {
	      presence: true,
	    },
	    musicianDesc: {
	      presence: true,
	    }
  	},

	activedmusicianRowChanged: Ember.observer('activedmusicianRow', function() {
  	   let newId  = this.get("activedmusicianRow").id;
  	   if(newId){
  	   		this.set("musicianId", newId);
  	   }else{
  	   		this.set("musicianId", null);
  	   }
	}),
	didInsertElement() {
	  this._super();
	  let musicianUsers = this.get("eventwizard").getMusicianUsers();
	  this.set("musicianUsers", musicianUsers);
	  let row = musicianUsers.filterBy('id', this.get("musicianId"));
	  if(row.length == 0){
	  	this.set("activedmusicianRow", {});
	  }else{
	  	this.set("activedmusicianRow", row[0]);
	  }	  
	},
	actions:{
		removeItem(row){
			this.get("removeMusician")(row);
		}
	}
});
