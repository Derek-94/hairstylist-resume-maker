<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useResumeStore, SKILL_OPTIONS } from '@/stores/resume'

const route = useRoute()
const router = useRouter()
const store = useResumeStore()

const step = computed(() => Number(route.params.step))
const totalSteps = 10
const direction = ref<'forward' | 'back'>('forward')

const progress = computed(() => (step.value / totalSteps) * 100)

const steps = [
  { field: 'name',           label: '이름이 무엇인가요?',           type: 'text',        placeholder: '홍길동',                                              required: true  },
  { field: 'birthDate',      label: '생년월일을 알려주세요',         type: 'date',        placeholder: '',                                                    required: true  },
  { field: 'gender',         label: '성별을 선택해주세요',           type: 'radio',       options: ['여성', '남성'],                                          required: true  },
  { field: 'phone',          label: '연락처를 입력해주세요',         type: 'tel',         placeholder: '010-0000-0000',                                       required: true  },
  { field: 'profileImage',   label: '프로필 사진을 올려주세요',      type: 'image-single',placeholder: '',                                                    required: true  },
  { field: 'skills',         label: '보유 기술을 선택해주세요',      type: 'checkbox',    options: SKILL_OPTIONS,                                             required: true  },
  { field: 'portfolioImages',label: '포트폴리오 사진을 올려주세요',  type: 'image-multi', placeholder: '',                                                    required: false },
  { field: 'career',         label: '경력사항을 입력해주세요',       type: 'textarea',    placeholder: '예) ○○미용실 인턴 6개월',                              required: false },
  { field: 'certifications', label: '자격증을 입력해주세요',         type: 'textarea',    placeholder: '예) 미용사(일반) 자격증',                              required: false },
  { field: 'introduction',   label: '한 줄 자기소개를 작성해주세요', type: 'textarea',    placeholder: '예) 손님을 최우선으로 생각하는 미용사가 되고 싶습니다.', required: false },
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
  direction.value = 'forward'
  if (step.value < totalSteps) router.push(`/survey/${step.value + 1}`)
  else router.push('/preview')
}

function prev() {
  if (step.value > 1) {
    direction.value = 'back'
    router.push(`/survey/${step.value - 1}`)
  }
}

function skip() {
  direction.value = 'forward'
  if (step.value < totalSteps) router.push(`/survey/${step.value + 1}`)
  else router.push('/preview')
}
</script>

