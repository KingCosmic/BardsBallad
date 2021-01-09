import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
`

const SearchContainer = styled(Container)`
  background-color: rgba(114, 118, 125, 0.3);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`

const SearchInput = styled.input<{ spellcheck: string }>`
  width: 100%;
  background: transparent;
  border: 1px solid black;

  height: 44px;
  font-size: 1.2em;
  font-weight: 200;
  font-family: OpenSans;

  color: white;
  border: none;
  outline: none;

  padding: 0 12px;
  box-shadow: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`

const SearchIcons = styled(Container)`
  height: 44px;
  font-size: 16px;
  font-weight: 300;
  line-height: 44px;
`

const Select = styled.select`
  appearance: none;
  padding: 0 15px;
  background-color: rgba(32, 34, 37, 0.3);
  font-size: 1.2em;
  color: ${props => props.theme.text};
  font-family: OpenSans;
  font-weight: 200;
  outline: none;
  border: none;
`

type Props = {
  onSearch(val: string): void
  value: string
  ph: string
  bgStyle: object
}

function Search(props: Props) {
  const { bgStyle, ph, onSearch, value } = props

  return (
    <SearchContainer style={bgStyle}>
      <SearchInput
        placeholder={ph}
        spellcheck="false"
        value={value}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => onSearch(event.target.value)}
      />
      <SearchIcons>
        <Select>
          <option>ALL</option>
        </Select>
      </SearchIcons>
    </SearchContainer>
  )
}

export default Search
