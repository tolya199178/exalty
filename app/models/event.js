import DS from 'ember-data';

export default DS.Model.extend({
  userId: DS.attr('string'),
  title: DS.attr('string'),
  date: DS.attr('string'),
  startTime: DS.attr('string'),
  endTime: DS.attr('string'),
  createdAt: DS.attr('number')
});