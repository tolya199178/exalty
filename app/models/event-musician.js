import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  musicianId: DS.attr('string'),
  musicianDesc: DS.attr('string'),
  userId: DS.attr('string'),
  eventId: DS.attr('string'),
  createdAt: DS.attr('number')
});
