import React from 'react';

import Button from './Button';

const buttonStyles = 'text-white align-center justify-center w-full p-1'

const Button = (props) => {
  return (
    <Button className={`${extraStyles} ${buttonStyles}`} {...props}>
      {props.children}
    </Button>
  )
}

export default Button;