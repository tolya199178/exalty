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
	        with: /\.[a-zA-Z]{2,4}/,
	        message: 'YouTube link is invaild.'
	      }
	    },
	    chordsUrl: {
	      presence: true,
	      format: {
	        with: /\.[a-zA-Z]{2,4}/,
	        message: 'Chords link is invaild.'
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
