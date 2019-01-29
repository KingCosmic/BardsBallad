import React from 'react';
import styled, { css } from 'styled-components';

import { Link } from "react-router-dom";
import Text from '../atoms/Text';

const Container = styled(Link)`
  ${props => props.width && css` width: ${props => props.width}; `}
  ${props => props.height && css` height: ${props => props.height}; `}
  ${props => props.maxHeight && css` max-height: ${props => props.maxHeight}; `}
  ${props => props.maxWidth && css` max-width: ${props => props.maxWidth}; `}

  ${props => props.float && css` float: left; `};

  display: ${props => props.noFlex ? 'block' : 'flex'};
  flex-direction: ${props => props.direction || 'column'};
  ${props => props.bases && css` flex-basis: ${props => props.bases}; `}
  ${props => props.justifyContent && css` justify-content: ${props => props.justifyContent}; `}
  ${props => props.alignItems && css` align-items: ${props => props.alignItems}; `}
  ${props => props.alignSelf && css` align-self: ${props => props.alignSelf}; `}

  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};

  ${props => props.grow && css` flex-grow: ${props.grow}; `}

  ${props => props.bg && css`
    background-color: ${(props) => props.theme.dark};
    outline: 1px solid ${(props) => props.theme.almostblack};
  `}
`

const Character = (props) => {
  const { name, job, lvl, id } = props;

  return (
    <Container to={`/characters/${id}`} width='calc(32% - 20px)' padding='10px' bg>
      <Text>{name}</Text><Text>{job}: {lvl}</Text>
    </Container>
  )
}

export default Character;