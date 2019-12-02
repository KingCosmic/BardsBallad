import React, { Component } from 'react';
import styled from 'styled-components';

import { FaArrowLeft, FaCheck } from 'react-icons/fa'

import EditFeature from './EditFeature';
import Header from '../../components/Header';
import Search from './Search';

import { cloneDeep, merge, mergeUpdates } from '../../helpers';

import { featDefaults } from '../../data/constants';

import nanoid from 'nanoid/generate';
import lowercased from 'nanoid-dictionary/lowercase';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 60px 0 15px;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  width: 100%;

  border: 1px solid ${props => props.theme.middleblack};
  background-color: ${props => props.theme.dark};
  box-shadow: 0 2px 10px rgba(0, 0, 0, .2), 0 0 0 1px rgba(28, 36, 43 .6);

  @media only screen and (min-width: 768px) {
    padding: 0;
  }
`

const BackButton = styled(FaArrowLeft)`
  color: ${props => props.theme.text};
  font-size: 30px;
  height: 60px;
`

const ConfirmButton = styled(FaCheck)`
  color: ${props => props.theme.green};
  font-size: 30px;
  height: 60px;
`

class AddFeature extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'ALL',
      search: '',
      limit: 25,
      creatingFeat: false,
      feat: cloneDeep(featDefaults)
    }

    this.changeFilter = this.changeFilter.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.openFeat = this.openFeat.bind(this)
    this.showFeats = this.showFeats.bind(this)
    this.editFeat = this.editFeat.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
  }

  changeFilter(filter) {
    this.setState({ filter })
  }

  onSearch(event) {
    this.setState({ search: event.target.value })
  }

  // change the modal to show a item for approval / customization
  // before adding it to the item list.
  openFeat(feat) {
    if (feat) return this.setState({ creatingFeat: true, feat: merge({}, featDefaults, feat) })

    this.setState({
      creatingFeat: true,
      feat: cloneDeep(featDefaults)
    })
  }

  showFeats() {
    this.setState({
      creatingFeat: false
    })
  }

  editFeat(path, data) {
    this.setState({ feat: merge({}, this.state.feat, { [path]: data }) })
  }

  onConfirm() {
    const { requestClose, syncData, characterID } = this.props;

    const id = nanoid(lowercased, 24)

    requestClose()
    syncData(
      characterID,
      {
        feats: mergeUpdates(this.props.feats, [{ ...this.state.feat, id, new: true }])
      }
    )
  }

  render() {
    const { search, filter, limit, creatingFeat } = this.state;
    const { requestClose } = this.props;

    return (
      <Container onMouseDown={(e) => e.stopPropagation()}>
        <Header title={creatingFeat ? 'Edit Feat' : 'Add Feat'}
          LeftComponent={BackButton} leftClick={creatingFeat ? this.showFeats : requestClose}
          RightComponent={creatingFeat ? ConfirmButton : undefined}
          rightClick={this.onConfirm}
          bgStyles={{ position: 'static', zIndex: 60 }}
        />
        <Search openFeat={this.openFeat} onSearch={this.onSearch} search={search} limit={limit} filter={filter} changeFilter={this.changeFilter} /> :
        <EditFeature showFeats={this.showFeats} confirm={this.onConfirm} featData={this.state.feat} editFeat={this.editFeat} creatingFeat={creatingFeat} />
      </Container>
    )
  }
}

export default AddFeature;