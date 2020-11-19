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
    possibleForms.push(originalSearch+suffix);
  })
  possibleForms.push(originalSearch);
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













