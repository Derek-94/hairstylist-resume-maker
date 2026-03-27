<script setup lang="ts">
import { computed, ref } from 'vue'
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
  { field: 'birthDate',      label: '생년월일을 알려주세요',         type: 'date-custom', placeholder: 'yyyy / mm / dd',                                      required: true  },
  { field: 'gender',         label: '성별을 선택해주세요',           type: 'radio',       options: ['여성', '남성'],                                          required: true  },
  { field: 'phone',          label: '연락처를 입력해주세요',         type: 'phone',       placeholder: '010-0000-0000',                                       required: true  },
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

// ── 생년월일 마스킹 (yyyy/mm/dd) ──────────────────────────────
function handleDateInput(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = input.value.replace(/\D/g, '').slice(0, 8)
  let formatted = raw
  if (raw.length > 4) formatted = raw.slice(0, 4) + '/' + raw.slice(4)
  if (raw.length > 6) formatted = raw.slice(0, 4) + '/' + raw.slice(4, 6) + '/' + raw.slice(6)
  input.value = formatted
  store.update({ birthDate: formatted })
}

const dateValidation = computed(() => {
  const raw = store.data.birthDate.replace(/\D/g, '')
  if (raw.length === 0) return { valid: false, message: '' }

  const year  = parseInt(raw.slice(0, 4))
  const month = parseInt(raw.slice(4, 6) || '0')
  const day   = parseInt(raw.slice(6, 8) || '0')

  if (raw.length >= 4 && (year < 1900 || year > new Date().getFullYear()))
    return { valid: false, message: '올바른 연도를 입력해주세요' }
  if (raw.length >= 6 && (month < 1 || month > 12))
    return { valid: false, message: '월은 01~12 사이여야 해요' }
  if (raw.length === 8) {
    const maxDay = new Date(year, month, 0).getDate()
    if (day < 1 || day > maxDay)
      return { valid: false, message: `${month}월은 ${maxDay}일까지 있어요` }
    return { valid: true, message: '' }
  }
  return { valid: false, message: '날짜를 끝까지 입력해주세요' }
})

const isDateValid = computed(() => dateValidation.value.valid)

// ── 연락처 마스킹 (010-0000-0000) ──────────────────────────────
function handlePhoneInput(e: Event) {
  const input = e.target as HTMLInputElement
  const raw = input.value.replace(/\D/g, '').slice(0, 11)
  let formatted = raw
  if (raw.length > 3) formatted = raw.slice(0, 3) + '-' + raw.slice(3)
  if (raw.length > 7) formatted = raw.slice(0, 3) + '-' + raw.slice(3, 7) + '-' + raw.slice(7)
  input.value = formatted
  store.update({ phone: formatted })
}

const isPhoneValid = computed(() => {
  return /^\d{3}-\d{4}-\d{4}$/.test(store.data.phone)
})

// ── 기술 ──────────────────────────────────────────────────────
const customSkillInput = ref('')

function toggleSkill(skill: string) {
  const current = [...store.data.skills]
  const idx = current.indexOf(skill)
  if (idx >= 0) current.splice(idx, 1)
  else current.push(skill)
  store.update({ skills: current })
}

function addCustomSkill() {
  const val = customSkillInput.value.trim()
  if (!val) return
  if (store.data.skills.includes(val)) return
  store.update({ skills: [...store.data.skills, val] })
  customSkillInput.value = ''
}

// ── 이미지 ────────────────────────────────────────────────────
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
      store.update({ portfolioImages: [...current, { image: ev.target?.result as string, caption: '' }] })
    }
    reader.readAsDataURL(file)
  })
}

function removePortfolioImage(index: number) {
  const images = [...store.data.portfolioImages]
  images.splice(index, 1)
  store.update({ portfolioImages: images })
}

