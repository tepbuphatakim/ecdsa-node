export function serializeBigIntObj(obj) {
  return JSON.stringify(obj, (_, value) =>
    typeof value === "bigint" ? `${value.toString()}n` : value
  );
}

export function parseBigIntObj(jsonString) {
  return JSON.parse(jsonString, (_, value) =>
    typeof value === "string" && /^\d+n$/.test(value)
      ? BigInt(value.slice(0, -1))
      : value
  );
}
