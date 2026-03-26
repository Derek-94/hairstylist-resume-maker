<script setup lang="ts">
import type { ResumeData } from '@/stores/resume'
defineProps<{ data: ResumeData }>()
</script>

<template>
  <div style="background:#f9f9f9; font-family:'Manrope',sans-serif; color:#1a1c1c; width:100%;">

    <!-- Hero: profile + name -->
    <div style="background:#ffffff; padding:2rem 1.5rem 1.5rem;">
      <div style="display:flex; align-items:flex-end; gap:1.25rem;">
        <div style="flex-shrink:0; width:88px; height:88px; border-radius:1.5rem 0.25rem 1.5rem 0.25rem; overflow:hidden; background:#eeeeee;">
          <img v-if="data.profileImage" :src="data.profileImage" style="width:100%;height:100%;object-fit:cover;" />
          <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;">👤</div>
        </div>
        <div style="flex:1; padding-bottom:0.25rem;">
          <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:#747878; margin-bottom:0.25rem;">Hair Stylist</p>
          <h1 style="font-family:'Noto Serif KR',serif; font-size:1.6rem; font-weight:700; letter-spacing:-0.02em; line-height:1.2; color:#181818;">{{ data.name || '이름' }}</h1>
        </div>
      </div>

      <!-- 기본 정보 -->
      <div style="display:flex; gap:1rem; margin-top:1rem; flex-wrap:wrap;">
        <span v-if="data.birthDate" style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.7rem; font-weight:500; letter-spacing:0.04em; color:#747878;">{{ data.birthDate }}</span>
        <span v-if="data.gender" style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.7rem; font-weight:500; letter-spacing:0.04em; color:#747878;">{{ data.gender }}</span>
        <span v-if="data.phone" style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.7rem; font-weight:500; letter-spacing:0.04em; color:#181818;">{{ data.phone }}</span>
      </div>
    </div>

    <!-- 자기소개 -->
    <div v-if="data.introduction" style="background:#f3f3f3; padding:1.25rem 1.5rem;">
      <p style="font-size:0.875rem; line-height:1.7; color:#444748; word-break:break-word; overflow-wrap:break-word;">{{ data.introduction }}</p>
    </div>

    <!-- 보유 기술 -->
    <div v-if="data.skills.length" style="background:#ffffff; padding:1.25rem 1.5rem;">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#747878; margin-bottom:0.75rem;">Expertise</p>
      <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
        <span
          v-for="skill in data.skills"
          :key="skill"
          style="background:#eeeeee; color:#1a1c1c; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.7rem; font-weight:600; letter-spacing:0.04em; padding:0.3rem 0.85rem; border-radius:9999px; display:inline-flex; align-items:center; white-space:nowrap; max-width:48%; overflow:hidden; text-overflow:ellipsis;"
        >{{ skill }}</span>
      </div>
    </div>

    <!-- 포트폴리오 -->
    <div v-if="data.portfolioImages.length" style="background:#f3f3f3; padding:1.25rem 1.5rem;">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#747878; margin-bottom:0.75rem;">Portfolio</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem;">
        <div v-for="(img, i) in data.portfolioImages" :key="i" style="aspect-ratio:1; border-radius:0.5rem; overflow:hidden;">
          <img :src="img" style="width:100%;height:100%;object-fit:cover;" />
        </div>
      </div>
    </div>

    <!-- 경력 -->
    <div v-if="data.career" style="background:#ffffff; padding:1.25rem 1.5rem;">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#747878; margin-bottom:0.75rem;">Career</p>
      <div style="border-left:2px solid #e2e2e2; padding-left:1rem;">
        <p style="font-size:0.875rem; line-height:1.7; color:#444748; white-space:pre-line; word-break:break-word; overflow-wrap:break-word;">{{ data.career }}</p>
      </div>
    </div>

    <!-- 자격증 -->
    <div v-if="data.certifications" style="background:#f3f3f3; padding:1.25rem 1.5rem;">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#747878; margin-bottom:0.75rem;">Certifications</p>
      <p style="font-size:0.875rem; line-height:1.7; color:#444748; white-space:pre-line; word-break:break-word; overflow-wrap:break-word;">{{ data.certifications }}</p>
    </div>

  </div>
</template>
