import Ember from 'ember';
import EmberValidations from 'ember-validations';

export default Ember.Component.extend(EmberValidations, {		
	title:null,
	youtubeUrl:null,
	chordsUrl:null,
	validations: {
	    title: {
	      presence: true,	  
	    },
	    youtubeUrl: {
	      presence: true,
	      format: {
	        with: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/,
	        message: 'YouTube link in invaild.'
	      }
	    },
	    chordsUrl: {
	      presence: true,
	      format: {
	        with: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/,
	        message: 'Chords Link in invaild.'
	      }
	    }
  	},
	didInsertElement() {
		this._super();
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:500px;margin-top: 55px;");
		let songRow = this.get("song");
		this.set("title", songRow.get("title"));
		this.set("youtubeUrl", songRow.get("youtubeUrl"));
		this.set("chordsUrl", songRow.get("chordsUrl"));
	},
	actions:{
		save(){
			let songRow = this.get("song");
			songRow.set("title", this.get("title"));
			songRow.set("youtubeUrl", this.get("youtubeUrl"));
			songRow.set("chordsUrl", this.get("chordsUrl"));
			console.log(songRow);
			if(this.get("mode") == "create"){
				this.get("addsong")(songRow);
			}else if(this.get("mode") == "edit"){
				this.get("modalclose")();
			}
		},
		closeModal(){
			this.get("modalclose")();
		}
	}
});
