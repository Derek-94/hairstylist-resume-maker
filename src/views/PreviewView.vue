<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResumeStore } from '@/stores/resume'
import TemplateMinimal from '@/components/templates/TemplateMinimal.vue'
import TemplateDark from '@/components/templates/TemplateDark.vue'
import TemplateWarm from '@/components/templates/TemplateWarm.vue'
import TemplateBold from '@/components/templates/TemplateBold.vue'

const router = useRouter()
const store = useResumeStore()
const resumeRef = ref<HTMLElement | null>(null)

const templates = [
  { id: 0, name: '미니멀', component: TemplateMinimal },
  { id: 1, name: '다크', component: TemplateDark },
  { id: 2, name: '웜', component: TemplateWarm },
  { id: 3, name: '볼드', component: TemplateBold }
]

const selectedId = ref(store.data.selectedTemplate)

function selectTemplate(id: number) {
  selectedId.value = id
  store.update({ selectedTemplate: id })
}

const currentTemplate = () => templates[selectedId.value]

const exportingType = ref<'pdf' | 'image' | null>(null)

const templateBgColors = ['#f9f9f9', '#121212', '#f5f6f7', '#ffffff']

async function getCanvas() {
  await document.fonts.ready
  const el = resumeRef.value!
  const w = el.offsetWidth
  const h = el.scrollHeight
  const html2canvas = (await import('html2canvas')).default
  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: templateBgColors[selectedId.value],
    logging: false,
    width: w,
    height: h,
    windowWidth: w,
    windowHeight: h,
  })
}

async function exportPDF() {
  if (!resumeRef.value || exportingType.value) return
  exportingType.value = 'pdf'
  try {
    const canvas = await getCanvas()
    const { jsPDF } = await import('jspdf')
    const imgData = canvas.toDataURL('image/png')
    // 콘텐츠 크기에 맞는 커스텀 PDF (A4 고정 아님)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2],
    })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
    pdf.save(`${store.data.name || '이력서'}_이력서.pdf`)
  } finally {
    exportingType.value = null
  }
}

async function exportImage() {
  if (!resumeRef.value || exportingType.value) return
  exportingType.value = 'image'
  try {
    const canvas = await getCanvas()
    const link = document.createElement('a')
    link.download = `${store.data.name || '이력서'}_이력서.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally {
    exportingType.value = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Top bar -->
    <div class="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100 sticky top-0 z-10">
      <button @click="router.push('/survey/1')" class="text-sm text-gray-500">← 수정하기</button>
      <span class="text-sm font-semibold text-gray-900">미리보기</span>
      <div class="w-16" />
    </div>

    <!-- Resume -->
    <div class="flex-1 overflow-y-auto py-8 px-5" style="background:#d8d8d8;">
      <div
        class="rounded-xl overflow-hidden"
        style="box-shadow: 0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1);"
      >
        <div ref="resumeRef">
          <component :is="currentTemplate().component" :data="store.data" />
        </div>
      </div>
    </div>

    <!-- Template selector -->
    <div class="bg-white border-t border-gray-100 px-4 pt-3 pb-2">
      <p class="text-xs text-gray-400 mb-2 text-center">디자인 선택</p>
      <div class="flex gap-2 justify-center">
        <button
          v-for="t in templates"
          :key="t.id"
          @click="selectTemplate(t.id)"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all',
            selectedId === t.id
              ? 'bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-600'
          ]"
        >{{ t.name }}</button>
      </div>
    </div>

    <!-- Export buttons -->
    <div class="px-4 pb-8 pt-3 bg-white flex gap-3">
      <button
        @click="exportImage"
        :disabled="!!exportingType"
        class="flex-1 py-4 rounded-2xl font-semibold text-base transition-all disabled:opacity-50"
        style="background:#f3f3f3; color:#1a1c1c;"
      >
        {{ exportingType === 'image' ? '저장 중...' : '🖼 이미지 저장' }}
      </button>
      <button
        @click="exportPDF"
        :disabled="!!exportingType"
        class="flex-1 py-4 rounded-2xl font-semibold text-base transition-all disabled:opacity-50"
        style="background:#1a1c1c; color:#ffffff;"
      >
        {{ exportingType === 'pdf' ? '저장 중...' : '📄 PDF 저장' }}
      </button>
    </div>
  </div>
</template>
