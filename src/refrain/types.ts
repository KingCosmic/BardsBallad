export type BlockType = string

export type Block = {
  id: string
  type: BlockType
  props: Record<string, any>
}