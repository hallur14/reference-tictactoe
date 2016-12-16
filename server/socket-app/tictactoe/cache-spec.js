var CacheModule = require('./cache');

describe("Tictactoe command handler", function () {

    var resultingEvents =[];

    var Cache = CacheModule(
        inject({cacheSize:1})
    );

    beforeEach(function () {
        cache = Cache();
    });


    it('should cache object', function () {
        cache.add('one', 'ONE');
        expect(cache.get('one')).toBe('ONE');
    });


    it('should evict first object when another is added',function(){
        cache.add('one', 'ONE');
        cache.add('two', 'TWO');
        expect(cache.get('one')).toBeUndefined();
    });

});