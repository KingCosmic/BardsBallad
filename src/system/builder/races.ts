
interface Choice {
  title:string
  description:string
  options:{}
}

interface ASI {
  str?:number
  cha?:number
}

export interface Race {
  name:string
  size:string
  speed:number
  languages:string[]
  asi:ASI[]
  choices:Choice[]
}

export const Races:Race[] = [
  {
    name: 'Dragonborn',
    size: 'medium',
    speed: 30,
    languages: ['common', 'dragonic'],
    asi: [
      {
        str: 2,
        cha: 1
      }
    ],
    choices: [
      {
        title: 'Dragon Ancestry',
        description: 'You have draconic ancestry. Choose one type of dragon from the Draconic Ancestry table. Your breath weapon and damage resistance are determined by the dragon type, as shown in the table',
        options: {
          'black dragon': {},
          'blue dragon': {},
          'brass dragon': {},
          'bronze dragon': {},
          'copper dragon': {},
          'gold dragon': {},
          'green dragon': {},
          'red dragon': {},
          'silver dragon': {},
          'white dragon': {}
        }
      }
    ]
  }
]