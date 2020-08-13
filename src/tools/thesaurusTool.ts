import request = require('request');
import { TextUtilities } from '../utilities/textUtilities';

export abstract class ThesaurusTool {

  private static readonly THESAURUS_URL_PREFIX: string = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/';

  public static async thesaurize(phrase: string): Promise<string> {

    // Collect one promise (thesaurus request) per non-trivial word in the phrase
    const wordArr = TextUtilities.parseAndScrub(phrase);
    const promiseArr = [];

    for (let i = 0; i < wordArr.length; i++) {
      const word = wordArr[i];
      const promise = this.createApiPromise(word);
      promiseArr.push(promise);
    }

    const resultArrays: any[] = await Promise.all(promiseArr);
    let result = '';
    for (let i = 0; i < resultArrays.length; i++) {
      let syn = TextUtilities.pickRandomWord(resultArrays[i]);
      result += syn + ' ';
    }
    return Promise.resolve(result.trim());
  };

  private static createApiPromise(word: string) {
    if (!TextUtilities.wordCanSynonym(word)) {
      return Promise.resolve([word]);
    }

    const url = this.THESAURUS_URL_PREFIX + word + '?key=' + process.env.THESAURUS_API_KEY;
    let promise = new Promise((resolve, reject) => {
      request({ url: url, rejectUnauthorized: false }, (error, resp) => {
        if (error) {
          reject(error.code + ": An error has occurred connecting to the thesaurus: " + error);
        }
        let rawResults = JSON.parse(resp.body);
        let result = '';
        if (!rawResults[0].meta && Object.prototype.toString.call(rawResults) === '[object Array]') {
          result = TextUtilities.pickRandomWord(rawResults);
          return resolve([result]);
        }
        if (!rawResults[0] || !rawResults[0].meta || !rawResults[0].meta.syns) {
          return resolve([word]);
        }
        result = rawResults[0].meta.syns[0];
        resolve(result);
      });
    });
    return promise;
  };

}

