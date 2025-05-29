export interface LLMQuery {
  id: number
  input: Input[]
  output: Output
  timestamp: Date
}

interface Input {
  role: string
  text: string
}

interface Output {
  text: string
  html?: string
  files?: []
}
