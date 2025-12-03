import { SystemType } from '@/db/system/schema';
import { sha256 } from 'js-sha256';

export default (typeData: SystemType): { name: string, hash: string } => {
  return ({ name: typeData.name, hash: sha256(typeData.properties.sort((a: any, b: any) => a.key.localeCompare(b.key)).map((type: any) => JSON.stringify(type)).join('/')) })
}