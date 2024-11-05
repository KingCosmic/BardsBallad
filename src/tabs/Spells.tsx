import { IonButton, IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList, IonNote, IonText, IonTitle } from '@ionic/react'
import { add } from 'ionicons/icons'
import { type CharacterData, JsonActionType, runJsonAction } from '../state/character'
import generateObject from '../utils/generateObject'
import findAllOfProperty from '../utils/findAllOfProperty'
import { openModal } from '../state/modals'
import Divider from '../components/Divider'

type TabProps = {
  character: CharacterData
}

function Spells({ character }: TabProps) {
  
  return (
    <>
      <div>
        {
          character.data.spellCastings.map((casting: any) => {
            return (
              <div>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                  <IonText>
                    <h1>
                      {casting.name}
                    </h1>
                  </IonText>

                  {/* <IonButton>Add</IonButton> */}
                </div>
                <Divider />
                <div
                  style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}
                  onClick={() => {
                    openModal({ title: 'Edit Casting', objData: casting,
                      onDelete: () => runJsonAction({
                        name: 'Remove Casting',
                        target: 'data/spellCastings',
                        type: JsonActionType.REMOVEITEM,
                        value: casting.name
                      }),
                      onSave: (data) => runJsonAction({
                        name: 'Update Casting',
                        target: `data/spellCastings/${casting.name}`,
                        type: JsonActionType.OVERRIDE,
                        value: data
                      })
                    })
                  }}
                >
                  <div>
                    <IonText>ability</IonText>
                    <br />
                    <IonText>
                      <p>{casting.ability}</p>
                    </IonText>
                  </div>
                  <div>
                    <IonText>save dc</IonText>
                    <br />
                    <IonText>
                      <p>{casting.save}</p>
                    </IonText>
                  </div>
                  <div>
                    <IonText>att bonus</IonText>
                    <br />
                    <IonText>
                      <p>{casting.attackBonus}</p>
                    </IonText>
                  </div>
                </div>
                {
                  casting.spellSlots.map((slots: any) => {
                    const spells = casting.spells.filter((spell: any) => spell.level === slots.name)

                    return (
                      <div>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                          <IonText>
                            <h3>
                              {slots.name}
                            </h3>
                          </IonText>

                          <IonText>
                            <p>
                              {slots.current} / {slots.max}
                            </p>
                          </IonText>
                        </div>
                        <Divider />
                        {
                          spells.map((spell: any) => {
                            return (
                              <IonItem>
                                <IonText slot='start'>
                                  <p>{spell.name}</p>
                                </IonText>
                                <IonText>
                                  <p>
                                    {spell.type} ({spell.components})
                                  </p>
                                </IonText>
                              </IonItem>
                            )
                          })
                        }
                      </div>
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>

      <IonFab slot='fixed' vertical='bottom' horizontal='end'>
        <IonFabButton onClick={() => {
          runJsonAction({
            name: 'Add Spell Casting', target: 'data/spellCastings', type: JsonActionType.ADDITEM,
            value: generateObject(character.system.types.find(type => type.name === 'SpellCasting')!)
          })}
        }>
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
    </>
  )
}

export default Spells