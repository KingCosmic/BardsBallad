import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background: ${props => props.theme.sidebars};
  padding: 10px;
`

const Item = styled.p`
  padding: 5px;
  border-radius: 4px;
  margin: 0 5px;
  color: white;
  cursor: pointer;
`

const Delete = styled(Item)`
  border: 1px solid #E32428;
  color: #E32428;
  transition: .5s;

  &:hover {
    background: #E32428;
    color: white;
  }
`

const Edit = styled(Item)`
  background: #3944BC;
  padding: 5px 10px;
`

type Props = {
  deleteClick(): void
  closeClick(): void
  editClick(): void
}

function ItemOptions(props: Props) {
  const { deleteClick, closeClick, editClick } = props

  return (
    <Container>
      <Delete onClick={deleteClick}>Delete Item</Delete>
      <div style={{ display: 'flex' }}>
        <Item onClick={closeClick}>Close</Item>
        <Edit onClick={editClick}>Edit</Edit>
      </div>
    </Container>
  )
}

export default ItemOptions