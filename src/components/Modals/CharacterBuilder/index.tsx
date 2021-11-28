import React, { useState } from 'react'

import Modal from '../Modal'

import ChooseName from './ChooseName'

type Props = {
  isOpen:boolean
  setIsOpen(open:boolean):void
  onConfirm(value:string):void
}

function CharacterBuilder(props:Props) {
  const { isOpen, setIsOpen, onConfirm } = props

  // TODO: replace this default value with the createCharacter function.
  const [char, setChar] = useState({})
  const [stage, setStage] = useState(1)

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {
        (stage === 1) ? <ChooseName /> : null
      }
      <div className='bg-sidebars w-full h-12 flex justify-between px-4 text-gray-200'>
        <svg onClick={() => setStage(stage - 1)} xmlns="http://www.w3.org/2000/svg" className="h-12 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>

        <div className='h-12 flex items-center justify-between space-x-1.5'>
          <div className='rounded-full h-3 w-3 bg-gray-200' />

          <div className='rounded-full h-3 w-3 bg-gray-200' />

          <div className='rounded-full h-3 w-3 bg-gray-200' />
        </div>

        <svg onClick={() => setStage(stage + 1)} xmlns="http://www.w3.org/2000/svg" className="h-12 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Modal>
  )
}

export default CharacterBuilder
