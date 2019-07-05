import React, { Component } from 'react';
import styled from 'styled-components';

import Container from '../../atoms/Container';

import Search from './Search';
import EditFeat from './EditFeat';

const BackDrop = styled(Container)`
  width: 30%;
  height: 80%;
  border-radius: 8px;
  background-color: ${props => props.theme.dark};
  box-shadow: 0 2px 10px rgba(0, 0, 0, .2), 0 0 0 1px rgba(28, 36, 43 .6);
  padding: 20px;
`

class AddFeature extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      currentFilter: 'ALL',
      limit: 25,
      creatingFeat: false,
      featInfo: {},
    }

    this.onFilter = this.onFilter.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.openFeat = this.openFeat.bind(this)
    this.showFeats = this.showFeats.bind(this)
  }

  onFilter(value) {
    this.setState({ currentFilter: value })
  }

  onSearch(event) {
    this.setState({ search: event.target.value })
  }

  openFeat(feat) {
    if (feat) return this.setState({ creatingFeat: true, featInfo: feat })

    this.setState({
      creatingFeat: true
    })
  }

  showFeats() {
    this.setState({
      creatingFeat: false
    })
  }

  render() {
    const { search, limit, creatingFeat, currentFilter, featInfo } = this.state;
    const { addFeat } = this.props;

    return (
      <BackDrop onMouseDown={(e) => e.stopPropagation()}>
        {
          (creatingFeat === false) ? <Search onSearch={this.onSearch} search={search} limit={limit} openFeat={this.openFeat} currentFilter={currentFilter} onFilter={this.onFilter} /> :
            <EditFeat featInfo={featInfo} addFeat={addFeat} goBack={this.showFeats} changeFeat={this.changeFeat} />
        }
      </BackDrop>
    )
  }
}

export default AddFeature;