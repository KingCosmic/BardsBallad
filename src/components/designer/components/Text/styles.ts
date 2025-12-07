
type Styles = { [key:string]: { text: string; hover: string; } }
type Weight = { [key:string]: string }
type Sizes = { [key:string]: object }

const styles: { colors: Styles, weight: Weight, sizes: Sizes } = {
  'colors': {
    // (Cosmic) I HAVE NO IDEA WHY BUT IF YOU MAKE THIS OPTION 'none' IT WILL NOT WORK, DO NOT MAKE THIS OPTION 'none'
    'base': {
      text: 'text-bg-foreground',
      hover: 'hover:text-bg-foreground'
    },
    'light': {
      text: 'text-muted-foreground',
      hover: 'hover:text-muted-foreground'
    },
    'primary': {
      text: 'text-primary',
      hover: 'hover:text-primary'
    },
    'accent': {
      text: 'text-accent',
      hover: 'hover:text-accent'
    },
    'confirmation': {
      text: 'text-success',
      hover: 'hover:text-success'
    },
    'warning': {
      text: 'text-warning',
      hover: 'hover:text-warning'
    },
    'danger': {
      text: 'text-destruction',
      hover: 'hover:text-destruction'
    }
  },
  'weight': {
    'thin': 'font-thin',
    'extralight': 'font-extralight',
    'light': 'font-light',
    'normal': 'font-normal',
    'medium': 'font-medium',
    'semibold': 'font-semibold',
    'bold': 'font-bold',
    'extrabold': 'font-extrabold',
    'black': 'font-black',
  },
  'sizes': {
    'xs': { fontSize: '0.75rem', lineHeight: '1rem' },
    'sm': { fontSize: '0.875rem', lineHeight: '1.25rem' },
    'base': { fontSize: '1rem', lineHeight: '1.5rem' },
    'lg': { fontSize: '1.125rem', lineHeight: '1.75rem' },
    'xl': { fontSize: '1.25rem', lineHeight: '1.75rem' },
    '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
    '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem' },
    '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },
    '5xl': { fontSize: '3rem', lineHeight: '1' },
    '6xl': { fontSize: '3.75rem', lineHeight: '1' },
    '7xl': { fontSize: '4.5rem', lineHeight: '1' },
    '8xl': { fontSize: '6rem', lineHeight: '1' },
    '9xl': { fontSize: '8rem', lineHeight: '1' },
  }
}

export default styles