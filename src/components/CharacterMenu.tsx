import { IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonButton, IonItem, IonText, IonNote } from '@ionic/react'
import { characterState, JsonActionType, runJsonAction } from '../state/character'
import generateObject from '../utils/generateObject'
import { openModal } from '../state/modals'
import useBreakpoint from '../utils/useBreakpoint'

const CharacterMenu = () => {

  const character = characterState.useValue()

  const isLargeScreen = useBreakpoint('md', 'more')

  if (!character) return <></>

  return (
    <IonMenu menuId='info-menu' side='end' contentId='main' type='overlay' style={{ maxWidth: isLargeScreen ? '10%' : '' }}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Extras</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>

        <IonNote>
          These things will move to a better area to accomodate them, but for the time being they're going here.
        </IonNote>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <IonTitle>HitDice</IonTitle>
          <IonButton onClick={() =>
            runJsonAction({
              name: 'Add HitDie', target: 'data/hitdice', type: JsonActionType.ADDITEM,
              value: generateObject(character.system.types.find(type => type.name === 'HitDie')!)
            })}>
            Add
          </IonButton>
        </div>
        <IonList inset={true}>
          {
            character.data.hitdice.map((dice: any) => {
              return (
                <IonItem color='medium' button={true} onClick={() => {
                  openModal({ title: 'Edit HitDie', objData: dice,
                    onDelete: () => runJsonAction({
                      name: 'Remove HitDie',
                      target: 'data/hitdice',
                      type: JsonActionType.REMOVEITEM,
                      value: dice.name
                    }),
                    onSave: (init) => runJsonAction({
                      name: 'Update HitDie',
                      target: `data/hitdice/${dice.name}`,
                      type: JsonActionType.OVERRIDE,
                      value: init
                    })
                  })
                }}>
                  <IonText slot='start'>{dice.name}</IonText>
                  <IonText>{dice.value}</IonText>
                </IonItem>
              )
            })
          }
        </IonList>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <IonTitle>Speeds</IonTitle>
          <IonButton onClick={() =>
            runJsonAction({
              name: 'Add Speed', target: 'data/speeds', type: JsonActionType.ADDITEM,
              value: generateObject(character.system.types.find(type => type.name === 'Speed')!)
            })}>
            Add
          </IonButton>
        </div>
        <IonList inset={true}>
          {
            character.data.speeds.map((spd: any) => {
              return (
                <IonItem color='medium' button={true} onClick={() => {
                  openModal({ title: 'Edit Speed', objData: spd,
                    onDelete: () => runJsonAction({
                      name: 'Remove Speed',
                      target: 'data/speeds',
                      type: JsonActionType.REMOVEITEM,
                      value: spd.name
                    }),
                    onSave: (init) => runJsonAction({
                      name: 'Update Speed',
                      target: `data/speeds/${spd.name}`,
                      type: JsonActionType.OVERRIDE,
                      value: init
                    })
                  })
                }}>
                  <IonText slot='start'>{spd.name}</IonText>
                  <IonText>{spd.value}</IonText>
                </IonItem>
              )
            })
          }
        </IonList>

        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
          <IonTitle>proficiencies</IonTitle>
          <IonButton onClick={() =>
            runJsonAction({
              name: 'Add Proficiencies', target: 'data/proficiencies', type: JsonActionType.ADDITEM,
              value: generateObject(character.system.types.find(type => type.name === 'Proficiency')!)
            })}>
            Add
          </IonButton>
        </div>
        <IonList inset={true}>
          {
            character.data.proficiencies.map((prof: any) => {
              return (
                <IonItem color='medium' button={true} onClick={() => {
                  openModal({ title: 'Edit proficiency', objData: prof,
                    onDelete: () => runJsonAction({
                      name: 'Remove proficiency',
                      target: 'data/proficiencies',
                      type: JsonActionType.REMOVEITEM,
                      value: prof.name
                    }),
                    onSave: (init) => runJsonAction({
                      name: 'Update proficiency',
                      target: `data/proficiencies/${prof.name}`,
                      type: JsonActionType.OVERRIDE,
                      value: init
                    })
                  })
                }}>
                  <IonText slot='start'>{prof.name}</IonText>
                  <IonText>{prof.value}</IonText>
                </IonItem>
              )
            })
          }
        </IonList>
      </IonContent>
    </IonMenu>
  )
}

export default CharacterMenu