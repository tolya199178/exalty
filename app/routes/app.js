import Ember from 'ember';
import config from '../config/environment';


export default Ember.Route.extend({
	authorize: Ember.inject.service(),
	store: Ember.inject.service(),
	beforeModel() {
		let that = this;
		let ref = new Firebase(config.firebase);
		let authData = ref.getAuth();
		if(!authData){
			 this.transitionTo('landing');
		}
		$("body").removeClass("landing").addClass("adminpanel");
		that.get("authorize").setUserId(authData.uid);
		console.log(authData.uid);
		this.get("store").query("user",{
			orderBy: 'userId',
			equalTo:authData.uid
		}).then(function(res){
			let users = res.toArray();
			if(users.length > 0){
				let user =  users[0];
				that.get("authorize").setUser(user);
				console.log(user.get("email"));
			}			
		})
	},
	model: function() {
		return {
			events: Ember.A([{
				title: "Hackathon", start: Date.now()
			}])
		};
	}
});
