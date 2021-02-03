import React from 'react'
import styled from 'styled-components'

import Select from '../../../components/Select'

const Input = styled.input`
  background-color: transparent;
  margin: 0;
  padding: 0;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  font-size: 1em;
  font-weight: 200;
  font-family: 'OpenSans';

  &::placeholder {
    color: #8e9297;
  }
`

const Title = styled.p`
  color: ${props => props.theme.gold};
  font-size: 1.2em;
`

type PropertyProps = {
  full: boolean
}

const PropertyContainer = styled.div<PropertyProps>`
  display: flex;
  flex-direction: column;
  margin: 5px;
  width: calc(${props => props.full ? '100%' : '50%'} - 10px);
  border-bottom: 1px solid grey;
`

type Props = {
  title:string,
  value:string | number,
  placeholder?:string | number,
  type?:string,
  options?:any,
  multi?:boolean,
  full?:boolean,
  callback(v:any):any
}

function Property(props:Props) {
  const { title, value, placeholder, type, options, multi = false, full = false, callback } = props;

  return (
    <PropertyContainer full={full}>
      <Title>{title}</Title>

      {
        (type && type === 'select') ?
          <Select value={value as string} options={options} multi={multi} onChange={callback} /> :
          <Input type={type ? type : 'text'} placeholder={placeholder as string} value={value} onChange={({ target: { value } }) => callback(value)} />
      }
    </PropertyContainer>
  )
}

export default Property