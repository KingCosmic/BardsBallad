import { useCallback, useEffect, useState } from 'react'
import Modal from '@components/Modal';
import ModalHeader from '@components/Modal/Header';
import ModalBody from '@components/Modal/Body';
import ModalFooter from '@components/Modal/Footer';
import Button from '@components/inputs/Button';
import TextInput from '@components/inputs/TextInput';
import Select from '@components/inputs/Select';
import Checkbox from '@components/inputs/Checkbox';
import { editorState } from '@state/editor';
import { Param } from '@blueprints/utils';
import { useVersionEdits } from '@hooks/useVersionEdits';
import { SystemData } from '@storage/schemas/system';
import { closeModal } from '@state/modals';

type Props = {
  data: Param;
  id: number;

  onSave(newData: Param): void;
  onDelete(): void;
}

function EditBlueprintParamModal({ id, data, onSave, onDelete } : Props) {
  const editor = editorState.useValue()
  const version = useVersionEdits<SystemData>(editor.versionId)

  const [param, setParam] = useState<Param>({ name: 'New Param', type: 'string', isArray: false })

  useEffect(() => {
    if (!data) return
  
    setParam(data)
  }, [data])

  const requestClose = useCallback(() => closeModal(id), [id])

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title='Edit Blueprint Param' onClose={requestClose} />

      <ModalBody>
        <TextInput id='name' label='Name' placeholder='baba yaga' value={param.name} onChange={name => setParam({ ...param, name })} isValid errorMessage='' />

        <Select id='type' label='Type' value={param.type} onChange={type => setParam({ ...param, type })}>
          <option value='none'>none</option>

          <option value='string'>string</option>

          <option value='number'>number</option>

          <option value='boolean'>boolean</option>

          <option value='enum'>enum</option>

          <option value='blueprint'>blueprint</option>
          {version?.data?.types.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
        </Select>

        <Checkbox id='is-array' label='Is Array?' checked={param.isArray} onChange={isArray => setParam({ ...param, isArray })} />
      </ModalBody>

      <ModalFooter>
        <Button color='danger'
          onClick={() => {
            onDelete()
            requestClose()
          }}
        >
          Delete
        </Button>

        <Button color='primary' onClick={() => {
          if (!data) return requestClose()

          onSave(param)
          requestClose()
        }}>Update</Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditBlueprintParamModal
