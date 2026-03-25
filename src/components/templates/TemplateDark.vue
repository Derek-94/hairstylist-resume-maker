<script setup lang="ts">
import type { ResumeData } from '@/stores/resume'
defineProps<{ data: ResumeData }>()
</script>

<template>
  <div class="bg-gray-900 w-full font-sans text-white p-6">
    <!-- Header -->
    <div class="flex flex-col items-center text-center mb-6">
      <div class="w-24 h-24 rounded-full overflow-hidden bg-gray-700 mb-3 border-2 border-yellow-400">
        <img v-if="data.profileImage" :src="data.profileImage" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-gray-500 text-3xl">👤</div>
      </div>
      <h1 class="text-2xl font-bold tracking-wide">{{ data.name || '이름' }}</h1>
      <p class="text-sm text-gray-400 mt-1">{{ data.birthDate }} {{ data.gender ? `· ${data.gender}` : '' }}</p>
      <p class="text-sm text-yellow-400">{{ data.phone }}</p>
    </div>

    <div class="border-t border-gray-700 mb-5" />

    <!-- Introduction -->
    <div v-if="data.introduction" class="mb-5">
      <p class="text-sm text-gray-300 leading-relaxed text-center italic">{{ data.introduction }}</p>
    </div>

    <!-- Skills -->
    <div v-if="data.skills.length" class="mb-5">
      <h2 class="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-2">보유 기술</h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="skill in data.skills"
          :key="skill"
          class="px-3 py-1 border border-yellow-400 text-yellow-400 text-sm rounded-full"
        >{{ skill }}</span>
      </div>
    </div>

    <!-- Portfolio -->
    <div v-if="data.portfolioImages.length" class="mb-5">
      <h2 class="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-2">포트폴리오</h2>
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
      <h2 class="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-2">경력사항</h2>
      <p class="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{{ data.career }}</p>
    </div>

    <!-- Certifications -->
    <div v-if="data.certifications">
      <h2 class="text-xs font-semibold text-yellow-400 uppercase tracking-widest mb-2">자격증</h2>
      <p class="text-sm text-gray-300 whitespace-pre-line">{{ data.certifications }}</p>
    </div>
  </div>
</template>
