import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol, IonFab, IonFabButton, IonFabList, IonGrid, IonIcon, IonItem, IonLabel, IonList, IonNote, IonRow, IonSearchbar, IonText, IonTitle } from '@ionic/react'
import { add, chevronUpCircle } from 'ionicons/icons'
import { type CharacterData, JsonActionType, runJsonAction } from '../state/character'
import { useState } from 'react'
import EditObjectModal from '../modals/EditObjectModal'
import generateObject from '../utils/generateObject'
import { openModal } from '../state/modals'
import Divider from '../components/Divider'

type TabProps = {
  character: CharacterData
}

const getMod = (val?:number) => (val !== undefined) ? Math.floor((val - 10) / 2) : 0

function Skills({ character }: TabProps) {
  
  const [statData, setStatData] = useState<any>(null)
  const [savingThrowData, setSavingThrowData] = useState<any>(null)
  const [skillData, setSkillData] = useState<any>(null)
  
  return (
    <>
      <EditObjectModal title='Edit Stat'
        onDelete={() => runJsonAction({
          name: 'Delete Stat',
          target: 'data/stats',
          type: JsonActionType.REMOVEITEM,
          value: statData.name
        })}
        onSave={(item) => runJsonAction({
          name: 'Update Stat',
          target: `data/stats/${statData.name}`,
          type: JsonActionType.OVERRIDE,
          value: item
        })}
        isVisible={(statData !== null)} requestClose={() => setStatData(null)} data={statData}
      />

      <EditObjectModal title='Edit SavingThrow'
        onDelete={() => runJsonAction({
          name: 'Delete SavingThrow',
          target: 'data/savingThrows',
          type: JsonActionType.REMOVEITEM,
          value: savingThrowData.name
        })}
        onSave={(item) => runJsonAction({
          name: 'Update SavingThrow',
          target: `data/savingThrows/${savingThrowData.name}`,
          type: JsonActionType.OVERRIDE,
          value: item
        })}
        isVisible={(savingThrowData !== null)} requestClose={() => setSavingThrowData(null)} data={savingThrowData}
      />

      <EditObjectModal title='Edit Skill'
        onDelete={() => runJsonAction({
          name: 'Delete Skill',
          target: 'data/skills',
          type: JsonActionType.REMOVEITEM,
          value: skillData.name
        })}
        onSave={(item) => runJsonAction({
          name: 'Update Skill',
          target: `data/skills/${skillData.name}`,
          type: JsonActionType.OVERRIDE,
          value: item
        })}
        isVisible={(skillData !== null)} requestClose={() => setSkillData(null)} data={skillData}
      />

      <IonList inset={true}>
        <IonItem button={true} onClick={() => {
          openModal({ title: 'Edit Proficiency Bonus',
            data: character.data.proficiencyBonus,
            type: 'edit_object',
            onSave: (data) => runJsonAction({
              name: 'Update Proficiency Bonus',
              target: `data/proficiencyBonus`,
              type: JsonActionType.OVERRIDE,
              value: data
            })
          })
        }}>
          <IonLabel>Proficiency Bonus</IonLabel>
          <IonNote slot='end'>{character.data.proficiencyBonus.value}</IonNote>
        </IonItem>
      </IonList>

      <IonTitle>Ability Scores</IonTitle>
      <IonGrid fixed={true}>
        <IonRow>
          <IonCol>Score</IonCol>
          <IonCol>Ability</IonCol>
          <IonCol>Mod</IonCol>
          <IonCol>Save</IonCol>
        </IonRow>
        <Divider />
        {
          character.data.stats.map((stat: any) => {
            return (
              <IonRow key={stat.name} onClick={() => setStatData(stat)}>
                <IonCol>
                  <div style={{ backgroundColor: 'gray', padding: 5, display: 'flex', justifyContent: 'center' }}>
                    {stat.score}
                  </div>
                </IonCol>
                <IonCol>
                  <div style={{ padding: 5, display: 'flex', justifyContent: 'center' }}>
                    {stat.name}
                  </div>
                </IonCol>
                <IonCol>
                  <div style={{ backgroundColor: 'gray', padding: 5, display: 'flex', justifyContent: 'center' }}>
                    {getMod(stat.score)}
                  </div>
                </IonCol>
                <IonCol>
                  <div style={{ backgroundColor: 'gray', padding: 5, display: 'flex', justifyContent: 'center' }}>
                    {getMod(stat.score) + (stat.saveProficient ? character.data.proficiencyBonus.value : 0)}
                  </div>
                </IonCol>
              </IonRow>
            )
          })
        }
      </IonGrid>

      <IonTitle>Skills</IonTitle>
      <IonList inset={true}>
        {
          character.data.skills.map((skill: any) => {

            const fullBonus = character.data.proficiencyBonus.value

            const bonus: { [key:string]: number } = {
              expertise: fullBonus * 2,
              full: fullBonus,
              half: fullBonus / 2,
              none: 0
            }

            return (
              <IonItem button={true} onClick={() => setSkillData(skill)}>
                <VisualBox slot='start' type={skill.proficiency} />
                <div style={{ display: 'flex', gap: 10 }}>
                  <IonLabel>{getMod(character.data.stats.find((s: any) => s.name === skill.stat)?.score) + (bonus[skill.proficiency])}</IonLabel>
                  <IonLabel>{skill.name}</IonLabel>
                </div>
                <IonNote slot='end'>({skill.stat})</IonNote>
              </IonItem>
            )
          })
        }
      </IonList>

      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton>
          <IonIcon icon={chevronUpCircle}></IonIcon>
        </IonFabButton>
        <IonFabList side="top">
          <IonButton
            style={{ marginRight: '80%'}}
            onClick={() => {
              runJsonAction({
                name: 'Add Skill', target: 'data/skills', type: JsonActionType.ADDITEM,
                value: generateObject(character.system.types.find(type => type.name === 'Skill')!)
              })}
            }
          >
            <IonText>Add Skill</IonText>
          </IonButton>
          <IonButton
            style={{ marginRight: '75%'}}
            onClick={() => {
              runJsonAction({
                name: 'Add Stat', target: 'data/stats', type: JsonActionType.ADDITEM,
                value: generateObject(character.system.types.find(type => type.name === 'Stat')!)
              })}
            }
          >
            <IonText>Add Stat</IonText>
          </IonButton>
        </IonFabList>
      </IonFab>
    </>
  )
}

function VisualBox({ type, slot }: { type: string, slot: string }) {
  const size: { [key:string]: object } = {
    expertise: { width: '100%', backgroundColor: 'gold' },
    full: { width: '100%', backgroundColor: 'green' },
    half: { width: '50%', backgroundColor: 'green' },
    none: { width: '0%', backgroundColor: 'green' }
  }

  return (
    <div slot={slot} style={{ width: 32, height: 32, border: '1px solid gray', marginRight: 10 }}>
      <div style={{ ...size[type], height: '100%' }} />
    </div>
  )
}

export default Skills