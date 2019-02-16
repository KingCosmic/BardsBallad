import styled, { css } from 'styled-components';

const Text = styled.p`
  color: ${props => props.theme[props.color] || props.theme.text};
  ${props => props.size && css` font-size: ${props => props.size}; `}
  font-weight: ${props => props.weight || '500'};

  ${props => props.align && css` text-align: ${props => props.align}; `}
  ${props => props.lineHeight && css` line-height: ${props => props.lineHeight}; `}

  margin: ${props => props.margin || 0};
  ${props => props.float && css` float: ${props => props.float}; `}
`

export default Text;