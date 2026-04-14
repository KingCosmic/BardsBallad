import { Item } from '@/db/shared/schema';

export default (obj: Item, filename: string) => {
  const blob = new Blob([JSON.stringify({ ...obj }, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.ballad`;
  a.click();

  URL.revokeObjectURL(url);
  a.remove();
};