import React from 'react';

import InlineEdit from '../atoms/InlineEdit';

const CharacterName = ({ name }) => {
  return (
    <InlineEdit height='1.3em' size='1.2em' color='gold' margin='5px' path='name' value={name} />
  )
}

export default CharacterName;