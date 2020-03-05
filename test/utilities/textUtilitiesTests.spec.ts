import { expect } from 'chai';
import { pickRandomWord } from '../../src/utilities/textUtilities';

describe('Word Randomization Tests', () => {
    it('should return one single word given an array of multiple strings', function () {
        var result = pickRandomWord(['test', 'hey']);
        expect(result).to.be.a('string');
    });

    it('should return nothing given an empty array', () => {
        var result = pickRandomWord([]);
        expect(result).to.be.empty;
    });

    it('should return nothing given nothing', function () {
      var result = pickRandomWord(null);
      expect(result).to.be.empty;
  });
});