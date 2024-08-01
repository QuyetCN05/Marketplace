export interface Pagination {
  page: number
  limit: number
  keyword: string
  sort: string
}

declare module '@adonisjs/core/http' {
  interface HttpContext {
    pagination: Pagination
  }
}
