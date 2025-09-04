export const maxLength = (length: number) => (entry: string) => {
  return typeof entry === 'string' && entry.length <= length
}