// ── 진행 ──────────────────────────────────────────────────────
function canProceed() {
  if (!currentStep.value?.required) return true
  const field = currentStep.value.field
  if (field === 'skills') return store.data.skills.length > 0
  if (field === 'profileImage') return store.data.profileImage !== null
  if (field === 'birthDate') return isDateValid.value
  if (field === 'phone') return isPhoneValid.value
  return String(currentValue.value).trim().length > 0
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

          <!-- Text -->
          <template v-if="currentStep.type === 'text'">
            <input
              v-model="currentValue"
              type="text"
              :placeholder="currentStep.placeholder"
              class="survey-input w-full outline-none text-xl font-medium pb-3 bg-transparent"
              @keyup.enter="next"
            />
          </template>

          <!-- 생년월일 커스텀 마스킹 -->
          <template v-else-if="currentStep.type === 'date-custom'">
            <input
              :value="store.data.birthDate"
              type="text"
              inputmode="numeric"
              placeholder="yyyy / mm / dd"
              maxlength="10"
              class="survey-input w-full outline-none text-xl font-medium pb-3 bg-transparent tracking-widest"
              @input="handleDateInput"
              @keyup.enter="next"
            />
            <p class="mt-3 text-xs transition-all duration-200"
              :style="dateValidation.message ? 'color: #f472b6;' : 'color: rgba(255,255,255,0.2);'"
            >
              {{ dateValidation.message || '숫자만 입력하면 자동으로 형식이 완성돼요' }}
            </p>
          </template>

          <!-- 연락처 마스킹 -->
          <template v-else-if="currentStep.type === 'phone'">
            <input
              :value="store.data.phone"
              type="tel"
              inputmode="numeric"
              placeholder="010-0000-0000"
              maxlength="13"
              class="survey-input w-full outline-none text-xl font-medium pb-3 bg-transparent tracking-widest"
              @input="handlePhoneInput"
              @keyup.enter="next"
            />
            <p class="mt-3 text-xs transition-all duration-200"
              :style="store.data.phone && !isPhoneValid
                ? 'color: #f472b6;'
                : 'color: rgba(255,255,255,0.2);'"
            >
              {{ store.data.phone && !isPhoneValid ? '올바른 번호 형식이 아니에요 (010-0000-0000)' : '숫자만 입력하면 자동으로 형식이 완성돼요' }}
            </p>
          </template>

          <!-- Textarea -->
          <template v-else-if="currentStep.type === 'textarea'">
            <textarea
              v-model="currentValue"
              :placeholder="currentStep.placeholder"
              rows="4"
              class="survey-textarea w-full outline-none text-base font-medium p-4 rounded-2xl resize-none bg-transparent"
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

          <!-- 기술 선택 + 직접 추가 -->
          <template v-else-if="currentStep.type === 'checkbox'">
            <div class="flex flex-wrap gap-2 mb-5">
              <button
                v-for="skill in [...(currentStep.options ?? []), ...store.data.skills.filter(s => !(currentStep.options ?? []).includes(s))]"
                :key="skill"
                @click="toggleSkill(skill)"
                class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                :style="store.data.skills.includes(skill)
                  ? 'background: linear-gradient(135deg, #a78bfa, #f472b6); color: #fff; border: 1.5px solid transparent;'
                  : 'background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); border: 1.5px solid rgba(255,255,255,0.1);'"
              >{{ skill }}</button>
            </div>

            <!-- 직접 추가 -->
            <div class="flex gap-2 mt-2">
              <input
                v-model="customSkillInput"
                type="text"
                placeholder="직접 입력"
                maxlength="12"
                class="flex-1 outline-none text-sm px-4 py-2.5 rounded-full bg-transparent"
                style="border: 1.5px solid rgba(255,255,255,0.12); color: #fff;"
                @keyup.enter="addCustomSkill"
              />
              <button
                @click="addCustomSkill"
                class="px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
                :style="customSkillInput.trim()
                  ? 'background: rgba(167,139,250,0.2); color: #a78bfa; border: 1.5px solid #a78bfa;'
                  : 'background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.2); border: 1.5px solid rgba(255,255,255,0.08);'"
              >+ 추가</button>
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

          <!-- Multi image -->
          <template v-else-if="currentStep.type === 'image-multi'">
            <div class="overflow-y-auto" style="max-height: calc(100vh - 280px);">
              <!-- 업로드 그리드 -->
              <div class="grid grid-cols-3 gap-2 mb-4">
                <div
                  v-for="(item, idx) in store.data.portfolioImages"
                  :key="idx"
                  class="relative aspect-square rounded-2xl overflow-hidden"
                >
                  <img :src="item.image" class="w-full h-full object-cover" />
                  <button
                    @click="removePortfolioImage(idx)"
                    class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style="background: rgba(0,0,0,0.6); color: #fff; backdrop-filter: blur(4px);"
                  >✕</button>
                </div>
                <label
                  class="aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 cursor-pointer"
                  style="background: rgba(255,255,255,0.04); border: 1.5px dashed rgba(255,255,255,0.15);"
                >
                  <span class="text-2xl" style="color: rgba(255,255,255,0.3);">+</span>
                  <span class="text-xs" style="color: rgba(255,255,255,0.25);">추가</span>
                  <input type="file" accept="image/*" multiple class="hidden" @change="handleImageMulti" />
                </label>
              </div>

              <!-- 캡션 입력 (사진이 있을 때만) -->
              <div v-if="store.data.portfolioImages.length" class="flex flex-col gap-2">
                <p class="text-xs mb-1" style="color: rgba(255,255,255,0.3);">각 사진의 설명을 적어주세요 (선택)</p>
                <div
                  v-for="(item, idx) in store.data.portfolioImages"
                  :key="'caption-' + idx"
                  class="flex items-center gap-3"
                >
                  <div class="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0">
                    <img :src="item.image" class="w-full h-full object-cover" />
                  </div>
                  <input
                    v-model="store.data.portfolioImages[idx].caption"
                    type="text"
                    :placeholder="'사진 ' + (idx + 1) + ' 설명'"
                    maxlength="40"
                    class="flex-1 outline-none text-sm px-3 py-2 rounded-xl bg-transparent"
                    style="border: 1.5px solid rgba(255,255,255,0.1); color: #fff;"
                  />
                </div>
              </div>
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
.slide-forward-enter-active,
.slide-forward-leave-active {
  transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}
.slide-forward-enter-from { opacity: 0; transform: translateX(40px); }
.slide-forward-leave-to  { opacity: 0; transform: translateX(-40px); }

.slide-back-enter-active,
.slide-back-leave-active {
  transition: all 0.32s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}
.slide-back-enter-from { opacity: 0; transform: translateX(-40px); }
.slide-back-leave-to  { opacity: 0; transform: translateX(40px); }

.survey-input {
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  transition: border-color 0.2s;
}
.survey-input:focus { border-bottom-color: #a78bfa; }

.survey-textarea {
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  transition: border-color 0.2s;
}
.survey-textarea:focus { border-color: #a78bfa; }

.survey-input::placeholder,
.survey-textarea::placeholder,
input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}
</style>
