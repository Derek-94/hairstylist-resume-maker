<script setup lang="ts">
import type { ResumeData } from '@/stores/resume'
defineProps<{ data: ResumeData }>()
</script>

<template>
  <div class="bg-white w-full font-sans text-gray-900">
    <!-- Color block header -->
    <div class="bg-indigo-600 p-6 text-white">
      <div class="flex items-center gap-4">
        <div class="w-20 h-20 rounded-xl overflow-hidden bg-indigo-400 flex-shrink-0 border-2 border-white">
          <img v-if="data.profileImage" :src="data.profileImage" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-indigo-200 text-2xl">👤</div>
        </div>
        <div>
          <h1 class="text-2xl font-black">{{ data.name || '이름' }}</h1>
          <p class="text-sm text-indigo-200 mt-1">{{ data.birthDate }} {{ data.gender ? `· ${data.gender}` : '' }}</p>
          <p class="text-sm text-white font-medium">{{ data.phone }}</p>
        </div>
      </div>
      <div v-if="data.introduction" class="mt-4 text-sm text-indigo-100 leading-relaxed">
        {{ data.introduction }}
      </div>
    </div>

    <div class="p-6">
      <!-- Skills -->
      <div v-if="data.skills.length" class="mb-5">
        <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">보유 기술</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="skill in data.skills"
            :key="skill"
            class="px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg font-medium"
          >{{ skill }}</span>
        </div>
      </div>

      <!-- Portfolio -->
      <div v-if="data.portfolioImages.length" class="mb-5">
        <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">포트폴리오</h2>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="(img, i) in data.portfolioImages"
            :key="i"
            class="aspect-square rounded-xl overflow-hidden"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- Career -->
      <div v-if="data.career" class="mb-5">
        <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">경력사항</h2>
        <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{{ data.career }}</p>
      </div>

      <!-- Certifications -->
      <div v-if="data.certifications">
        <h2 class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-2">자격증</h2>
        <p class="text-sm text-gray-700 whitespace-pre-line">{{ data.certifications }}</p>
      </div>
    </div>
  </div>
</template>
