<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResumeStore, SKILL_OPTIONS } from '@/stores/resume'

const route = useRoute()
const router = useRouter()
const store = useResumeStore()

const step = computed(() => Number(route.params.step))
const totalSteps = 10

const progress = computed(() => (step.value / totalSteps) * 100)

const steps = [
  { field: 'name', label: '이름이 무엇인가요?', type: 'text', placeholder: '홍길동', required: true },
  { field: 'birthDate', label: '생년월일을 입력해주세요', type: 'date', placeholder: '', required: true },
  { field: 'gender', label: '성별을 선택해주세요', type: 'radio', options: ['여성', '남성'], required: true },
  { field: 'phone', label: '연락처를 입력해주세요', type: 'tel', placeholder: '010-0000-0000', required: true },
  { field: 'profileImage', label: '프로필 사진을 올려주세요', type: 'image-single', required: true },
  { field: 'skills', label: '보유 기술을 선택해주세요', type: 'checkbox', options: SKILL_OPTIONS, required: true },
  { field: 'portfolioImages', label: '포트폴리오 사진을 올려주세요', type: 'image-multi', required: false },
  { field: 'career', label: '경력사항을 입력해주세요', type: 'textarea', placeholder: '예) ○○미용실 인턴 6개월', required: false },
  { field: 'certifications', label: '자격증을 입력해주세요', type: 'textarea', placeholder: '예) 미용사(일반) 자격증', required: false },
  { field: 'introduction', label: '한 줄 자기소개를 작성해주세요', type: 'textarea', placeholder: '예) 손님을 최우선으로 생각하는 미용사가 되고 싶습니다.', required: false }
]

const currentStep = computed(() => steps[step.value - 1])

const currentValue = computed({
  get() {
    const field = currentStep.value?.field as keyof typeof store.data
    return store.data[field]
  },
  set(val: any) {
    const field = currentStep.value?.field
    if (field) store.update({ [field]: val } as any)
  }
})

function handleImageSingle(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => store.update({ profileImage: ev.target?.result as string })
  reader.readAsDataURL(file)
}

function handleImageMulti(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files || [])
  files.forEach(file => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const current = [...store.data.portfolioImages]
      store.update({ portfolioImages: [...current, ev.target?.result as string] })
    }
    reader.readAsDataURL(file)
  })
}

function removePortfolioImage(index: number) {
  const images = [...store.data.portfolioImages]
  images.splice(index, 1)
  store.update({ portfolioImages: images })
}

function toggleSkill(skill: string) {
  const current = [...store.data.skills]
  const idx = current.indexOf(skill)
  if (idx >= 0) current.splice(idx, 1)
  else current.push(skill)
  store.update({ skills: current })
}

function canProceed() {
  if (!currentStep.value?.required) return true
  const val = currentValue.value
  if (currentStep.value.field === 'skills') return (val as string[]).length > 0
  if (currentStep.value.field === 'profileImage') return val !== null
  return String(val).trim().length > 0
}

function next() {
  if (!canProceed()) return
  if (step.value < totalSteps) {
    router.push(`/survey/${step.value + 1}`)
  } else {
    router.push('/preview')
  }
}

function prev() {
  if (step.value > 1) router.push(`/survey/${step.value - 1}`)
}

function skip() {
  if (step.value < totalSteps) router.push(`/survey/${step.value + 1}`)
  else router.push('/preview')
}
</script>

