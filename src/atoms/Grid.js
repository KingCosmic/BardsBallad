import styled, { css } from 'styled-components';

import Container from './Container';

const Grid = styled(Container)`
  display: grid;
  ${props => props.rows && css` grid-template-rows: ${props => props.rows}; `}
  ${props => props.columns && css` grid-template-columns: ${props => props.columns}; `}
  ${props => props.area && css` grid-template-areas: ${props => props.area}; `}

  ${props => props.gap && css` grid-gap: ${props => props.gap}; `}
`

export default Grid;