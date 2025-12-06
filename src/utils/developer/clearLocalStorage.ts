import { db } from '@/db';

const clearLocalStorage = async () => {
  localStorage.clear()

  await Promise.all(
    db.tables.map(table => table.clear())
  );
}

export default clearLocalStorage