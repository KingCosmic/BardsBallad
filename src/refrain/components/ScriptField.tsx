import React, { useMemo } from 'react'
import { editorState } from '@/state/editor'
import { useVersionEdits } from '@/db/version/hooks/useVersionEdits'
import { useAutomergeDoc } from '@/lib/automerge/useAutomergeDoc'
import { SystemData } from '@/db/system/schema'
import { openModal } from '@/state/modals'
import ScriptEditor from '@/modals/editors/script-editor'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Script } from '@/types/script'

interface ScriptFieldProps {
  label: string
  script: Script
  expectedType?: string
  onChange: (script: Script) => void
}

/**
 * A labelled "Edit Script" button that opens the ScriptEditor modal.
 * Pulls SystemTypes from the current editor version automatically.
 */
export const ScriptField: React.FC<ScriptFieldProps> = ({
  label,
  script,
  expectedType = 'any',
  onChange,
}) => {
  const { versionId } = editorState.useValue()
  const edits = useVersionEdits(versionId)
  const { doc } = useAutomergeDoc<SystemData>(edits?.doc)

  const types = useMemo(() => {
    if (!doc) return []
    return [
      doc.defaultCharacterData._type,
      { name: 'SystemData', properties: doc.data.map((d: any) => ({ key: d.name, typeData: d.typeData })) },
      { name: 'PageData', properties: [] },
      ...(doc.types ?? []),
    ]
  }, [doc])

  const isConfigured = Boolean(script?.isCorrect)

  return (
    <div className='space-y-1'>
      <Label className='text-xs'>{label}</Label>
      <div className='flex items-center gap-2'>
        <span className={`text-xs flex-1 truncate ${isConfigured ? 'text-green-400' : 'text-muted-foreground'}`}>
          {isConfigured ? (script.source?.slice(0, 40) || 'Configured') : 'Not configured'}
        </span>
        <Button
          variant='outline'
          size='sm'
          onClick={() =>
            openModal(`script-${label}`, ({ id }) => (
              <ScriptEditor
                id={id}
                types={types}
                globals={[]}
                expectedType={expectedType}
                code={script}
                onSave={({ result }) => onChange(result)}
              />
            ))
          }
        >
          Edit
        </Button>
      </div>
    </div>
  )
}
