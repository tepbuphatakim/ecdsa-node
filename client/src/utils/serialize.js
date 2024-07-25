export function serializeBigIntObj(obj) {
  const jsonString = JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
  return jsonString;
}
