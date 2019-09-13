import React from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Select from '../atoms/Select';

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

  &::placeholder {
    color: rgba(255, 255, 255, .6);
  }
`

const SearchIcons = styled(Container)`
  height: 44px;
  font-size: 16px;
  font-weight: 300;
  line-height: 44px;
`

const Search = ({ bgStyle, ph, onSearch, value, onFilter, filters = [], currentFilter }) => {
  return (
    <SearchContainer direction='row' style={bgStyle}>
      <SearchInput placeholder={ph} spellcheck='false' value={value} onChange={onSearch} />
      <SearchIcons direction='row'>
        <Select value={currentFilter} options={filters} onChange={onFilter} />
      </SearchIcons>
    </SearchContainer>
  )
}

export default Search;