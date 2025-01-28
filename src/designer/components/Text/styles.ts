
type Styles = { [key:string]: { text: string; hover: string; } }
type Weight = { [key:string]: string }
type Sizes = { [key:string]: object }

const styles: { colors: Styles, weight: Weight, sizes: Sizes } = {
  'colors': {
    // (Cosmic) I HAVE NO IDEA WHY BUT IF YOU MAKE THIS OPTION 'none' IT WILL NOT WORK, DO NOT MAKE THIS OPTION 'none'
    'base': {
      text: 'text-neutral-800 dark:text-neutral-200',
      hover: 'group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
    },
    'light': {
      text: 'text-neutral-500 dark:text-neutral-400',
      hover: 'group-hover:text-neutral-400 dark:group-hover:text-neutral-500'
    },
    'primary': {
      text: 'text-brand-600 dark:text-brand-400',
      hover: 'group-hover:text-brand-700 dark:group-hover:text-brand-300'
    },
    'accent': {
      text: 'text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300',
      hover: 'group-hover:text-accent-700 dark:group-hover:text-accent-300'
    },
    'confirmation': {
      text: 'text-green-600 dark:text-green-400',
      hover: 'group-hover:text-green-700 dark:group-hover:text-green-300'
    },
    'warning': {
      text: 'text-orange-600 dark:text-orange-400',
      hover: 'group-hover:text-orange-700 dark:group-hover:text-orange-300'
    },
    'danger': {
      text: 'text-red-600 dark:text-red-400',
      hover: 'group-hover:text-red-700 dark:group-hover:text-red-300'
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