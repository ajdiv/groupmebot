import { expect } from 'chai';
import { parseAndScrub, pickRandomWord, wordCanSynonym } from '../../src/utilities/textUtilities';

describe('Word Randomization Tests', () => {
  it('should return one single word given an array of multiple strings', () => {
    const result = pickRandomWord(['test', 'hey']);
    expect(result).to.be.a('string');
  });

  it('should return nothing given an empty array', () => {
    const result = pickRandomWord([]);
    expect(result).to.be.empty;
  });

  it('should return nothing given nothing', () => {
    const result = pickRandomWord(null);
    expect(result).to.be.empty;
  });
});

describe('Can Synonym Tests', () => {
  it('should return false if I give it nothing', () => {
    const result = wordCanSynonym('');
    expect(result).to.be.false;
  });

  it('should return false if I give it a proper noun', () => {
    const result = wordCanSynonym('John');
    expect(result).to.be.false;
  });

  it('should return false if I give it a pronoun (lowercase)', () => {
    const result = wordCanSynonym('me');
    expect(result).to.be.false;
  });

  it('should return true if I give it a non-proper noun (lowercase)', () => {
    const result = wordCanSynonym('dog');
    expect(result).to.be.true;
  });
});

describe('Phrase Scrubber Tests', () => {
  it('should return empty array if I give it nothing', () => {
    const result = parseAndScrub('');
    expect(result).to.eql([]);
  });

  it('should remove any special characters from my phrase', () => {
    const result = parseAndScrub('te$t yo ` 125');
    expect(result).to.eql(['tet', 'yo', '125']);
  });

  it('should return an empty array if i only give it special characters', () => {
    const result = parseAndScrub('$ ^@ ` !!%!%@');
    expect(result).to.eql([]);
  });
});