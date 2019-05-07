import React from 'react';

import InlineEdit from '../atoms/InlineEdit';

const CharacterClass = ({ job }) => {
  return (
    <InlineEdit height='1.3em' size='1em' margin='5px' path='job' value={job} />
  )
}

export default CharacterClass;