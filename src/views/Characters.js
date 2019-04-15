import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { loadAll, createCharacter } from '../reducers/characters';
import { startCharacterCreation, changeCharacterCreationStage } from '../reducers/ui';

import Container from '../atoms/Container';

import CharacterCreation from '../components/CharacterCreation';
import Character from '../components/Character';

const AddCharacter = styled.div`
  position: absolute;
  bottom: 15px;
  right: 15px;

  background-color: ${props => props.theme.green};
  border-radius: 3px;
  outline: none;
  border: none;
  color: ${props => props.theme.text};
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);

  &:active {
    box-shadow: none;
  }
`

class Characters extends Component {

  componentWillMount() {

    if (!this.props.loaded) this.props.loadAll()

  }

  render() {

    const { characters, createCharacter, creatingCharacter, creationStage,
      startCharacterCreation, changeCharacterCreationStage
    } = this.props;

    console.log(creatingCharacter)

    if (creatingCharacter) {
      return (
        <CharacterCreation stage={creationStage} changeStage={changeCharacterCreationStage} />
      )
    }

    return (
      <Container width='100%' height='100%'>
        {

          (characters.length === 0) ?

          null :

          characters.map(character => {
            const { name, job, lvl } = character
  
            return <Character key={character._id} name={name} job={job} lvl={lvl} character={character} id={character._id} />
          })
        }

        <AddCharacter onClick={createCharacter}>Add Character</AddCharacter>
      </Container>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    characters: state.characters.characters,
    loaded: state.characters.loaded,
    creatingCharacter: state.ui.creatingCharacter,
    creationStage: state.ui.creationStage
  }
}


export default withRouter(connect(mapStateToProps, { loadAll, createCharacter, startCharacterCreation, changeCharacterCreationStage })(Characters));