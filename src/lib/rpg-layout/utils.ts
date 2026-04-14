import type { Script } from '@/types/script'
import type { Condition } from './types'

// --- Dot/bracket path helpers ---
function tokenize(path: string): Array<string | number> {
  const tokens: Array<string | number> = []
  let buf = ''
  for (let i = 0; i < path.length; i++) {
    const ch = path[i]
    if (ch === '.') {
      if (buf) tokens.push(buf), (buf = '')
    } else if (ch === '[') {
      if (buf) tokens.push(buf), (buf = '')
      let j = i + 1
      let idx = ''
      while (j < path.length && path[j] !== ']') {
        idx += path[j]
        j++
      }
      i = j
      const num = Number(idx)
      tokens.push(Number.isNaN(num) ? idx : num)
    } else {
      buf += ch
    }
  }
  if (buf) tokens.push(buf)
  return tokens
}

export function getValue<T = unknown>(obj: unknown, path: string): T | undefined {
  try {
    if (obj == null || !path) return undefined
    const tokens = tokenize(path)
    let curr: any = obj as any
    for (const t of tokens) {
      if (curr == null) return undefined
      curr = curr[t as any]
    }
    return curr as T
  } catch {
    return undefined
  }
}

export function setValue(obj: unknown, path: string, value: unknown): boolean {
  try {
    if (obj == null || !path) return false
    const tokens = tokenize(path)
    let curr: any = obj as any
    for (let i = 0; i < tokens.length - 1; i++) {
      const key = tokens[i]
      const nextKey = tokens[i + 1]
      if (curr[key as any] == null) {
        curr[key as any] = typeof nextKey === 'number' ? [] : {}
      }
      curr = curr[key as any]
    }
    const last = tokens[tokens.length - 1]
    curr[last as any] = value
    return true
  } catch {
    return false
  }
}

// --- String interpolation ---
const tmplRegex = /{{\s*([^}]+)\s*}}/g
export function interpolateText(template: string, data: Record<string, unknown>): string {
  try {
    return template.replace(tmplRegex, (_, expr) => {
      const v = getValue<unknown>(data, expr.trim())
      if (v == null) return ''
      if (typeof v === 'object') return JSON.stringify(v)
      return String(v)
    })
  } catch {
    return template
  }
}

// --- Conditions ---
export function evaluateCondition(condition: Condition, character: unknown): boolean {
  try {
    // Compound first
    if (condition.all && condition.all.length) {
      return condition.all.every((c) => evaluateCondition(c, character))
    }
    if (condition.any && condition.any.length) {
      return condition.any.some((c) => evaluateCondition(c, character))
    }
    if (condition.not) {
      return !evaluateCondition(condition.not, character)
    }

    // Simple comparison
    const left = condition.path ? getValue<unknown>(character, condition.path) : undefined
    const op = condition.operator ?? 'exists'
    const right = condition.value

    switch (op) {
      case 'exists':
        return left !== undefined && left !== null
      case 'eq':
        return left === right
      case 'neq':
        return left !== right
      case 'gt':
        return Number(left) > Number(right)
      case 'lt':
        return Number(left) < Number(right)
      case 'gte':
        return Number(left) >= Number(right)
      case 'lte':
        return Number(left) <= Number(right)
      case 'includes':
        if (Array.isArray(left)) return left.includes(right as any)
        if (typeof left === 'string') return String(left).includes(String(right ?? ''))
        return false
      default:
        return false
    }
  } catch {
    return false
  }
}

// --- Script execution bridge ---
export type ScriptExecutor = (script: Script, context: Record<string, unknown>) => Promise<{ success: boolean; result?: unknown; error?: string }>

let executor: ScriptExecutor | null = null

export function setScriptExecutor(fn: ScriptExecutor): void {
  executor = fn
}

export async function executeScript<T = unknown>(script: Script, character: unknown, extraContext: Record<string, unknown> = {}): Promise<{ success: boolean; result?: T; error?: string }>{
  if (!executor) {
    return { success: false, error: 'Script executor not initialized' }
  }
  try {
    const base: Record<string, unknown> = {
      character,
      getValue,
      setValue,
      ...extraContext,
    }
    const out = await executor(script, base)
    return { success: out.success, result: out.result as T, error: out.error }
  } catch (e: any) {
    return { success: false, error: e?.message ?? 'Script execution failed' }
  }
}
