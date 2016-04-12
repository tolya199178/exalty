import Ember from 'ember';

export default Ember.Component.extend({
	musicianItems:[],	
	disableSendButton:false,
	didInsertElement() {
		this._super();
		$(this.$()).parents(".modal-dialog").attr("style", "max-width:580px;margin-top: 55px;");		
	},
	actions:{
		clickCheckbox(){
			let that = this;
			this.set("disableSendButton", true);
			let musicianItems = this.get("musicianItems");
			musicianItems.forEach(function(row){
				if(row.get("sent_text") == true || row.get("sent_email") == true){
					that.set("disableSendButton", false);
				}
			});
		},
		save(){
		
		},
		notsendaction(){			
			this.get("notsend1")();
		},
		sendaction(){			
			this.get("send1")();
		}
	}
});
