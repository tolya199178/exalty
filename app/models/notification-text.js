import DS from 'ember-data';

export default DS.Model.extend({
  phoneNumber: DS.attr('string'),
  phoneType: DS.attr('string'),
  toEmail:DS.attr('string'),
  content: DS.attr('string'),
  userId: DS.attr('string'),  
  createdAt: DS.attr('number')
});
