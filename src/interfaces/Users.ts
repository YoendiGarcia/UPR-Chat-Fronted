export interface User {
  username: string
  data: Data
}

interface Data{
    complete_name: string
    email: string
    phone: string
    type: string
    year: number
    career: string
    course: string
    subjects: string[]
}