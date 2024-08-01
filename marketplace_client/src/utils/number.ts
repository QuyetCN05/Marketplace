export function formatUsNumber(
  value: number | string,
  options?: Intl.NumberFormatOptions,
) {
  const numberValue = +value
  if (numberValue === 0) return "0"
  if (String(value).includes("e-")) {
    const exponent = +String(value).split("e-")[1]
    return (+value).toFixed(exponent + 1)
  }
  return numberValue.toLocaleString("en-US", {
    maximumFractionDigits: 6,
    ...options,
  })
}

export function formatCompactNumber(value: number | string, minValue?: number) {
  if (minValue && +value < minValue) return formatUsNumber(value)
  const valueToNumber = Number(value)
  const billionsAmount = valueToNumber / 1000000000
  if (billionsAmount >= 1) return formatUsNumber(billionsAmount) + "B"
  const millionsAmount = valueToNumber / 1000000
  if (millionsAmount >= 1) return formatUsNumber(millionsAmount) + "M"
  const thousandsAmount = valueToNumber / 1000
  if (thousandsAmount >= 1) return formatUsNumber(thousandsAmount) + "K"
  return formatUsNumber(valueToNumber)
}
