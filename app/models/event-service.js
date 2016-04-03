import DS from 'ember-data';

export default DS.Model.extend({
  eventId: DS.attr('string'),
  title: DS.attr('string'),
  itemType: DS.attr('string'),
  youtubeUrl: DS.attr('string'),
  chordsUrl: DS.attr('string'),
  userId: DS.attr('string'),
  order: DS.attr('number'),
  createdAt: DS.attr('number')
});
