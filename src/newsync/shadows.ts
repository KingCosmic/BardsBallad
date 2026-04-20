export function characterShadow(loaded: any) {
  return {
    name: loaded._name,
    slug: loaded._slug,
    system: loaded._system,
    datapacks: loaded._datapacks
  }
}

export function systemShadow(loaded: any) {
  return {
    name: loaded.name
  }
}

export function datapackShadow(loaded: any) {
  return {}
}

export function subShadow(loaded: any) {
  return {}
}