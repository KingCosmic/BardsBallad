import React from 'react';
import styled, { css } from 'styled-components';

import { connect } from 'react-redux';
import { syncData } from '../reducers/characters';

import Con from '../atoms/Container';

const Container = styled(Con)`
  position: absolute;
  top: 10px;
  right: 10px;
`

const Save = styled.button`
  background-color: ${props => props.theme.green};
  border-radius: 2px;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  cursor: pointer;

  ${props => props.disabled && css` 
    box-shadow: none;
    opacity: 0.4;
    cursor: not-allowed;
  `}

  &:active {
    box-shadow: none;
  }
`

const DataOptions = (props) => {
  const { syncData, empty, data, id } = props; 

  return (
    <Container>
      <Save onClick={() => syncData(id, data)} disabled={empty}>Save</Save>
    </Container>
  )
}

const mapStateToProps = (state) => {
  const { empty, data } = state.characters.update
  const { _id } = state.characters.character

  return {
    empty,
    data,
    id: _id
  }
}

export default connect(mapStateToProps, { syncData })(DataOptions);