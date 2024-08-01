export function exclude<TData, TKey extends keyof TData>(
  data: TData,
  keys: TKey[]
): Omit<TData, TKey> {
  for (let key of keys) {
    delete data[key]
  }
  return data
}
