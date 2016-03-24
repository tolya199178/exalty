import DS from 'ember-data';

export default DS.Model.extend({
  expMonth: DS.attr('string'),
  expYear: DS.attr('string'),
  number: DS.attr('string'),
  cvc: DS.attr('string')
});
