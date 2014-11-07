(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery#jqEBMessenger', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.jqEBMessenger(), this.elems, 'should be chainable');
  });

  test('is awesome', function() {
    expect(1);
    strictEqual(this.elems.jqEBMessenger().text(), 'awesome0awesome1awesome2', 'should be awesome');
  });

  module('jQuery.jqEBMessenger');

  test('is awesome', function() {
    expect(2);
    strictEqual($.jqEBMessenger(), 'awesome.', 'should be awesome');
    strictEqual($.jqEBMessenger({punctuation: '!'}), 'awesome!', 'should be thoroughly awesome');
  });

  module(':jqEBMessenger selector', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is awesome', function() {
    expect(1);
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual(this.elems.filter(':jqEBMessenger').get(), this.elems.last().get(), 'knows awesome when it sees it');
  });

}(jQuery));
