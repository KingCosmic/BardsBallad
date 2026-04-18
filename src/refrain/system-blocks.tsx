import type { BlockDefinition } from './context/BlockRegistryContext'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'

const TextBlock: BlockDefinition['Render'] = ({ props, onChange }) => {
  const value = typeof props.text === 'string' ? props.text : ''

  return (
    <div className="space-y-2">
      <Input value={value} onChange={(event) => onChange({ ...props, text: event.target.value })} />
      <p>{value || ' '}</p>
    </div>
  )
}

const DividerBlock: BlockDefinition['Render'] = () => {
  return <Separator />
}

export const systemEditorBlockDefinitions: BlockDefinition[] = [
  {
    type: 'text',
    label: 'Text',
    defaultProps: () => ({
      text: 'hello world',
    }),
    Render: TextBlock,
  },
  {
    type: 'divider',
    label: 'Divider',
    defaultProps: () => ({}),
    Render: DividerBlock,
  },
]
