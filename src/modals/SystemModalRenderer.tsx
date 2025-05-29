import React, { useEffect, useMemo, useState } from 'react'
import Modal from '../components/Modal';
import ModalHeader from '../components/Modal/Header';
import ModalBody from '../components/Modal/Body';
import ModalFooter from '../components/Modal/Footer';
import Button from '../components/inputs/Button';
import RenderEditorData from '../designer/RenderEditorData';

import lz from 'lzutf8'
import { PageData, SystemData } from '../storage/schemas/system';
import { Character } from '../storage/schemas/character';
import { BlueprintProcessorState } from '../utils/Blueprints/processBlueprint';

type Props = {
  data: any | null;
  title?: string;

  isOpen: boolean;
  requestClose(): void;
  onSave(newData: string): void;
  onDelete?(): void;
}

const SystemModalRendererModal: React.FC<Props> = ({ data, title = 'Unknown Modal', isOpen, requestClose, onSave, onDelete }) => {
  const { page, character, system, updateState } = data

  return (
    <Modal isOpen={isOpen} onClose={requestClose}>
      <ModalHeader title={title} onClose={requestClose} />

      <ModalBody>
        <RenderPage page={page} character={character} system={system} updateState={updateState} />
      </ModalBody>

      <ModalFooter>
        <Button color='light' onClick={requestClose}>close</Button>
      </ModalFooter>
    </Modal>
  )
}

function RenderPage({ page, character, system, updateState }: { page: PageData, character: Character, system: SystemData, updateState(state: BlueprintProcessorState): void }) {
  const data = useMemo(() => {
    if (!page.lexical) return {}

    return JSON.parse(lz.decompress(lz.decodeBase64(page.lexical)))
  }, [page.lexical])

  return (
    <RenderEditorData data={data} state={{ character, system, page }} updateState={updateState} />
  )
}

export default SystemModalRendererModal