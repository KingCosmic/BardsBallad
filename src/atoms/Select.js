import React from 'react';
import styled from 'styled-components';
import Text from './Text';

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: ${props => props.theme.middleblack};
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;

  p {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    cursor: pointer;

    &:hover {
      background-color: ${props => props.theme.grey};
    }
  }
`

const Dropdown = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${DropdownContent} {
    display: block;
  }
`

const Select = ({ value, options, onChange, multi = false }) => {
  return (
    <Dropdown>
      <Text>{value}</Text>
      <DropdownContent>
        {
          options.map(({ value, label }) => <Text onClick={() => onChange(value)}>{label}</Text>)
        }
      </DropdownContent>
    </Dropdown>
  )
}

export default Select;