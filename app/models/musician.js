import DS from 'ember-data';

export default DS.Model.extend({
  userId: DS.attr('string'),
  name: DS.attr('string'),
  phoneNumber: DS.attr('string'),
  email: DS.attr('string'),
  phoneType: DS.attr('string'),
  createdAt: DS.attr('number')
});