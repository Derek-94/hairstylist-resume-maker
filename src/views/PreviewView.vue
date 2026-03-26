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
const isExporting = ref(false)

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

async function exportPDF() {
  if (!resumeRef.value || isExporting.value) return
  isExporting.value = true

  try {
    const html2canvas = (await import('html2canvas')).default
    const { jsPDF } = await import('jspdf')

    const canvas = await html2canvas(resumeRef.value, {
      scale: 2,
      useCORS: true,
      backgroundColor: null
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' })
    const pageWidth = pdf.internal.pageSize.getWidth()
    const imgHeight = (canvas.height * pageWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, imgHeight)
    pdf.save(`${store.data.name || '이력서'}_이력서.pdf`)
  } finally {
    isExporting.value = false
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
        ref="resumeRef"
        class="rounded-xl overflow-hidden"
        style="box-shadow: 0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1);"
      >
        <component :is="currentTemplate().component" :data="store.data" />
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

    <!-- Export button -->
    <div class="px-4 pb-8 pt-3 bg-white">
      <button
        @click="exportPDF"
        :disabled="isExporting"
        class="w-full py-4 bg-gray-800 text-white rounded-2xl font-semibold text-lg disabled:opacity-50"
      >
        {{ isExporting ? '저장 중...' : 'PDF로 저장하기' }}
      </button>
    </div>
  </div>
</template>
