
/**
 * convert our client side stored data (characters) from the beta to 1.0.0 versions
 */


export function character(char) {
  char.version = '1.0.0'
  
  if (char.age === undefined) char.age = 20;
  char.armorProfs = [];
  char.weaponProfs = [];
  char.toolProfs = [];

  // TODO: convert pieces to items.

  delete char.bonds;
  delete char.flaws;
  delete char.ideals;
  delete char.traits;

  return char;
}