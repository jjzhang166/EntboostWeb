/**
 * Created by Administrator on 2014/5/22.
 */
(function($) {
//    module('utils', {
//        setup: function() {
//
//        }
//    });
//
//    test('getQueryStringRegExp', function() {
//        expect(1);
//        var aaaVar =$.ebfn.getQueryStringRegExp("http://abc.com?aaa=12", "aaa");
//        console.log(aaaVar);
//        strictEqual(aaaVar, "12", 'variable');
//    });

    module('messenger step');

    asyncTest("init", function() {
        expect(1);
        equal(1, 1 , "pending");
        start();
    });

}(jQuery));