import { SyncStorage } from '../lib/storage';
import { db } from '../storage';

const clearLocalStorage = async () => {
  SyncStorage.clear()

  await Promise.all(
    db.tables.map(table => table.clear())
  );
}

export default clearLocalStorage