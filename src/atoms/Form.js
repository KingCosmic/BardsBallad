import styled, { css } from 'styled-components';

const Form = styled.form`
  ${props => props.width && css` width: ${props => props.width}; `}
  ${props => props.height && css` height: ${props => props.height}; `}
  ${props => props.maxHeight && css` max-height: ${props => props.maxHeight}; `}
  ${props => props.maxWidth && css` max-width: ${props => props.maxWidth}; `}
    
  display: ${props => props.noFlex ? 'block' : 'flex'};
  flex-direction: ${props => props.direction || 'column'};
  ${props => props.bases && css` flex-basis: ${props => props.bases}; `}
  ${props => props.justifyContent && css` justify-content: ${props => props.justifyContent}; `}
  ${props => props.alignItems && css` align-items: ${props => props.alignItems}; `}
  ${props => props.alignSelf && css` align-self: ${props => props.alignSelf}; `}

  margin: ${props => props.margin || 0};
  padding: ${props => props.padding || 0};
`

export default Form;