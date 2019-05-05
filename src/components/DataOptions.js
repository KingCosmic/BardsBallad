import React from 'react';
import styled from 'styled-components';

import Button from '../atoms/Button';
import Con from '../atoms/Container';

import { connect } from 'react-redux';
import { syncData } from '../reducers/characters';

const Container = styled(Con)`
  position: absolute;
  top: 10px;
  right: 10px;
`

const DataOptions = (props) => {
  const { syncData, empty, data, id } = props; 

  return (
    <Container>
      <Button onClick={() => syncData(id, data)} disabled={empty} width='50px'>Save</Button>
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