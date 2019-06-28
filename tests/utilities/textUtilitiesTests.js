var expect = require('chai').expect;
var svc = require('../../utilities/textUtilities');


describe('Word Randomization Tests', function () {
    it('should return one single word given an array of multiple strings', function () {
        var result = svc.pickRandomWord(['test', 'hey']);
        expect(result).to.be.a('string');
    });

    it('should throw an error when the result is not a string', function () {
        expect(() => {
            svc.pickRandomWord([8, 9])
        }).to.throw(Error);
    });

    it('should return nothing given an empty array', function () {
        var result = svc.pickRandomWord([]);
        expect(result).to.be.empty;
    });

    it('should return nothing given nothing', function () {
        var result = svc.pickRandomWord();
        expect(result).to.be.empty;
    });
}); 