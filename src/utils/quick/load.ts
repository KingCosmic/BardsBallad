import { newQuickJSWASMModuleFromVariant, newVariant, RELEASE_SYNC } from "quickjs-emscripten"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import wasmLocation from "@jitl/quickjs-wasmfile-release-sync/wasm?url"

const variant = newVariant(RELEASE_SYNC, {
  wasmLocation,
})

export default async function load() {
  return await newQuickJSWASMModuleFromVariant(variant)
}