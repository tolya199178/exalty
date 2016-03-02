import DS from 'ember-data';

export default DS.Model.extend({
  fullName: DS.attr('string'),
  email: DS.attr('string'),
  title: DS.attr('string'),
  content: DS.attr('string'),
  createdAt: DS.attr('number')
});
