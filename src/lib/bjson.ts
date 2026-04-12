// bigint support for json.

export function stringify(value: any, space = 0) {
  return JSON.stringify(value, replacer, space);
}

export function parse(json: string) {
  return JSON.parse(json, reviver);
}

function replacer(key: string, value: any) {
  return typeof value === "bigint"
    ? { __type: "BigInt", value: value.toString() }
    : value;
}

function reviver(key: string, value: any) {
  return value && value.__type === "BigInt"
    ? BigInt(value.value)
    : value;
}