<template>
  <div v-if="currentStep" class="min-h-screen bg-white flex flex-col">
    <!-- Progress bar -->
    <div class="w-full h-1 bg-gray-100">
      <div
        class="h-1 bg-gray-800 transition-all duration-300"
        :style="{ width: progress + '%' }"
      />
    </div>

    <!-- Step counter -->
    <div class="px-6 pt-6 text-sm text-gray-400">{{ step }} / {{ totalSteps }}</div>

    <!-- Content -->
    <div class="flex-1 flex flex-col px-6 pt-8 pb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-8 leading-snug">
        {{ currentStep.label }}
        <span v-if="!currentStep.required" class="text-sm font-normal text-gray-400 ml-2">(선택)</span>
      </h1>

      <!-- Text / Tel / Date input -->
      <template v-if="['text', 'tel', 'date'].includes(currentStep.type)">
        <input
          v-model="currentValue"
          :type="currentStep.type"
          :placeholder="currentStep.placeholder"
          class="w-full border-b-2 border-gray-200 focus:border-gray-800 outline-none text-lg py-3 transition-colors"
          @keyup.enter="next"
        />
      </template>

      <!-- Textarea -->
      <template v-else-if="currentStep.type === 'textarea'">
        <textarea
          v-model="currentValue"
          :placeholder="currentStep.placeholder"
          rows="4"
          class="w-full border-2 border-gray-200 focus:border-gray-800 outline-none text-lg p-3 rounded-xl transition-colors resize-none"
        />
      </template>

      <!-- Radio -->
      <template v-else-if="currentStep.type === 'radio'">
        <div class="flex gap-4">
          <button
            v-for="opt in currentStep.options"
            :key="opt"
            @click="currentValue = opt"
            :class="[
              'flex-1 py-4 rounded-2xl border-2 text-lg font-medium transition-all',
              currentValue === opt
                ? 'border-gray-800 bg-gray-800 text-white'
                : 'border-gray-200 text-gray-700'
            ]"
          >{{ opt }}</button>
        </div>
      </template>

      <!-- Checkbox (skills) -->
      <template v-else-if="currentStep.type === 'checkbox'">
        <div class="flex flex-wrap gap-3">
          <button
            v-for="skill in currentStep.options"
            :key="skill"
            @click="toggleSkill(skill)"
            :class="[
              'px-4 py-2 rounded-full border-2 text-sm font-medium transition-all',
              store.data.skills.includes(skill)
                ? 'border-gray-800 bg-gray-800 text-white'
                : 'border-gray-200 text-gray-700'
            ]"
          >{{ skill }}</button>
        </div>
      </template>

      <!-- Single image -->
      <template v-else-if="currentStep.type === 'image-single'">
        <label class="cursor-pointer">
          <div v-if="store.data.profileImage"
            class="w-32 h-32 rounded-full overflow-hidden mx-auto border-4 border-gray-800"
          >
            <img :src="store.data.profileImage" class="w-full h-full object-cover" />
          </div>
          <div v-else
            class="w-32 h-32 rounded-full bg-gray-100 flex flex-col items-center justify-center mx-auto border-2 border-dashed border-gray-300"
          >
            <span class="text-3xl">📷</span>
            <span class="text-xs text-gray-400 mt-1">사진 선택</span>
          </div>
          <input type="file" accept="image/*" class="hidden" @change="handleImageSingle" />
        </label>
      </template>

      <!-- Multi image (portfolio) -->
      <template v-else-if="currentStep.type === 'image-multi'">
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="(img, idx) in store.data.portfolioImages"
            :key="idx"
            class="relative aspect-square rounded-xl overflow-hidden"
          >
            <img :src="img" class="w-full h-full object-cover" />
            <button
              @click="removePortfolioImage(idx)"
              class="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >✕</button>
          </div>
          <label class="aspect-square rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer">
            <span class="text-2xl">+</span>
            <span class="text-xs text-gray-400">추가</span>
            <input type="file" accept="image/*" multiple class="hidden" @change="handleImageMulti" />
          </label>
        </div>
      </template>
    </div>

    <!-- Navigation -->
    <div class="px-6 pb-8 flex items-center gap-3">
      <button
        v-if="step > 1"
        @click="prev"
        class="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600"
      >←</button>

      <button
        v-if="!currentStep.required"
        @click="skip"
        class="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-500 font-medium"
      >건너뛰기</button>

      <button
        @click="next"
        :disabled="!canProceed()"
        :class="[
          'py-4 rounded-2xl font-medium text-lg transition-all',
          currentStep.required ? 'flex-1' : 'w-14',
          canProceed()
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        ]"
      >{{ step === totalSteps ? '완료' : '→' }}</button>
    </div>
  </div>
</template>
