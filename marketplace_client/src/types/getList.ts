export interface BaseGetList {
  meta: {
    currentPage: number
    perPage: number
    total: number
  }
}

export interface PageParam {
  page: number
}
