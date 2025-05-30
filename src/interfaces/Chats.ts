import { LLMQuery } from './LLMQueries'

export interface Chat {
  id: number
  llmqueries: LLMQuery[]
}
