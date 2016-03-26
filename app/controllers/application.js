import Ember from 'ember';

export default Ember.Controller.extend({  
  viewModal: false,
  handback:true,
  modal:{},
  actions: {
    showModal: function(modalTitle, modalName, handback) {      
      if(typeof handback == "undefined"){
        handback = true;
      }
      this.set('handback', handback);
      let that = this;
      let modal ={}
      that.set("modal", modal);
      this.set("viewModal", false);

      Ember.run.later((function(){
            modal = {
              modalTitle: modalTitle,
              modalTemplete: modalName?modalName:""
            };
            that.set("modal", modal);
            that.set("viewModal", true);
      }),100)      
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

define('ember-validations/messages', ['exports', 'ember'], function (exports, _ember) {
  'use strict';
  exports['default'] = {
    render: function render(attribute, context) {
      if (_ember['default'].I18n) {
        return _ember['default'].I18n.t('errors.' + attribute, context);
      } else {
        var regex = new RegExp("{{(.*?)}}"),
            attributeName = "";
        if (regex.test(this.defaults[attribute])) {
          attributeName = regex.exec(this.defaults[attribute])[1];
        }
        return this.defaults[attribute].replace(regex, context[attributeName]);
      }
    },
    defaults: {
      inclusion: "is not included in the list",
      exclusion: "is reserved",
      invalid: "is invalid",
      confirmation: "doesn't match {{attribute}}",
      accepted: "Must be accepted",
      empty: "Can't be empty",
      blank: "Can't be blank",
      present: "Must be blank",
      tooLong: "is too long (maximum is {{count}} characters)",
      tooShort: "is too short (minimum is {{count}} characters)",
      wrongLength: "is the wrong length (should be {{count}} characters)",
      notANumber: "is not a number",
      notAnInteger: "Must be an integer",
      greaterThan: "Must be greater than {{count}}",
      greaterThanOrEqualTo: "Must be greater than or equal to {{count}}",
      equalTo: "Must be equal to {{count}}",
      lessThan: "Must be less than {{count}}",
      lessThanOrEqualTo: "Must be less than or equal to {{count}}",
      otherThan: "Must be other than {{count}}",
      odd: "Must be odd",
      even: "Must be even",
      url: "is not a valid URL"
    }
  };
});