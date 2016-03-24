import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  description: DS.attr('string')
});
