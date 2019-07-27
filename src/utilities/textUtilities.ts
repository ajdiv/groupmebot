function pickRandomWord(synArr) {
    // Handle empty or null array
    if(!synArr || synArr.length === 0) return'';

    var result = synArr[Math.floor(Math.random() * synArr.length)];
    
    // Handle if result is not a string
    if(typeof(result) !== "string") throw new Error("Result was not of type string");

    return result;
  };

export = {
    pickRandomWord: pickRandomWord
  };