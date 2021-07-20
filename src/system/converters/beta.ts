
/**
 * convert our client side stored data (characters) from the beta to 1.0.0 versions
 */


export function character(char) {
  char.version = '1.0.0'

  return char;
}