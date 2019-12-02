import React from 'react';

import Input from './Input';

const inputStyles = 'bg-dark text-white w-11/12 text-center outline-none border-0';

const StatContainer = (props) => {
  return (
    <Input {...props} extraStyles={inputStyles} />
  )
}

export default StatContainer;