<template>
  <div v-if="currentStep" class="min-h-screen flex flex-col" style="background: #0d0d0d; color: #fff;">

    <!-- Progress bar -->
    <div class="w-full h-0.5" style="background: rgba(255,255,255,0.08);">
      <div
        class="h-0.5 transition-all duration-500 ease-out"
        style="background: linear-gradient(90deg, #a78bfa, #f472b6);"
        :style="{ width: progress + '%' }"
      />
    </div>

    <!-- Step counter -->
    <div class="px-6 pt-6 flex items-center justify-between">
      <span class="text-xs font-medium tracking-widest" style="color: rgba(255,255,255,0.3);">
        {{ String(step).padStart(2, '0') }} / {{ totalSteps }}
      </span>
      <span
        v-if="!currentStep.required"
        class="text-xs px-2 py-0.5 rounded-full"
        style="color: rgba(255,255,255,0.35); border: 1px solid rgba(255,255,255,0.12);"
      >선택</span>
    </div>

    <!-- Animated content area -->
    <div class="flex-1 relative overflow-hidden">
      <Transition :name="direction === 'forward' ? 'slide-forward' : 'slide-back'" mode="out-in">
        <div :key="step" class="flex flex-col px-6 pt-10 pb-6 h-full">

          <!-- Question label -->
          <h1 class="text-2xl font-bold leading-snug mb-10" style="color: #fff; letter-spacing: -0.02em;">
            {{ currentStep.label }}
          </h1>

          <!-- Text / Tel / Date -->
          <template v-if="['text', 'tel', 'date'].includes(currentStep.type)">
            <input
              v-model="currentValue"
              :type="currentStep.type"
              :placeholder="currentStep.placeholder"
              class="w-full outline-none text-xl font-medium pb-3 transition-all duration-200 bg-transparent"
              style="
                border-bottom: 1.5px solid rgba(255,255,255,0.15);
                color: #fff;
              "
              @focus="($event.target as HTMLInputElement).style.borderBottomColor = '#a78bfa'"
              @blur="($event.target as HTMLInputElement).style.borderBottomColor = 'rgba(255,255,255,0.15)'"
              @keyup.enter="next"
            />
          </template>

          <!-- Textarea -->
          <template v-else-if="currentStep.type === 'textarea'">
            <textarea
              v-model="currentValue"
              :placeholder="currentStep.placeholder"
              rows="4"
              class="w-full outline-none text-base font-medium p-4 rounded-2xl resize-none transition-all duration-200 bg-transparent"
              style="
                border: 1.5px solid rgba(255,255,255,0.12);
                color: #fff;
              "
              @focus="($event.target as HTMLTextAreaElement).style.borderColor = '#a78bfa'"
              @blur="($event.target as HTMLTextAreaElement).style.borderColor = 'rgba(255,255,255,0.12)'"
            />
          </template>

          <!-- Radio -->
          <template v-else-if="currentStep.type === 'radio'">
            <div class="flex gap-3">
              <button
                v-for="opt in currentStep.options"
                :key="opt"
                @click="currentValue = opt; next()"
                class="flex-1 py-4 rounded-2xl text-lg font-semibold transition-all duration-200"
                :style="currentValue === opt
                  ? 'background: linear-gradient(135deg, #a78bfa, #f472b6); color: #fff; border: 1.5px solid transparent;'
                  : 'background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.7); border: 1.5px solid rgba(255,255,255,0.1);'"
              >{{ opt }}</button>
            </div>
          </template>

          <!-- Checkbox (skills) -->
          <template v-else-if="currentStep.type === 'checkbox'">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="skill in currentStep.options"
                :key="skill"
                @click="toggleSkill(skill)"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                :style="store.data.skills.includes(skill)
                  ? 'background: linear-gradient(135deg, #a78bfa, #f472b6); color: #fff; border: 1.5px solid transparent;'
                  : 'background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); border: 1.5px solid rgba(255,255,255,0.1);'"
              >{{ skill }}</button>
            </div>
          </template>

          <!-- Single image -->
          <template v-else-if="currentStep.type === 'image-single'">
            <label class="cursor-pointer flex flex-col items-center gap-4">
              <div
                v-if="store.data.profileImage"
                class="w-36 h-36 rounded-full overflow-hidden"
                style="border: 2.5px solid #a78bfa;"
              >
                <img :src="store.data.profileImage" class="w-full h-full object-cover" />
              </div>
              <div
                v-else
                class="w-36 h-36 rounded-full flex flex-col items-center justify-center gap-2"
                style="background: rgba(167,139,250,0.08); border: 2px dashed rgba(167,139,250,0.4);"
              >
                <span class="text-4xl">📷</span>
                <span class="text-xs" style="color: rgba(255,255,255,0.35);">탭해서 선택</span>
              </div>
              <span class="text-sm" style="color: rgba(255,255,255,0.35);">
                {{ store.data.profileImage ? '탭해서 변경' : '' }}
              </span>
              <input type="file" accept="image/*" class="hidden" @change="handleImageSingle" />
            </label>
          </template>

          <!-- Multi image (portfolio) -->
          <template v-else-if="currentStep.type === 'image-multi'">
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="(img, idx) in store.data.portfolioImages"
                :key="idx"
                class="relative aspect-square rounded-2xl overflow-hidden"
              >
                <img :src="img" class="w-full h-full object-cover" />
                <button
                  @click="removePortfolioImage(idx)"
                  class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style="background: rgba(0,0,0,0.6); color: #fff; backdrop-filter: blur(4px);"
                >✕</button>
              </div>
              <label
                class="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-200"
                style="background: rgba(255,255,255,0.04); border: 1.5px dashed rgba(255,255,255,0.15);"
              >
                <span class="text-2xl" style="color: rgba(255,255,255,0.3);">+</span>
                <span class="text-xs" style="color: rgba(255,255,255,0.25);">추가</span>
                <input type="file" accept="image/*" multiple class="hidden" @change="handleImageMulti" />
              </label>
            </div>
          </template>

        </div>
      </Transition>
    </div>

    <!-- Navigation -->
    <div class="px-6 pb-10 flex items-center gap-3">
      <button
        v-if="step > 1"
        @click="prev"
        class="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 text-lg"
        style="background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.5); border: 1.5px solid rgba(255,255,255,0.1);"
      >←</button>

      <button
        v-if="!currentStep.required"
        @click="skip"
        class="flex-1 py-4 rounded-2xl font-medium transition-all duration-200"
        style="background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); border: 1.5px solid rgba(255,255,255,0.08);"
      >건너뛰기</button>

      <button
        v-if="currentStep.type !== 'radio'"
        @click="next"
        :disabled="!canProceed()"
        class="py-4 rounded-2xl font-semibold text-lg transition-all duration-200"
        :class="currentStep.required ? 'flex-1' : 'w-16'"
        :style="canProceed()
          ? 'background: linear-gradient(135deg, #a78bfa, #f472b6); color: #fff;'
          : 'background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.2); cursor: not-allowed;'"
      >{{ step === totalSteps ? '완료' : '→' }}</button>
    </div>

  </div>
</template>

<style scoped>
/* Forward: 새 화면이 오른쪽에서 들어오고, 현재 화면은 왼쪽으로 나감 */
.slide-forward-enter-active,
.slide-forward-leave-active {
  transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}
.slide-forward-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.slide-forward-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

/* Back: 새 화면이 왼쪽에서 들어오고, 현재 화면은 오른쪽으로 나감 */
.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}
.slide-back-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}
.slide-back-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

input::placeholder,
textarea::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1) opacity(0.3);
}
</style>
