import Sandbox from '@nyariv/sandboxjs'
import showModal from './showModal'

export default async <T>(vm: Sandbox, compiled: string, context: Record<string, any>, updateState: any): Promise<{ success: boolean, error?: string, result?: T }> => {
  try {
    const code = `
      async function rc() {
        ${compiled}
      }

      return rc()
    `

    const ctx = JSON.parse(JSON.stringify(context))
    const exec = vm.compile(code, true)
    const result = await exec({ ...ctx, floor: Math.floor, openModal: showModal }).run() as any

    updateState(ctx)

    return { success: true, error: undefined, result }
  } catch (error: any) {
    return { success: false, error: error.message, result: undefined }
  }
}