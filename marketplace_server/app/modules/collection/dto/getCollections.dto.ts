import { Pagination } from '../../../types/pagination.js'

export interface GetCollectionsDTO extends Pagination {
  categoryId?: string
  sortedBy?: 'floor' | 'volume'
}
