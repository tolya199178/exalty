import DS from 'ember-data';

export default DS.Model.extend({  
  toEmail: DS.attr('string'),
  title: DS.attr('string'),
  content: DS.attr('string'),
  userId: DS.attr('string'),  
  createdAt: DS.attr('number')
});
