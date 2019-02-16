import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../atoms/Container';
import Title from '../atoms/Title';
import Text from '../atoms/Text';
import List from '../atoms/List';
import Feat from './Feat';
import { render } from 'react-dom';

import { connect } from 'react-redux';
import { addFeat } from '../reducers/characters';

const AddFeat = styled(Text)`
  position: absolute;
  right: 10px;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.gold};
  }

  line-height: calc(10px + 1em);
`

const type = {
  name: 'string',
  uses: 'number',
  description: 'string'
}

class Feats extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing: ''
    }

    this.toggleEditing = this.toggleEditing.bind(this);
    this.renderItemOrEditField = this.renderItemOrEditField.bind();
  }

  toggleEditing(index) {
    this.setState({ editing: index })
  }

  renderItemOrEditField(item, i) {
    const { name, uses, description } = item;

    if (this.state.editing === i) {
      return (
        <Container>
  
        </Container>
      )
    }

    return <Feat
      key={i} name={name} uses={uses} description={description}
      onClick={() => this.toggleEditing(id)}
    />
  }

  render() {
    const { feats, addFeat } = this.props;

    return (
      <Container pos='relative' height='100%' width='70%' margin='0 0 0 20px' alignItems='center' bg ol>
        <Container width='100%' alignItems='center' bg ol>
          <Title margin='5px' size='1em'>Feats</Title>

          <AddFeat onClick={addFeat}>Add Feat</AddFeat>
        </Container>

        <List flowY='auto' height='100%' width='100%'>
          {
            feats.map((feat, i) => {
              return this.renderItemOrEditField(feat, i)
            })
          }
        </List>

      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    feats: state.characters.character.feats
  }
}

export default connect(mapStateToProps, { addFeat })(Feats);