import { NodeScript, nodeScripts } from '@blueprints/nodeScripts'

export function getNodeScript(type: string): NodeScript {
  return nodeScripts[type] || { process: () => {} }
}
