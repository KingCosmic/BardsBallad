import React from 'react';
import styled from 'styled-components';


const SelectContainer = styled.select`
  color: ${props => props.theme.text};
  border: none;
  background: transparent;
  font-size: 1em;
`


const Select = (props) => {
  const { value, options, multi = false, onChange } = props;

  return (
    <SelectContainer onChange={({ target: { value } }) => onChange(value)} defaultValue={value} multiple={multi}>
      {
        options.map(({ value, label }, i) => <option value={value}>{label}</option>)
      }
    </SelectContainer>
  )
}

export default Select;