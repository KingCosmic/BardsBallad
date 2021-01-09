import React, { useState } from 'react'
import styled from 'styled-components'

import Modal from './Modal'

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`

const Title = styled.p`
  color: ${props => props.theme.gold};
  font-size: 1.7em;
  padding-bottom: 15px;
`

const Row = styled.div`
  display: flex;
  width: 100%;
  margin-top: 20px;
  justify-content: space-between;
  align-items: center;
`

type ButtonProps = {
  cancel?: boolean
}

const Button = styled.p<ButtonProps>`
  background: ${props => props.cancel ? 'none' : props.theme.green};
  color: white;
  border-radius: 4px;
  padding: 10px;
  font-size: 1.3em;
  text-align: center;
  width: 40%;
  cursor: pointer;
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

type HP = {
  current:number
  max:number
  temp:number
}

type Props = {
  defaultValue:HP
  isOpen:boolean
  setIsOpen(open:boolean):void
  onConfirm(value:HP):void
}

function EditHP(props: Props) {
  const { defaultValue, isOpen, setIsOpen, onConfirm } = props

  const [current, setCurrent] = useState(defaultValue.current)
  const [max, setMax] = useState(defaultValue.max)
  const [temp, setTemp] = useState(defaultValue.temp)

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form onSubmit={e => {
        onConfirm(value)
        setIsOpen(false)
        e.preventDefault()
      }}>

        <Title>Edit Health</Title>

        <Row>
          <Input type='number' defaultValue={current} onChange={e => setCurrent((e.target.value as unknown) as number)} />
          <Input type='number' defaultValue={max} onChange={e => setMax((e.target.value as unknown) as number)} />
          <Input type='number' defaultValue={temp} onChange={e => setTemp((e.target.value as unknown) as number)} />
        </Row>

        <Row>
          <Button onClick={() => setIsOpen(false)} cancel>Cancel</Button>
          <Button onClick={() => {
            onConfirm({
              current,
              max,
              temp
            });
            setIsOpen(false)
          }}>Confirm</Button>
        </Row>
      </Form>
    </Modal>
  )
}

export default EditHP
