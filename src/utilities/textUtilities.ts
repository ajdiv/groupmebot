/**
   * Determines if a given word can have a synonym or not.
   * Excluded words are proper nouns and common words such as pronouns.
   * @param word - The word to analyze
   * @returns Whether the word can have a synonym
   */
export function wordCanSynonym(word: string): boolean {
  if (!word) return false;

  // These must all be lowercase
  const wordsToIgnore = [
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now"
  ];

  const isCommonWord = wordsToIgnore.includes(word);
  const isProperNoun = word[0] === word[0].toUpperCase();

  return !isCommonWord && !isProperNoun;
}

/**
   * Splits the given phrase into manageable words.
   * Excludes anything that is not a character or number
   * @param phrase - The phrase to scrub
   * @returns A string array of words to thesaurize
   */
export function parseAndScrub(phrase: string): string[] {
  let arr = phrase.trim().split(' ');
  let result: string[] = [];
  if (!phrase) return result;
  for (let i = 0; i < arr.length; i++) {
    const scrub = arr[i].replace(/[^A-Za-z0-9]/g, '');
    if(scrub) result.push(scrub);
  }
  return result;
};

/**
   * Picks a random word from an array of strings
   */
export function pickRandomWord(synArr: string[]): string {
  // Handle empty or null array
  if (!synArr || synArr.length === 0) return '';

  var result = synArr[Math.floor(Math.random() * synArr.length)];
  return result;
};