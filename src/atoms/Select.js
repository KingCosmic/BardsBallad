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
  cursor: pointer;
  min-width: 39px;
  justify-content: center;

  position: relative;
  display: inline-block;

  &:hover  ${DropdownContent} {
    display: block;
  }
`

const Value = styled(Text)`
  font-weight: 200;
`

const Select = (props) => {
  const { value, options, onChange, multi = false } = props;

  if (options.length === 0) return <Dropdown><Value>N/A</Value></Dropdown>;

  return (
    <Dropdown>
      <Value>{options.find(opt => opt.value === value).label}</Value>
      <DropdownContent onClick={(e) => e.stopPropagation()}>
        {
          options.map(({ value, label }, i) => <Value key={i} onClick={() => onChange(value)}>{label}</Value>)
        }
      </DropdownContent>
    </Dropdown>
  )
}

export default Select;