import React from 'react';

const containerStyles = 'flex flex-col w-1/3 p-1 cursor-pointer bg-dark hover:bg-almostblack outline-almostblack';

const StatContainer = (props) => {
  const { extraStyles = '' } = props;

  return (
    <div {...props} className={`${extraStyles} ${containerStyles}`}>
      {props.children}
    </div>
  )
}

export default StatContainer;