
type Styles = { [key:string]: { background: string; border: string; hover: string; } }

const styles: Styles = {
  // (Cosmic) I HAVE NO IDEA WHY BUT IF YOU MAKE THIS OPTION 'none' IT WILL NOT WORK, DO NOT MAKE THIS OPTION 'none'
  'no style': {
    background: '',
    border: '',
    hover: ''
  },
  'light': {
    background: 'bg-white dark:bg-neutral-800',
    border: 'border border-neutral-200 dark:border-neutral-600',
    hover: 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700'
  },
  'primary': {
    background: 'bg-white dark:bg-fantasy-accent',
    border: 'border border-fantasy-border',
    hover: 'cursor-pointer hover:bg-fantasy-accent-dark'
  },
  'accent': {
    background: 'bg-white dark:bg-accent-800',
    border: 'border border-accent-200 dark:border-accent-600',
    hover: 'cursor-pointer hover:bg-accent-100 dark:hover:bg-accent-700'
  },
  'confirmation': {
    background: 'bg-white dark:bg-green-800',
    border: 'border border-green-200 dark:border-green-600',
    hover: 'cursor-pointer hover:bg-green-100 dark:hover:bg-green-700'
  },
  'warning': {
    background: 'bg-white dark:bg-orange-800',
    border: 'border border-orange-200 dark:border-orange-600',
    hover: 'cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-700'
  }
}

export default styles