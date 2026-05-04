export function characterShadow(loaded: any) {
  return {
    name: loaded.name ?? loaded._name,
    slug: loaded.slug ?? loaded._slug,
    system: loaded.system ?? loaded._system,
    datapacks: loaded.datapacks ?? loaded._datapacks ?? []
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