<script setup lang="ts">
import type { ResumeData } from '@/stores/resume'
defineProps<{ data: ResumeData }>()
</script>

<template>
  <div style="background:#ffffff; font-family:'Plus Jakarta Sans',sans-serif; color:#181818; width:100%;">

    <!-- 블랙 헤더 블록 -->
    <div style="background:#181818; padding:2rem 1.5rem 1.75rem;">
      <div style="display:flex; align-items:center; gap:1.25rem;">
        <div style="width:80px; height:80px; border-radius:0.375rem; overflow:hidden; background:#2a2a2a; flex-shrink:0;">
          <img v-if="data.profileImage" :src="data.profileImage" style="width:100%;height:100%;object-fit:cover;" />
          <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;">👤</div>
        </div>
        <div>
          <div style="display:inline-block; background:#fed65b; padding:0.2rem 0.6rem; border-radius:0.25rem; margin-bottom:0.5rem;">
            <span style="font-size:0.65rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#181818;">Hair Stylist</span>
          </div>
          <h1 style="font-size:1.6rem; font-weight:800; color:#ffffff; letter-spacing:-0.03em; line-height:1.15;">{{ data.name || '이름' }}</h1>
        </div>
      </div>
      <div style="display:flex; gap:1.25rem; margin-top:1rem; flex-wrap:wrap;">
        <span v-if="data.birthDate" style="font-size:0.7rem; color:#888; letter-spacing:0.04em;">{{ data.birthDate }}</span>
        <span v-if="data.gender" style="font-size:0.7rem; color:#888;">{{ data.gender }}</span>
        <span v-if="data.phone" style="font-size:0.7rem; color:#fed65b; font-weight:700; letter-spacing:0.04em;">{{ data.phone }}</span>
      </div>
    </div>

    <!-- 옐로우 포인트 바 -->
    <div style="background:#fed65b; height:4px;"></div>

    <!-- 자기소개 -->
    <div v-if="data.introduction" style="padding:1.25rem 1.5rem; background:#f3f3f3;">
      <p style="font-size:0.875rem; line-height:1.7; color:#444748; word-break:break-word; overflow-wrap:break-word;">{{ data.introduction }}</p>
    </div>

    <!-- 보유 기술 -->
    <div v-if="data.skills.length" style="padding:1.5rem 1.5rem; background:#ffffff;">
      <p style="font-size:0.65rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#181818; margin-bottom:0.875rem; display:flex; align-items:center; gap:0.5rem;">
        <span style="display:inline-block; width:16px; height:3px; background:#fed65b; border-radius:2px;"></span>
        Expertise
      </p>
      <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
        <span
          v-for="skill in data.skills"
          :key="skill"
          style="background:#181818; color:#fed65b; font-size:0.7rem; font-weight:700; letter-spacing:0.05em; padding:0.3rem 0.75rem; border-radius:0.25rem; display:inline-flex; align-items:center; white-space:nowrap; max-width:48%; overflow:hidden; text-overflow:ellipsis;"
        >{{ skill }}</span>
      </div>
    </div>

    <!-- 포트폴리오 -->
    <div v-if="data.portfolioImages.length" style="padding:1.5rem 1.5rem; background:#f3f3f3;">
      <p style="font-size:0.65rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#181818; margin-bottom:0.875rem; display:flex; align-items:center; gap:0.5rem;">
        <span style="display:inline-block; width:16px; height:3px; background:#fed65b; border-radius:2px;"></span>
        Portfolio
      </p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
        <div v-for="(img, i) in data.portfolioImages" :key="i" style="aspect-ratio:1; border-radius:0.25rem; overflow:hidden;">
          <img :src="img" style="width:100%;height:100%;object-fit:cover;" />
        </div>
      </div>
    </div>

    <!-- 경력 -->
    <div v-if="data.career" style="padding:1.5rem 1.5rem; background:#ffffff;">
      <p style="font-size:0.65rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#181818; margin-bottom:0.875rem; display:flex; align-items:center; gap:0.5rem;">
        <span style="display:inline-block; width:16px; height:3px; background:#fed65b; border-radius:2px;"></span>
        Career
      </p>
      <div style="border-left:3px solid #fed65b; padding-left:1rem;">
        <p style="font-size:0.875rem; line-height:1.7; color:#444748; white-space:pre-line; word-break:break-word; overflow-wrap:break-word;">{{ data.career }}</p>
      </div>
    </div>

    <!-- 자격증 -->
    <div v-if="data.certifications" style="padding:1.5rem 1.5rem; background:#f3f3f3;">
      <p style="font-size:0.65rem; font-weight:700; letter-spacing:0.14em; text-transform:uppercase; color:#181818; margin-bottom:0.875rem; display:flex; align-items:center; gap:0.5rem;">
        <span style="display:inline-block; width:16px; height:3px; background:#fed65b; border-radius:2px;"></span>
        Certifications
      </p>
      <p style="font-size:0.875rem; line-height:1.7; color:#444748; white-space:pre-line; word-break:break-word; overflow-wrap:break-word;">{{ data.certifications }}</p>
    </div>

  </div>
</template>
