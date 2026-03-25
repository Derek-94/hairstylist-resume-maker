<script setup lang="ts">
import type { ResumeData } from '@/stores/resume'
defineProps<{ data: ResumeData }>()
</script>

<template>
  <div class="bg-white w-full font-sans text-gray-900 p-6">
    <!-- Header -->
    <div class="flex items-center gap-4 mb-6">
      <div class="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
        <img v-if="data.profileImage" :src="data.profileImage" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-300 text-2xl">👤</div>
      </div>
      <div>
        <h1 class="text-2xl font-bold">{{ data.name || '이름' }}</h1>
        <p class="text-sm text-gray-500 mt-1">{{ data.birthDate }} {{ data.gender ? `· ${data.gender}` : '' }}</p>
        <p class="text-sm text-gray-500">{{ data.phone }}</p>
      </div>
    </div>

    <hr class="border-gray-200 mb-5" />

    <!-- Introduction -->
    <div v-if="data.introduction" class="mb-5">
      <p class="text-sm text-gray-600 leading-relaxed">{{ data.introduction }}</p>
    </div>

    <!-- Skills -->
    <div v-if="data.skills.length" class="mb-5">
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">보유 기술</h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in data.skills"
          :key="skill"
          class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
        >{{ skill }}</span>
      </div>
    </div>

    <!-- Portfolio -->
    <div v-if="data.portfolioImages.length" class="mb-5">
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">포트폴리오</h2>
      <div class="grid grid-cols-3 gap-2">
        <div
          v-for="(img, i) in data.portfolioImages"
          :key="i"
          class="aspect-square rounded-lg overflow-hidden"
        >
          <img :src="img" class="w-full h-full object-cover" />
        </div>
      </div>
    </div>

    <!-- Career -->
    <div v-if="data.career" class="mb-5">
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">경력사항</h2>
      <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{{ data.career }}</p>
    </div>

    <!-- Certifications -->
    <div v-if="data.certifications">
      <h2 class="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">자격증</h2>
      <p class="text-sm text-gray-700 whitespace-pre-line">{{ data.certifications }}</p>
    </div>
  </div>
</template>
