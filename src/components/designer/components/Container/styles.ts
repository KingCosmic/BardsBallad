
type Styles = { [key:string]: { background: string; border: string; hover: string; } }

const styles: Styles = {
  // (Cosmic) I HAVE NO IDEA WHY BUT IF YOU MAKE THIS OPTION 'none' IT WILL NOT WORK, DO NOT MAKE THIS OPTION 'none'
  'no style': {
    background: '',
    border: '',
    hover: ''
  },
  'light': {
    background: 'bg-muted text-muted-foreground',
    border: 'border',
    hover: 'cursor-pointer hover:bg-muted/70'
  },
  'primary': {
    background: 'bg-primary text-primary-foreground',
    border: 'border',
    hover: 'cursor-pointer hover:bg-primary/70'
  },
  'accent': {
    background: 'bg-accent text-accent-foreground',
    border: 'border',
    hover: 'cursor-pointer hover:bg-accent/70'
  },
  'confirmation': {
    background: 'bg-success text-success-foreground',
    border: 'border',
    hover: 'cursor-pointer hover:bg-success/70'
  },
  'warning': {
    background: 'bg-warning text-warning-foreground',
    border: 'border',
    hover: 'cursor-pointer hover:bg-warning/70'
  }
}

export default styles