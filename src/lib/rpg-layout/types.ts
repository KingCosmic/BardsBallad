import type { JSX, ReactNode } from 'react'
import type { Script } from '@/types/script'

// Basic condition type for showing/hiding components
export type ConditionOperator = 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'includes' | 'exists'

export interface Condition {
  path?: string
  operator?: ConditionOperator
  value?: unknown
  // Compound conditions
  any?: Condition[]
  all?: Condition[]
  not?: Condition
}

// Configuration field definition used to build config panels
export type ConfigFieldType =
  | 'text'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'textarea'
  | 'color'
  | 'range'
  | 'path'

export interface ConfigOption {
  label: string
  value: string | number
}

export interface ConfigField {
  key: string
  label: string
  type: ConfigFieldType
  required?: boolean
  default?: unknown
  options?: ConfigOption[]
  min?: number
  max?: number
  step?: number
  helpText?: string
  group?: string
}

// Component configuration within a layout column
export interface ComponentConfig {
  id: string
  type: string
  config: Record<string, unknown>
  conditions?: Condition[]
}

export interface Column {
  id: string
  components: ComponentConfig[]
}

export interface PageLayout {
  id: string
  name: string
  columns: Column[]
}

export interface ScriptContext {
  character: unknown
  getValue: (obj: unknown, path: string) => unknown
  setValue: (obj: unknown, path: string, value: unknown) => void
  executeScript: <T = unknown>(script: Script, context: Record<string, unknown>) => Promise<{ success: boolean; result?: T; error?: string }>
}

export interface ComponentProps {
  config: Record<string, unknown>
  character: unknown
  scriptContext: ScriptContext
  onUpdate: (path: string, value: unknown) => void
}

export interface ComponentDefinition {
  id: string
  label: string
  icon?: ReactNode
  category: string
  defaultConfig: Record<string, unknown>
  configSchema: ConfigField[]
  render: (props: ComponentProps) => JSX.Element
}

export type ComponentCategory = string
