import type { ComponentConfig, Column, PageLayout } from './types'

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

function validateComponentConfig(v: unknown): v is ComponentConfig {
  if (!isRecord(v)) return false
  const id = typeof v.id === 'string'
  const type = typeof v.type === 'string'
  const configOk = isRecord(v.config)
  const condOk = v.conditions === undefined || Array.isArray(v.conditions)
  return id && type && configOk && condOk
}

function validateColumn(v: unknown): v is Column {
  if (!isRecord(v)) return false
  const idOk = typeof v.id === 'string'
  const comps = v.components
  const compsOk = Array.isArray(comps) && comps.every(validateComponentConfig)
  return idOk && compsOk
}

function validatePageLayout(v: unknown): v is PageLayout {
  if (!isRecord(v)) return false
  const idOk = typeof v.id === 'string'
  const nameOk = typeof v.name === 'string'
  const cols = v.columns
  const colsOk = Array.isArray(cols) && cols.every(validateColumn)
  return idOk && nameOk && colsOk
}

export function serializeLayout(layout: PageLayout): string {
  // Safe stringify; could add versioning here
  return JSON.stringify({ $schema: 'bardsballad.layout.v1', layout })
}

export function deserializeLayout(json: string): PageLayout {
  try {
    const parsed = JSON.parse(json)
    const value = isRecord(parsed) && isRecord(parsed.layout) ? parsed.layout : parsed
    if (!validatePageLayout(value)) {
      throw new Error('Invalid layout format')
    }
    return value
  } catch (e: any) {
    throw new Error(e?.message ?? 'Failed to parse layout JSON')
  }
}

// Sharing wrappers (alias with schema envelope)
export function exportLayout(layout: PageLayout): string {
  return serializeLayout(layout)
}

export function importLayout(json: string): PageLayout {
  return deserializeLayout(json)
}
