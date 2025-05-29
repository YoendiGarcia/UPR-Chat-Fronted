import { LLMQuery } from './LLMQueries'

export interface Chat {
  chatId: number
  llmqueries: LLMQuery[]
}
