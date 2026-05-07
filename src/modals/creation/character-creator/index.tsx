import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { closeModal } from "@/state/modals"
import NoSystem from "./no-system"
import z from "zod"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAppForm } from "@/hooks/useForm"
import { FieldGroup, FieldLabel, Field } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSubscriptionsWithData from '@/db/subscription/hooks/useSubscriptionsWithData'
import { useCharacters } from '@/db/character/hooks/useCharacters'
import createCharacter from '@/db/character/methods/createCharacter'
import RenderRefrainPage from '@/refrain/components/RenderRefrainPage'
import { ChangeOperation, ChangesMap } from '@/utils/object/wrapWithTracking'
import { PageData } from "@/db/system/schema"

// Apply a list of ChangeOperations (from the script proxy) to a plain object.
// Mirrors the logic in applyChangesToAutomerge but operates on plain JS objects.
function applyChangesToPlain(state: Record<string, any>, ops: ChangeOperation[]): Record<string, any> {
  const next = structuredClone(state)
  for (const op of ops) {
    const parts = op.path.split('.')
    const rel = parts.slice(1) // skip root key
    if (rel.length === 0) continue

    let cur: any = next
    for (let i = 0; i < rel.length - 1; i++) {
      if (cur[rel[i]] == null) cur[rel[i]] = {}
      cur = cur[rel[i]]
      if (!cur) break
    }
    if (!cur) continue

    const last = rel[rel.length - 1]

    if (op.type === 'set') {
      cur[last] = op.value
    } else if (op.type === 'delete') {
      delete cur[last]
    } else if (op.type === 'array' && op.arrayOp) {
      const arr = cur[last]
      if (!Array.isArray(arr)) continue
      const { method, args } = op.arrayOp
      if (method === 'push') arr.push(...args)
      else if (method === 'pop') arr.pop()
      else if (method === 'shift') arr.shift()
      else if (method === 'unshift') arr.unshift(...args)
      else if (method === 'splice') (arr.splice as any)(...args)
      else if (method === 'sort') arr.sort(args[0])
      else if (method === 'reverse') arr.reverse()
      else if (method === 'fill') (arr.fill as any)(...args)
      else if (method === 'copyWithin') (arr.copyWithin as any)(...args)
    }
  }
  return next
}

// Normalize the system's defaultCharacterData into a character-document-shaped object
// so that script paths like "character.data.hp" navigate correctly.
function normalizeBuilderData(defaultCharacterData: any): Record<string, any> {
  const data =
    defaultCharacterData &&
    typeof defaultCharacterData === 'object' &&
    defaultCharacterData.data &&
    typeof defaultCharacterData.data === 'object'
      ? defaultCharacterData.data
      : defaultCharacterData && typeof defaultCharacterData === 'object'
      ? defaultCharacterData
      : {}
  return {
    data: structuredClone(data),
    progression: { level: 1 },
    selections: {},
    states: [],
    overrides: {},
  }
}

// Define the form schema
const characterFormSchema = z.object({
  name: z.string().min(1, 'Character name is required'),
  slug: z.string(),
  systemId: z.string().min(1, 'System is required'),
  activePacks: z.array(z.any()),
  characterData: z.any(),
})

type CharacterFormData = z.infer<typeof characterFormSchema>

interface Props {
  id: number
}

