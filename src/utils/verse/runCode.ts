import { Scope } from 'quickjs-emscripten'

import load from '@utils/quick/load'

export default async <T>(compiled: string, context: Record<string, any>): Promise<{ success: boolean, error?: string, result?: T }> => {
  try {
    const QuickJS = await load()

    return Scope.withScope((scope) => {
      const vm = scope.manage(QuickJS.newContext())

      let parsedContext = ''
      for (const [key, value] of Object.entries(context)) {
        parsedContext += `let ${key} = ${JSON.stringify(value)};\n`
      }

      const result = scope.manage(
        vm.unwrapResult(
          vm.evalCode(`
            ${parsedContext}

            function main() {
              ${compiled}
            }

            main()
          `)
        )
      )

      return { success: true, error: undefined, result: vm.dump(result) }
    })
  } catch (error: any) {
    return { success: false, error: error.message, result: undefined }
  }
}