import React from 'react';
import styled from 'styled-components';

import { ReactComponent as Delete } from '../assets/delete.svg';
import { ReactComponent as Edit } from '../assets/edit.svg';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`

function ItemOptions({ deleteClick, editClick }) {
  return (
    <Container>
      <Delete style={{ width: '2em', height: '2em' }} onClick={deleteClick} />
      <Edit style={{ width: '2em', height: '2em' }} onClick={editClick} />
    </Container>
  )
}

export default ItemOptions;