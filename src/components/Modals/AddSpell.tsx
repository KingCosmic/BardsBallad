import React, { Component } from 'react'
import styled from 'styled-components'

import Modal from './Modal'

import EditSpell from './EditSpell'

import ListSection from '../ListSection'
import SearchInput from '../Search'
import Spell from '../Character/SpellsTab/Spell'

import { spellDefaults } from '../../system/constants'
import srdSpells from '../../system/spells'

import { cloneDeep, merge } from 'lodash'

import { addSpell, generateID } from '../../services/db'

import { Spell as SpellType } from '../../types'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 10px;
  padding-bottom: 0;
  overflow-y: auto;
`

const List = styled.div`
  overflow-y: auto;
  margin: 10px 0;
`

const CreateSpell = styled.p`
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.green};
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 2em;
  padding: 7px 19px;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`

type Props = {
  isOpen: boolean
  setIsOpen(open: boolean): void
}

type State = {
  filter: string
  search: string
  limit: number
  isCreating: boolean
  spell: SpellType
}

const listFilter = (level: number) => (spell: SpellType) =>
  spell.level === level

class AddSpell extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      filter: 'ALL',
      search: '',
      limit: 25,
      isCreating: false,
      spell: cloneDeep(spellDefaults)
    }

    this.changeFilter = this.changeFilter.bind(this)
    this.setSearch = this.setSearch.bind(this)
    this.openSpell = this.openSpell.bind(this)
    this.showSpells = this.showSpells.bind(this)
    this.editSpell = this.editSpell.bind(this)
    this.onConfirm = this.onConfirm.bind(this)
  }

  changeFilter(filter: string) {
    this.setState({ filter })
  }

  setSearch(query: string) {
    this.setState({ search: query })
  }

  // change the modal to show a item for approval / customization
  // before adding it to the item list.
  openSpell(spell: SpellType) {
    if (spell)
      return this.setState({
        isCreating: true,
        spell: merge({}, spellDefaults, spell),
      })

    this.setState({
      isCreating: true,
      spell: cloneDeep(spellDefaults),
    })
  }

  showSpells() {
    this.setState({
      isCreating: false,
    })
  }

  editSpell(path: string, data: any) {
    this.setState({ spell: merge({}, this.state.spell, { [path]: data }) })
  }

  onConfirm() {
    addSpell(cloneDeep({ ...this.state.spell, id: generateID() }))
    .then(() => {
      this.props.setIsOpen(false)
      this.setState({
        search: '',
        isCreating: false,
        spell: cloneDeep(spellDefaults)
      })
    })
  }

  render() {
    const { isOpen, setIsOpen } = this.props

    const { isCreating, search } = this.state

    const filteredSrd = srdSpells
      .filter(spell => spell.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 25)

    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        {isCreating ? (
          <EditSpell
            showSpells={this.showSpells}
            confirm={this.onConfirm}
            editSpell={this.editSpell}
            spellData={this.state.spell}
          />
        ) : (
          <Container>
            <SearchInput
              onSearch={this.setSearch}
              value={search}
              ph="Search Spells..."
              bgStyle={{
                backgroundColor: '#72767D',
                boxShadow:
                  '0 2px 5px rgba(0, 0, 0, .2), 0 0 0 1px rgba(0, 0, 0, .1)',
              }}
            />

            <List>
              <ListSection
                title="Cantrips"
                data={filteredSrd}
                filter={listFilter(0)}
                Component={Spell}
                onClick={(spell) => this.openSpell(cloneDeep(spell))}
              />
              <ListSection
                title="First Level"
                data={filteredSrd}
                filter={listFilter(1)}
                Component={Spell}
                onClick={(spell) => this.openSpell(cloneDeep(spell))}
              />
              <ListSection
                title="Second Level"
                data={filteredSrd}
                filter={listFilter(2)}
                Component={Spell}
                onClick={(spell) => this.openSpell(cloneDeep(spell))}
              />
              <ListSection
                title="Third Level"
                data={filteredSrd}
                filter={listFilter(3)}
                Component={Spell}
                onClick={(spell) => this.openSpell(cloneDeep(spell))}
              />
              <ListSection
                title="Fourth Level"
                data={filteredSrd}
                filter={listFilter(4)}
                Component={Spell}
                onClick={(spell) => this.openSpell(cloneDeep(spell))}
              />
              <ListSection
                title="Fifth Level"
                data={filteredSrd}
                filter={listFilter(5)}
                Component={Spell}
                onClick={(spell) => this.openSpell(cloneDeep(spell))}
              />
              <ListSection
                title="Sixth Level"
                data={filteredSrd}
                filter={listFilter(6)}
                Component={Spell}
                onClick={(spell) => this.openSpell(cloneDeep(spell))}
              />
              <ListSection
                title="Seventh Level"
                data={filteredSrd}
                filter={listFilter(7)}
                Component={Spell}
                onClick={(spell) => this.openSpell(cloneDeep(spell))}
              />
              <ListSection
                title="Eigth Level"
                data={filteredSrd}
                filter={listFilter(8)}
                Component={Spell}
                onClick={(spell) => this.openSpell(cloneDeep(spell))}
              />
              <ListSection
                title="Nineth Level"
                data={filteredSrd}
                filter={listFilter(9)}
                Component={Spell}
                onClick={(spell) => this.openSpell(cloneDeep(spell))}
              />
            </List>
            <CreateSpell onClick={() => this.openSpell(cloneDeep(spellDefaults))}>&#43;</CreateSpell>
          </Container>
        )}
      </Modal>
    )
  }
}

export default AddSpell
