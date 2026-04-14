import type { ComponentDefinition } from './types'

export class ComponentRegistry {
  private static components: Map<string, ComponentDefinition> = new Map()

  static register(def: ComponentDefinition): void {
    const id = def.id.trim()
    if (!id) {
      throw new Error('ComponentRegistry.register: component id is required')
    }
    if (this.components.has(id)) {
      throw new Error(`ComponentRegistry.register: component with id \"${id}\" already registered`)
    }
    this.components.set(id, def)
  }

  static get(id: string): ComponentDefinition | undefined {
    return this.components.get(id)
  }

  static getAll(): ComponentDefinition[] {
    return Array.from(this.components.values())
  }

  static getByCategory(category: string): ComponentDefinition[] {
    return this.getAll().filter((c) => c.category === category)
  }
}

export default ComponentRegistry
