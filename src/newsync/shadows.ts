import * as automerge from '@automerge/automerge'

export function characterShadow(loaded: any) {
  return {
    name: loaded._name,
    slug: loaded._slug,
    system: loaded._system,
    datapacks: loaded._datapacks
  }
}

export function systemShadow(doc: automerge.Doc<any>) {

}

export function datapackShadow(doc: automerge.Doc<any>) {

}

export function subShadow(doc: automerge.Doc<any>) {

}