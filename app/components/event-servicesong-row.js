import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {
	title:null,	
	validations: {
  		title: {
	      presence: true,
	    }
  	},
  	serviceItem:null,
  	youtubeChanged: Ember.observer('serviceItem.youtubeUrl', function() {
  	   this.get("syncurl")(this);
	}),
	chordsChanged: Ember.observer('serviceItem.chordsUrl', function() {
  	   this.get("syncurl")(this);
	}),
	didInsertElement(){
		this._super();
		this.get("syncurl")(this);
	},
	syncurl(that){
		let serviceItem = that.get("serviceItem");
		let youtubeUrl = serviceItem.get("youtubeUrl");
		let chordsUrl = serviceItem.get("chordsUrl");
		if(/^(http|https|ftp)\:\/\//.test(youtubeUrl) == true){
			serviceItem.set("fullYoutubeUrl", youtubeUrl);
		}else{
			serviceItem.set("fullYoutubeUrl", "http://" + youtubeUrl);
		}
		if(/^(http|https|ftp)\:\/\//.test(chordsUrl) == true){
			serviceItem.set("fullChordsUrl", chordsUrl);
		}else{
			serviceItem.set("fullChordsUrl", "http://" + chordsUrl);
		}
	},
	actions:{
		editSong(row){
			this.get("editSong")(row);
		},
		removeServiceItem(row){
			this.get("removeServiceItem")(row);
		}
	}
});
