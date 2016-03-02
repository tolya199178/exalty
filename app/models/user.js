import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  fullName: DS.attr('string'),
  userId: DS.attr('string'),
  createdAt: DS.attr('number')
});
