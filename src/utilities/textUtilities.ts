export function pickRandomWord(synArr: string[]) {
    // Handle empty or null array
    if(!synArr || synArr.length === 0) return'';

    var result = synArr[Math.floor(Math.random() * synArr.length)];
    return result;
  };