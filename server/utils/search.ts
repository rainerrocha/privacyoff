// @ts-ignore
import searchJson from 'search-json'

export const useSearch = (items: any[], query: string, options = {}) => {
  return searchJson.search(query, items, options) as any[]
}
