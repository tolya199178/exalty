import Ember from 'ember';

export default Ember.Service.extend({
	user:{},
	userId:null,
	getUser(){
		return this.get("user");
	},
	setUser(user){
		this.set("user", user)
		return true;
	},
	getUserId(){
		return this.get("userId");
	},
	setUserId(id){
		this.set("userId", id);
	}
});