export default function CharacterCreator({ id }: Props) {
  const { characters: _c, isLoading: loadingCharacters } = useCharacters()

  const { subscriptions, isLoading: loadingSubscriptions } = useSubscriptionsWithData(['theme'])
  
  const grouped = useMemo(() => (subscriptions || []).filter(sub => sub.type === 'system'), [subscriptions])

  const form = useAppForm({
    defaultValues: {
      name: '',
      slug: '',
      systemId: grouped[0]?.local_id ?? '',
      activePacks: [],
      characterData: {}
    } as CharacterFormData,
    validators: {
      onChange: characterFormSchema,
    },
    onSubmit: async ({ value }) => {
      const system = grouped.find(sys => sys.local_id === value.systemId)

      if (!system) return

      await createCharacter(
        value.name, value.slug,
        builderData,
        value.systemId,
        []
      )
      closeModal(id)
    },
  })

  // Current wizard step: 0 = basic info, 1..N = creator pages
  const [builderStep, setBuilderStep] = useState(0)

  // Accumulated character data built up through the creator pages
  const [builderData, setBuilderData] = useState<Record<string, any>>(() => {
    const system = grouped.find(sys => sys.local_id === (grouped[0]?.local_id ?? ''))
    return normalizeBuilderData(system?.item.snapshot?.defaultCharacterData)
  })

  // The currently selected system and its creator pages
  const currentSystem = useMemo(
    () => grouped.find(sys => sys.local_id === form.state.values.systemId),
    [grouped, form.state.values.systemId]
  )

  const creatorPages: PageData[] = useMemo(
    () => currentSystem?.item.snapshot?.creator ?? [],
    [currentSystem]
  )

  // Reset builder state when the system changes
  useEffect(() => {
    setBuilderData(normalizeBuilderData(currentSystem?.item.snapshot?.defaultCharacterData))
    setBuilderStep(0)
  }, [currentSystem])

  // The viewer state passed to creator pages is the data portion of the builder doc
  const viewerState = useMemo(() => builderData.data ?? {}, [builderData])

  // Apply script-generated changes to the local builder data
  const updateBuilderState = useCallback(async (changes: ChangesMap) => {
    if (changes.has('character')) {
      const ops = changes.get('character')!
      setBuilderData(prev => applyChangesToPlain(prev, ops))
    }
  }, [])

  const isLastStep = builderStep >= creatorPages.length
  const currentPage = creatorPages[builderStep - 1]

  if (loadingCharacters || loadingSubscriptions) {
    return (
      <Dialog open onOpenChange={() => closeModal(id)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Adventurer</DialogTitle>
            <DialogDescription>
              How does your story go?
            </DialogDescription>
          </DialogHeader>
          <Spinner />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  if (grouped.length === 0) {
    return <NoSystem id={id} />
  }

  return (
    <Dialog open onOpenChange={() => closeModal(id)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Adventurer</DialogTitle>
          <DialogDescription>
            {builderStep === 0
              ? 'How does your story go?'
              : `Step ${builderStep} of ${creatorPages.length}: ${currentPage?.name ?? ''}`}
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          {/* Step 0: Basic info */}
          {builderStep === 0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              <FieldGroup>
                <form.AppField
                  name='name'
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor='character-name'>
                        Name
                      </FieldLabel>
                      <Input
                        id='character-name'
                        placeholder='Aliza Cartwight'
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </Field>
                  )}
                />
                <form.AppField
                  name='slug'
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor='adventuring-motto'>
                        Adventuring Motto
                      </FieldLabel>
                      <Input
                        id='adventuring-motto'
                        placeholder='I will avenge them.'
                        required
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </Field>
                  )}
                />
                <form.AppField
                  name='systemId'
                  children={(field) => (
                    <Field>
                      <FieldLabel htmlFor='ttrpg-system'>
                        System
                      </FieldLabel>
                      <Select value={field.state.value} onValueChange={field.handleChange}>
                        <SelectTrigger id='ttrpg-system' className="w-[180px]">
                          <SelectValue placeholder='Select a TTRPG System' />
                        </SelectTrigger>
                        <SelectContent>
                          {grouped.map(sys => (
                            <SelectItem key={sys.local_id} value={sys.local_id}>
                              {sys.item.shadow.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {field.state.meta.errors[0]?.message}
                        </p>
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          )}

          {/* Steps 1+: Creator pages */}
          {builderStep > 0 && currentPage && (
            <RenderRefrainPage
              page={currentPage}
              currentTab={currentPage.name}
              state={viewerState}
              updateState={updateBuilderState}
            />
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant='outline' onClick={() => closeModal(id)}>Cancel</Button>

          {builderStep > 0 && (
            <Button variant='outline' onClick={() => setBuilderStep(s => s - 1)}>
              Back
            </Button>
          )}

          {isLastStep ? (
            <Button onClick={() => form.handleSubmit()}>
              Create Character
            </Button>
          ) : (
            <Button onClick={() => setBuilderStep(s => s + 1)}>
              Next
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

