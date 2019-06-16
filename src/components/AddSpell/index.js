import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../../atoms/Container';

import EditSpell from './EditSpell';
import Search from './Search';

const BackDrop = styled(Container)`
  width: ${props => props.creating ? '30%' : '35%'};
  height: 80%;
  border-radius: 8px;
  background-color: ${props => props.theme.dark};
  box-shadow: 0 2px 10px rgba(0, 0, 0, .2), 0 0 0 1px rgba(28, 36, 43 .6);
  padding: 20px;
`

class AddSpell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'ALL',
      search: '',
      limit: 25,
      creatingSpell: false
    }

    this.changeFilter = this.changeFilter.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.openSpell = this.openSpell.bind(this)
    this.showSpells = this.showSpells.bind(this)
  }

  changeFilter(filter) {
    this.setState({ filter })
  }

  onSearch(event) {
    this.setState({ search: event.target.value })
  }

  // change the modal to show a item for approval / customization
  // before adding it to the item list.
  openSpell(spell) {
    if (spell) return this.setState({ creatingSpell: true, spellInfo: { ...this.state.spellInfo, ...spell } })

    this.setState({
      creatingSpell: true
    })
  }

  showSpells() {
    this.setState({
      creatingSpell: false
    })
  }

  render() {
    const { search, filter, limit, creatingSpell, spellInfo } = this.state;
    const { addSpell } = this.props;

    return (
      <BackDrop onMouseDown={(e) => e.stopPropagation()} creating={creatingSpell}>
        {
          (creatingSpell === false) ? <Search onSearch={this.onSearch} search={search} limit={limit} openSpell={this.openSpell} filter={filter} changeFilter={this.changeFilter} /> :
            <EditSpell spellInfo={spellInfo} addSpell={addSpell} goBack={this.showSpells} changeSpell={this.changeSpell} />
        }
      </BackDrop>
    )
  }
}

export default AddSpell;