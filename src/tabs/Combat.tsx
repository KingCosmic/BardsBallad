import { IonButton, IonItem, IonLabel, IonList, IonText, IonTitle, IonToolbar } from '@ionic/react'
import { type CharacterData, JsonActionType, runJsonAction } from '../state/character'
import { useState } from 'react'
import { openModal } from '../state/modals'
import findAllOfProperty from '../utils/findAllOfProperty'
import generateObject from '../utils/generateObject'

type TabProps = {
  character: CharacterData
}

function Combat({ character }: TabProps) {
  // TODO: Make Hit Points, and Initiative editable.
  // Make Armor class work with modifers from equipped armor and other things.

  // TODO: grab all conditions (condition properties from items, modifers, etc.) and combine with custom conditions on player data.
  // TODO: Do the same for Actions, Bonus Actions, and Reactions.

  
  const allConditions = findAllOfProperty(character.data, 'conditions', 'data')
  const allActions = findAllOfProperty(character.data, 'actions', 'data')
  const allBonusActions = findAllOfProperty(character.data, 'bonusActions', 'data')
  const allReactions = findAllOfProperty(character.data, 'reactions', 'data')

  function getMaxExp(exp: number) {
    for (let key in character.system.customData.exp) {
      if (exp >= +key) continue

      return key
    }

    return 0
  }


  return (
    <>
      <IonList inset={true}>
        <IonItem button={true} onClick={() => {
          openModal({ title: 'Edit Health', objData: character.data.health,
            onSave: (health) => runJsonAction({
              name: 'Update Health',
              target: 'data/health',
              type: JsonActionType.OVERRIDE,
              value: health
            })
          })
        }}>
          <IonText slot='start'>Hit Points</IonText>
          <IonText>{character.data.health.current + character.data.health.temp} / {character.data.health.max} {character.data.health.temp ? `(+${character.data.health.temp})` : ''}</IonText>
        </IonItem>

        <IonItem button={true} onClick={() => {
          openModal({ title: 'Edit Expierence', objData: character.data.exp,
            onSave: (health) => runJsonAction({
              name: 'Update Health',
              target: 'data/health',
              type: JsonActionType.OVERRIDE,
              value: health
            })
          })
        }}>
          <IonText slot='start'>Expierence</IonText>
          <IonText>{character.data.exp} / {getMaxExp(character.data.exp)}</IonText>
        </IonItem>

        <IonItem button={true} onClick={() => {
          openModal({ title: 'Edit AC', objData: character.data.armorClass,
            onSave: (init) => runJsonAction({
              name: 'Update AC',
              target: 'data/armorClass',
              type: JsonActionType.OVERRIDE,
              value: init
            })
          })
        }}>
          <IonText slot='start'>Armor Class</IonText>
          <IonText>{character.data.armorClass.value}</IonText>
        </IonItem>

        <IonItem button={true} onClick={() => {
          openModal({ title: 'Edit Initiative', objData: character.data.initiative,
            onSave: (init) => runJsonAction({
              name: 'Update Initiative',
              target: 'data/initiative',
              type: JsonActionType.OVERRIDE,
              value: init
            })
          })
        }}>
          <IonText slot='start'>Initiative</IonText>
          <IonText>{(character.data.initiative.value > 0) ? '+' : ''}{character.data.initiative.value}</IonText>
        </IonItem>
      </IonList>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <IonTitle>Conditions</IonTitle>
        <IonButton onClick={() =>
          runJsonAction({
            name: 'Add Condition', target: 'data/conditions', type: JsonActionType.ADDITEM,
            value: generateObject(character.system.types.find(type => type.name === 'Condition')!)
          })}>
          Add
        </IonButton>
      </div>
      <IonList inset={true}>
        {
          allConditions.map(({ path, val: cond }) => {
            return (
              <IonItem button={true} onClick={() => {
                openModal({ title: 'Edit Condition', objData: cond,
                  onDelete: () => runJsonAction({
                    name: 'Remove Condition',
                    target: path,
                    type: JsonActionType.REMOVEITEM,
                    value: cond.name
                  }),
                  onSave: (data) => runJsonAction({
                    name: 'Update Condition',
                    target: `${path}/${cond.name}`,
                    type: JsonActionType.OVERRIDE,
                    value: data
                  })
                })
              }}>
                <IonLabel>{cond.name}</IonLabel>
              </IonItem>
            )
          })
        }
      </IonList>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <IonTitle>Actions</IonTitle>
        <IonButton onClick={() =>
          runJsonAction({
            name: 'Add Action', target: 'data/actions', type: JsonActionType.ADDITEM,
            value: generateObject(character.system.types.find(type => type.name === 'Action')!)
          })}>
          Add
        </IonButton>
      </div>
      <IonList inset={true}>
        {
          allActions.map(({ path, val: action }) => {
            return (
              <IonItem button={true} onClick={() => {
                openModal({ title: 'Edit Action', objData: action,
                  onDelete: () => runJsonAction({
                    name: 'Remove Action',
                    target: path,
                    type: JsonActionType.REMOVEITEM,
                    value: action.name
                  }),
                  onSave: (data) => runJsonAction({
                    name: 'Update Action',
                    target: `${path}/${action.name}`,
                    type: JsonActionType.OVERRIDE,
                    value: data
                  })
                })
              }}>
                <IonLabel>{action.name}</IonLabel>
              </IonItem>
            )
          })
        }
      </IonList>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <IonTitle>Bonus Actions</IonTitle>
        <IonButton onClick={() =>
          runJsonAction({
            name: 'Add Bonus Action', target: 'data/bonusActions', type: JsonActionType.ADDITEM,
            value: generateObject(character.system.types.find(type => type.name === 'BonusAction')!)
          })}>
          Add
        </IonButton>
      </div>
      <IonList inset={true}>
        {
          allBonusActions.map(({ path, val: bAction }) => {
            return (
              <IonItem button={true} onClick={() => {
                openModal({ title: 'Edit Bonus Action', objData: bAction,
                  onDelete: () => runJsonAction({
                    name: 'Remove Bonus Action',
                    target: path,
                    type: JsonActionType.REMOVEITEM,
                    value: bAction.name
                  }),
                  onSave: (data) => runJsonAction({
                    name: 'Update Bonus Action',
                    target: `${path}/${bAction.name}`,
                    type: JsonActionType.OVERRIDE,
                    value: data
                  })
                })
              }}>
                <IonLabel>{bAction.name}</IonLabel>
              </IonItem>
            )
          })
        }
      </IonList>

      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
        <IonTitle>Reactions</IonTitle>
        <IonButton onClick={() =>
          runJsonAction({
            name: 'Add Reaction', target: 'data/reactions', type: JsonActionType.ADDITEM,
            value: generateObject(character.system.types.find(type => type.name === 'Reaction')!)
          })}>
          Add
        </IonButton>
      </div>
      <IonList inset={true}>
      {
          allReactions.map(({ path, val: react }) => {
            return (
              <IonItem button={true} onClick={() => {
                openModal({ title: 'Edit Reaction', objData: react,
                  onDelete: () => runJsonAction({
                    name: 'Remove Reaction',
                    target: path,
                    type: JsonActionType.REMOVEITEM,
                    value: react.name
                  }),
                  onSave: (data) => runJsonAction({
                    name: 'Update Reaction',
                    target: `${path}/${react.name}`,
                    type: JsonActionType.OVERRIDE,
                    value: data
                  })
                })
              }}>
                <IonLabel>{react.name}</IonLabel>
              </IonItem>
            )
          })
        }
      </IonList>
    </>
  )
}

export default Combat