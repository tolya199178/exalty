import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('notifiation-setting-row', 'Integration | Component | notifiation setting row', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{notifiation-setting-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#notifiation-setting-row}}
      template block text
    {{/notifiation-setting-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
