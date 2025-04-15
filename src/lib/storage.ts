import { Storage as IoStorage } from '@ionic/storage'

class Storage {
  public store: IoStorage;

  public isCreated: boolean = false;

  constructor(name: string | undefined) {
    this.store = new IoStorage({
      name: name
    })

    this.createStorage()
  }

  async createStorage() {
    await this.store.create()
    this.isCreated = true
  }

  get(key: string) {
    return this.store.get(key)
  }

  set(key: string, value: any) {
    return this.store.set(key, value)
  }

  remove(key: string) {
    return this.store.remove(key)
  }

  clear() {
    return this.store.clear()
  }

  keys() {
    return this.store.keys()
  }

  length() {
    return this.store.length()
  }

  forEach(cb: (value: any, key: string, iterationNumber: Number) => any): Promise<void> {
    return this.store.forEach(cb)
  }
}

export const SettingsStorage = new Storage('settings')
export const AuthStorage = new Storage('auth')
export const SyncStorage = new Storage('sync')

export default Storage