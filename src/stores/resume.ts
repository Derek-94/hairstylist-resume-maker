import { defineStore } from 'pinia'
import { reactive } from 'vue'

export interface ResumeData {
  name: string
  birthDate: string
  gender: string
  phone: string
  profileImage: string | null
  skills: string[]
  portfolioImages: string[]
  career: string
  certifications: string
  introduction: string
  selectedTemplate: number
}

export const SKILL_OPTIONS = [
  '커트', '펌', '염색', '드라이', '레게머리',
  '붙임머리', '매직', '셋팅', '네일', '스킨케어'
]

const initialData = (): ResumeData => ({
  name: '',
  birthDate: '',
  gender: '',
  phone: '',
  profileImage: null,
  skills: [],
  portfolioImages: [],
  career: '',
  certifications: '',
  introduction: '',
  selectedTemplate: 0
})

export const useResumeStore = defineStore('resume', () => {
  const data = reactive<ResumeData>(initialData())

  function update(partial: Partial<ResumeData>) {
    Object.assign(data, partial)
  }

  function reset() {
    Object.assign(data, initialData())
  }

  return { data, update, reset }
})
