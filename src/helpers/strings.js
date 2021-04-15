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