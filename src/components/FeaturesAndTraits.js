import React, { Component } from 'react';
import styled from 'styled-components';
import { mergeUpdates } from '../helpers';

import Container from '../atoms/Container';
import Button from '../atoms/Button';
import List from '../atoms/List';
import Feat from './Feat';

import Search from './Search';

const AddItem = styled(Button)`
  text-align: center;
`

class Feats extends Component {
  render() {
    const { char: { feats }, showAddFeat, showFeatInfo, update  } = this.props;

    const featdata = mergeUpdates(feats, update.feats || []);

    return (
      <Container height='calc(100% - 40px)' width='calc(100% - 40px)' padding='20px' direction='row'>
        <Container width='58.5%'>
          <Search ph='Search Features And Traits...' />

          <Container flowY='auto' height='calc(90% - 20px)' margin='10px 0'>
            <List>
              {
                featdata.map((feat, i) => {
                  return <Feat index={i} onClick={() => showFeatInfo(feat.id)}
                    key={feat.id} {...feat}
                  />
                })
              }
            </List>
          </Container>

          <AddItem onClick={showAddFeat}>Add Feat or Trait</AddItem>
        </Container>

      </Container>
    )
  }
}

export default Feats;