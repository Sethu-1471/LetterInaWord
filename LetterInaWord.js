const LetterInaWord = (word, letter) => {
    var findIndex = word.indexOf(letter) > -1;
    var letterReturn = findIndex && letter;
    return {findIndex, letterReturn};
}

console.log(LetterInaWord("Working", "W"));
console.log(LetterInaWord("Working", "Working"));
console.log(LetterInaWord("Working", "d"));
console.log(LetterInaWord("Working", "Wo"));
