import React from 'react';
import styled, { css } from 'styled-components';

import Container from '../atoms/Container';
import Text from '../atoms/Text';

// wasnt sure about the box shadow or not
// box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, .1);
const SearchContainer = styled(Container)`
  background-color: rgba(114, 118, 125, .3);
  border-radius: 5px;
`

const SearchInput = styled.input`
  flex-grow: 1;
  background: transparent;
  border: 1px solid black;

  height: 44px;
  font-size: 16px;
  font-weight: 200;
  font-family: OpenSans;

  color: white;
  border: none;
  outline: none;

  padding: 0 12px;
  box-shadow: none;

  ${props => props.ph && css`
    &::placeholder {
      color: ${props => props.ph};
    }
  `}
`

const DropDownContent = styled(Container)`
  display: none;
  position: absolute;
  background-color: black;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, .2);
  padding: 12px 16px;
  z-index: 1;
`

const SearchIcons = styled(Container)`
  height: 44px;
  font-size: 16px;
  font-weight: 300;
  line-height: 44px;
`

const DropDown = styled(Container)`
  min-width: 39px;
  border-left: 1px solid ${props => props.theme.grey};
  justify-content: center;

  position: relative;
  display: inline-block;
  padding: 0 10px;

  &:hover ${DropDownContent} {
    display: flex;
  }
`

const Search = ({ bgStyle, ph, onSearch, value }) => {
  return (
    <SearchContainer direction='row' style={bgStyle}>
      <SearchInput placeholder='Search...' spellcheck='false' ph={ph} value={value} onChange={onSearch} />
      <SearchIcons direction='row'>
        <DropDown>
          <Text align='center'>All</Text>
          <DropDownContent>
            <Text>Testing</Text>
          </DropDownContent>
        </DropDown>
      </SearchIcons>
    </SearchContainer>
  )
}

export default Search;