import React from 'react'
import type { BlockDefinition } from '../context/BlockRegistryContext'
import { Separator } from '@/components/ui/separator'

const DividerRender: BlockDefinition['Render'] = () => <Separator />

const DividerPreview: NonNullable<BlockDefinition['Preview']> = () => <Separator />

export const dividerBlockDefinition: BlockDefinition = {
  type: 'divider',
  label: 'Divider',
  defaultProps: () => ({}),
  Render: DividerRender,
  Preview: DividerPreview,
}
