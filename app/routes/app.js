import Ember from 'ember';
import config from '../config/environment';


export default Ember.Route.extend({
	authorize: Ember.inject.service(),
	store: Ember.inject.service(),
	events: Ember.inject.service(),
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
		});
	},
	model: function() {
		return {};
		let that = this;
		return new Ember.RSVP.Promise(function(resolve) {
			that.get("store").query("event",{
				orderBy: 'userId',
				equalTo:that.get("authorize").getUserId()
			}).then(function(res){
				let events = res.toArray();
				let data = Ember.A([]);
				events.forEach(function(row){					
					let time = null;
					if(row.get("date")){
						if(row.get("startTime")){
							time = moment((row.get("date") + ' ' + row.get("startTime"))).toDate();
						}else{
							time = moment(row.get("date")).toDate();
						}
					}
					data.pushObject({eId:row.get("id"), title: row.get("title"), start:time});
				});
				resolve({events:data});
			});
		});
	}
});
