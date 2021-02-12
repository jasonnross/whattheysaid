export function supplyAllForms (originalSearch) {
  const suffixes = [
    'eer',
    'er',
    'ion',
    'ity',
    'ment',
    'ness',
    'or',
    'sion',
    'ship',
    'th',
    'able',
    'ible',
    'al',
    'ant',
    'ary',
    'ful',
    'ic',
    'ious',
    'ous',
    'ive',
    'less',
    'y',
    'ed',
    'ned',
    'en',
    'ing',
    'ize',
    'ise',
    'ly',
    'ward',
    'wise',
    's'
  ];

  let possibleForms = [];
  suffixes.forEach(suffix => {
    possibleForms.push(originalSearch + suffix);
    if (originalSearch.substring(originalSearch.length - suffix.length, originalSearch.length) === suffix) {
      possibleForms.push(originalSearch.substring(0, originalSearch.length - suffix.length));
    }
  })
  possibleForms.push(originalSearch);
  // console.log(possibleForms);
  return possibleForms;
}

export const suffixes = [
  'eer',
  'er',
  'ion',
  'ity',
  'ment',
  'ness',
  'or',
  'sion',
  'ship',
  'th',
  'able',
  'ible',
  'al',
  'ant',
  'ary',
  'ful',
  'ic',
  'ious',
  'ous',
  'ive',
  'less',
  'y',
  'ed',
  'ned',
  'en',
  'ing',
  'ize',
  'ise',
  'ly',
  'ward',
  'wise',
  's'
];













