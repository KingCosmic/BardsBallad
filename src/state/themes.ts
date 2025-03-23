import { newRidgeState } from 'react-ridge-state'

type Color = {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export type Colors = {
  background: string; // base background color
  brand: Color; // brand color
  neutral: Color;
  green: Color; // success color
  orange: Color; // warning color
  red: Color; // danger color
  blue: Color // informational color
}

export type Theme = {
  name: string;
  light: Colors,
  // dark: Colors
}

export const themesState = newRidgeState<Theme[]>([
  {
    "name": "BardsBallad",
    "light": {
      "background": "#121217",
  
      "brand": {
        50: '#fcf9f0',
        100: '#f9f2db',
        200: '#f2e1b6',
        300: '#eacc87',
        400: '#e3b667',
        500: '#d99736',
        600: '#cb802b',
        700: '#a86426',
        800: '#875025',
        900: '#6d4221',
        950: '#3b210f',
      },
      "neutral": {
        "50": "#f8f9fb", // Light parchment
        "100": "#f0f1f5", // Faint gray
        "200": "#d9dbe3", // Cool mist
        "300": "#babdcf", // Subtle blue-gray
        "400": "#9499b3", // Soft slate
        "500": "#6e7499", // Twilight gray
        "600": "#575e7f", // Dusky blue-gray
        "700": "#464d66", // Shadowed stone
        "800": "#393d50", // Ink-gray
        "900": "#2e3240", // Deep slate
        "950": "#191c27"  // Abyssal shadow
      },
      "orange": {
        "50": "#fff7eb", // Pale sunlight
        "100": "#ffe9c6", // Golden cream
        "200": "#ffcd87", // Bright apricot
        "300": "#ffac4a", // Gleaming amber
        "400": "#ff8a16", // Radiant gold
        "500": "#e67300", // Bardic orange
        "600": "#c35e00", // Burnished copper
        "700": "#9e4c00", // Aged bronze
        "800": "#7a3b00", // Autumn umber
        "900": "#5e2f00", // Embered wood
        "950": "#351a00"  // Smoky char
      },
      "red": {
        "50": "#fff5f5", // Petal pink
        "100": "#ffe5e5", // Rosy blush
        "200": "#ffbdbd", // Blooming rose
        "300": "#ff8f8f", // Passion red
        "400": "#ff5c5c", // Bardic crimson
        "500": "#ff3030", // Striking scarlet
        "600": "#e52626", // Enchanted ruby
        "700": "#b31f1f", // Daring garnet
        "800": "#8c1919", // Fiery ember
        "900": "#6a1414", // Blood red
        "950": "#410d0d"  // Dark ruby
      },
      "blue": {
        "50": "#f3faff", // Morning mist
        "100": "#e2f3ff", // Icy dew
        "200": "#bce1ff", // Bardic sky
        "300": "#82cbff", // Azure melody
        "400": "#41b2ff", // Lyrical blue
        "500": "#1f93e6", // Deep aquatic
        "600": "#166eb3", // Oceanic depth
        "700": "#125892", // Dusk wave
        "800": "#0f4776", // Twilight sea
        "900": "#0d3a5e", // Starry tide
        "950": "#07233b"  // Abyssal depth
      },
      "green": {
        "50": "#f3fcf5", // Fresh meadow
        "100": "#e4f8e8", // Dewy mint
        "200": "#c3edcb", // Emerald glow
        "300": "#92d8a4", // Vibrant jade
        "400": "#57be75", // Verdant tune
        "500": "#35a257", // Bard's verdure
        "600": "#298548", // Forest hymn
        "700": "#236e3b", // Evergreen ballad
        "800": "#1c552f", // Enchanted moss
        "900": "#164429", // Midnight grove
        "950": "#0b2617"  // Ancient forest
      }
    }
  },
  {
    "name": "ValentinesDay",
    "light": {
      "background": "#442835", // Soft pink
  
      "brand": {
        "50": "#fff7f9", // Barely pink
        "100": "#ffeef2", // Blush tint
        "200": "#fed7e2", // Light rose
        "300": "#fbb6ce", // Rosy pink
        "400": "#f687b3", // Bright coral pink
        "500": "#ed64a6", // Bold Valentine pink
        "600": "#d53f8c", // Deep raspberry
        "700": "#b83280", // Romantic magenta
        "800": "#97266d", // Rich plum
        "900": "#702459", // Dark wine
        "950": "#521640"  // Deep romantic plum
      },
      "neutral": {
        "50": "#fdf7f9", // Soft white
        "100": "#faf0f3", // Faint rose mist
        "200": "#f4d9e1", // Subtle blush
        "300": "#e8b8ca", // Warm pale pink
        "400": "#d68aa8", // Rosy gray
        "500": "#b76d89", // Muted Valentine rose
        "600": "#91536b", // Smoky rose
        "700": "#734256", // Deep vintage rose
        "800": "#5b3544", // Dusty burgundy
        "900": "#442835", // Deep romantic gray
        "950": "#2b1821"  // Shadowed rose
      },
      "orange": {
        "50": "#fff8f1", // Light peach
        "100": "#ffe8d8", // Soft apricot
        "200": "#ffd0ae", // Warm blush orange
        "300": "#ffaf7e", // Peachy coral
        "400": "#ff8552", // Sunset love
        "500": "#f75e28", // Warm Valentine orange
        "600": "#d9471a", // Deep tangerine
        "700": "#b43716", // Burnt sienna
        "800": "#8c2c13", // Embered rosewood
        "900": "#6c2311", // Darkened rose
        "950": "#3e1409"  // Rich caramel
      },
      "red": {
        "50": "#fff5f5", // Soft blush
        "100": "#ffe3e3", // Rosy pastel
        "200": "#ffbaba", // Light Valentine red
        "300": "#ff8989", // Bright red-pink
        "400": "#ff5c5c", // Warm cherry
        "500": "#fc2626", // Classic Valentine red
        "600": "#d21f1f", // Romantic ruby
        "700": "#aa1919", // Deep garnet
        "800": "#851515", // Fiery crimson
        "900": "#661010", // Dark rosewood
        "950": "#400909"  // Shadowed ruby
      },
      "blue": {
        "50": "#f5f8ff", // Whisper blue
        "100": "#ebf2ff", // Frosted glass
        "200": "#cbdcff", // Baby blue
        "300": "#a2bfff", // Love note sky
        "400": "#799fff", // Dreamy periwinkle
        "500": "#567dff", // Sweetheart sapphire
        "600": "#455fd4", // Midnight romance
        "700": "#394aa9", // Mystic navy
        "800": "#303b85", // Velvet dusk
        "900": "#262e66", // Deep indigo
        "950": "#171a40"  // Starry night
      },
      "green": {
        "50": "#f5fdf7", // Light mint
        "100": "#e7f8eb", // Pale seafoam
        "200": "#c6edcf", // Fresh herb
        "300": "#95dca7", // Spring renewal
        "400": "#5fc67d", // Love’s vitality
        "500": "#3ca75e", // Romantic green
        "600": "#2e8749", // Forest affection
        "700": "#266e3d", // Fern green
        "800": "#205530", // Deep emerald
        "900": "#1a4226", // Woodland green
        "950": "#0d2615"  // Enchanted forest
      }
    }
  }
])