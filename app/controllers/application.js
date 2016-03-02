import Ember from 'ember';

export default Ember.Controller.extend({  
  viewModal: false,
  modal:{},
  actions: {
    showModal: function(modalTitle, modalName) {
      let modal = {
        modalTitle: modalTitle,
        modalTemplete: modalName?modalName:""
      };
      this.set("modal", modal);
      this.set("viewModal", true);
    },
    removeModal: function() {
      console.log("modalclose")
      this.set("viewModal", false);    
      let modal = {
        modalTitle: "",
        modalTemplete: "",
      };
      this.set("modal", modal);
    },
    showNotification: function(message, type){      
      this.notifications.addNotification({
        message: message,
        type: type?type:'success',
        autoClear: true,
        clearDuration: 3000
      });
    }
  }
});