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
import { useMemo } from "react"
import { useAppForm } from "@/hooks/useForm"
import { FieldGroup, FieldLabel, Field } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import getVisualTextFromVersionID from "@/utils/misc/getVisualTextFromVersionID"
import { MultiSelect } from '@/components/ui/multi-select'
import useSubscriptionsWithData, { Grouped } from '@/db/subscription/hooks/useSubscriptionsWithData'
import { useCharacters } from '@/db/character/hooks/useCharacters'
import createCharacter from '@/db/character/methods/createCharacter'
import { Item } from '@/db/shared/schema'

const filterDatapacks = (systemID: string, subs: Item[]) => {
  const sys = subs.find(s => (s.type === 'system' && s.local_id === systemID))

  if (!sys) return []

  return []

  // const datapacks = subs.filter(sub => (sub.type === 'datapack'))

  // const packs = datapacks.map(dp => {
  //   const compatibleVersions = dp.versions.filter(v => {
  //     const sysHashTypes = sys.hashes[v.local_id]

  //     const hashTypes = dp.hashes[v.local_id]

  //     for (let h = 0; h < hashTypes.length; h++) {
  //       const hashType = hashTypes[h]
  //       const sysHash = sysHashTypes.find(h => h.name === hashType.name)

  //       if (!sysHash) return false

  //       if (hashType.hash !== sysHash.hash) return false
  //     }

  //     return true
  //   })

  //   return {
  //     label: dp.item.shadow.name, value: getVisualTextFromVersionID(compatibleVersions[0].local_id ?? '')
  //   }
  // })

  // return packs
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
      // Pass a schema or function to validate
      onChange: characterFormSchema,
    },
    onSubmit: async ({ value }) => {
      const system = grouped.find(sys => sys.local_id === value.systemId)

      if (!system) return

      await createCharacter(
        value.name, value.slug,
        structuredClone(system.item.snapshot!.defaultCharacterData),
        value.systemId,
        []
        // activePacks.map(pack => ({ pack_id: pack.reference_id, version_id: pack.local_id }))
      )
      closeModal(id)
    },
  })

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
            <Button type="submit">Save changes</Button>
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Adventurer</DialogTitle>
          <DialogDescription>
            How does your story go?
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
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
              {/* <form.AppField
                name='versionId'
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor='ttrpg-version'>
                      Version
                    </FieldLabel>
                    <Select value={field.state.value} onValueChange={field.handleChange}>
                      <SelectTrigger id='ttrpg-version' className="w-[180px]">
                        <SelectValue placeholder='Select System Version' />
                      </SelectTrigger>
                      <SelectContent>
                        {systems.find(sys => sys.item_id === form.state.values.systemId)?.versions.map((ver) => (
                          <SelectItem key={ver.local_id} value={ver.local_id}>
                            {getVisualTextFromVersionID(ver.local_id)}
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
              /> */}

              {/* <form.AppField
                name='activePacks'
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor='datapacks'>
                      Datapacks
                    </FieldLabel>
                    <MultiSelect
                      options={filterDatapacks(form.state.values.systemId, subscriptions)}
                      value={field.state.value}
                      onValueChange={field.handleChange}
                      placeholder="Choose datapacks..."
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors[0]?.message}
                      </p>
                    )}
                  </Field>
                )}
              /> */}
            </FieldGroup>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant='outline' onClick={() => closeModal(id)}>Cancel</Button>
          <Button onClick={() => {
            form.handleSubmit()
          }}>Create Character</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
