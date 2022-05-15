import { suffixes } from '../helpers/forms';

export function pluralizeType(type, count) {
  if (count < 2) { return type }
  switch (type) {
    case 'tweet':
      return type + 's';
    case 'speech':
      return type + 'es';
    case 'statement':
      return type + 's';
    case 'interview':
      return type + 's';
    default:
      return type + 's';
  }
}

export function parseStringToQuotes() {
  const showAllForms = true;
  const contextLevel = 1;
  const sentenceArray = [
    "Today marks six years since a white supremacist took nine precious lives at Mother Emanuel in an act of domestic terrorism.",
    "We must honor their lives with action, including reducing gun violence and addressing domestic terrorism.",
    "Today marks six years since a white supremacist took nine precious lives at Mother Emanuel in an act of domestic terrorism.",
    "We must honor their lives with action, including reducing gun violence and addressing domestic terrorism.",
  ]
  const string = sentenceArray.join(" ");

  const searchValue = "gun";
  const sentences = string.split(/(?<=[.!?])/);

  const suffixInserts = suffixes.join('|');

  var regExpString;
  if (showAllForms) {
    regExpString = String.raw`\b${searchValue}(?:${suffixInserts})?\b`
  } else {
    regExpString = String.raw`\b${searchValue}\b`
  }

  const regExp = new RegExp(regExpString, "i");
  // const articleContent = articleData?.content;
  // const articleContentArray = articleData?.content_array;

  // create array of indexes of sentences matching the search term
  var indexesOfMatchingSentences = [];
  sentences.forEach((sentence, i) => {
    if (regExp.test(sentence)) {
      indexesOfMatchingSentences.push(i)
    }
  })

  console.log(indexesOfMatchingSentences);

  // const result = sentences.map((sentence) => {
  //   if (sentence)
  // })
}