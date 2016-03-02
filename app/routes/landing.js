import Ember from 'ember';
import config from '../config/environment';
import LoadingSliderMixin from '../mixins/loading-slider';

export default Ember.Route.extend(LoadingSliderMixin, {
	beforeModel() {
		let ref = new Firebase(config.firebase);
		let authData = ref.getAuth();
		if(authData){
			 this.transitionTo('app');
		}
		$("body").removeClass("adminpanel").addClass("landing")
	},
	actions:{
		showNotification: function(message, type){
	      
	    }
	}
});