import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import Modal from './Modal'

import { Character } from '../../types'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const Name = styled.p`
  color: #E32428;
  margin: 10px 0;
`

const Input = styled.input`
  margin: 0 15px;
  color: rgba(20, 20, 20, 0.85);
  border: none;
  background: ${props => props.theme.elevated};
  border: 2px solid ${props => props.theme.sidebars};
  padding: 10px;
  border-radius: 4px;
  appearance: none;
  color: ${props => props.theme.gold};
  font-size: 1.4em;
  width: 100%;
  text-align: center;

  &:focus {
    outline: none;
  }
`

const Row = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: space-between;
  align-items: center;
`

const Item = styled.p`
  padding: 5px;
  border-radius: 4px;
  margin: 0 5px;
  color: white;
  cursor: pointer;
`

type DeleteProps = {
  enabled:boolean
}

const Delete = styled(Item)<DeleteProps>`
  transition: .5s;

  cursor: not-allowed;
  border: 1px solid rgba(255, 255, 255, .6);
  color: rgba(255, 255, 255, .6);

  ${props => props.enabled && css`
    cursor: pointer;
    border: 1px solid #E32428;
    color: #E32428;
    

    &:hover {
      background: #E32428;
      color: white;
    }
  `}
`

type Props = {
  id:string,
  chars:Character[],
  isOpen: boolean,
  setIsOpen(open:boolean):void,
  onConfirm(value:string):void
}

function DeleteConfirmation(props: Props) {
  const { id, chars, isOpen, setIsOpen, onConfirm } = props

  const [name, setChar] = useState('')
  const [value, setValue] = useState('')

  useEffect(() => {
    var char = chars.find(c => c._id === id)
    setChar(char ? char.name : '')
  }, [id])

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form onSubmit={e => {
        onConfirm(value)
        setIsOpen(false)
        e.preventDefault()
      }}>

        <p>To delete this character type in their name</p>
        <Name>{name}</Name>

        <Input
          type='text'
          spellCheck='false'
          defaultValue={value}
          onChange={e => setValue(e.target.value)}
        />

        <Row>
          <Item onClick={() => setIsOpen(false)}>
            Cancel
          </Item>
          <Delete 
            enabled={name.toLowerCase() === value.toLowerCase()}
            onClick={() => {
              if (name.toLowerCase() !== value.toLowerCase()) return;
              onConfirm(id)
              setIsOpen(false)
            }}
          >Delete</Delete>
        </Row>
      </Form>
    </Modal>
  )
}

export default DeleteConfirmation
