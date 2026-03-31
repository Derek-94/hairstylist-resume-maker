<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

const props = defineProps<{
  src: string
  aspectRatio?: number  // 1 for square, undefined for free
}>()

const emit = defineEmits<{
  confirm: [croppedBase64: string]
  cancel: []
}>()

const imgEl = ref<HTMLImageElement | null>(null)
let cropper: Cropper | null = null

onMounted(() => {
  if (!imgEl.value) return
  cropper = new Cropper(imgEl.value, {
    aspectRatio: props.aspectRatio ?? 1,
    viewMode: 1,
    dragMode: 'move',
    autoCropArea: 0.85,
    movable: true,
    rotatable: false,
    scalable: false,
    zoomable: true,
    zoomOnTouch: true,
    zoomOnWheel: false,
    background: false,
    modal: true,
  })
})

onBeforeUnmount(() => {
  cropper?.destroy()
})

function confirm() {
  if (!cropper) return
  const canvas = cropper.getCroppedCanvas({ maxWidth: 1200, maxHeight: 1200 })
  emit('confirm', canvas.toDataURL('image/jpeg', 0.9))
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex flex-col"
    style="background: #000;"
  >
    <!-- 상단 바 -->
    <div class="flex items-center justify-between px-5 py-4 flex-shrink-0" style="background: #111;">
      <button
        @click="emit('cancel')"
        class="text-sm font-medium"
        style="color: rgba(255,255,255,0.5);"
      >취소</button>
      <span class="text-sm font-semibold" style="color: #fff;">사진 크롭</span>
      <button
        @click="confirm"
        class="text-sm font-semibold px-3 py-1.5 rounded-full"
        style="background: linear-gradient(135deg, #a78bfa, #f472b6); color: #fff;"
      >완료</button>
    </div>

    <!-- 크롭 영역 -->
    <div class="flex-1 overflow-hidden flex items-center justify-center">
      <img
        ref="imgEl"
        :src="src"
        style="max-width: 100%; max-height: 100%; display: block;"
      />
    </div>

    <!-- 안내 -->
    <div class="text-center py-4 flex-shrink-0" style="background: #111;">
      <p class="text-xs" style="color: rgba(255,255,255,0.3);">핀치로 확대·축소, 드래그로 위치 조정</p>
    </div>
  </div>
</template>
