<script setup lang="ts">
import type { ResumeData } from '@/stores/resume'
defineProps<{ data: ResumeData }>()
</script>

<template>
  <div style="background:#f5f6f7; font-family:'Be Vietnam Pro',sans-serif; color:#2c2f30; width:100%;">

    <!-- Hero: gradient header -->
    <div style="background:linear-gradient(135deg,#a43049 0%,#fe748b 100%); padding:2.5rem 1.5rem 3.5rem; position:relative;">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:600; letter-spacing:0.14em; text-transform:uppercase; color:rgba(255,255,255,0.7); margin-bottom:0.5rem;">Hair Stylist</p>
      <h1 style="font-family:'Plus Jakarta Sans',sans-serif; font-size:1.75rem; font-weight:800; color:#ffffff; letter-spacing:-0.02em; line-height:1.2;">{{ data.name || '이름' }}</h1>
      <div style="display:flex; gap:0.75rem; margin-top:0.6rem; flex-wrap:wrap;">
        <span v-if="data.birthDate" style="font-size:0.72rem; color:rgba(255,255,255,0.75);">{{ data.birthDate }}</span>
        <span v-if="data.gender" style="font-size:0.72rem; color:rgba(255,255,255,0.75);">{{ data.gender }}</span>
        <span v-if="data.phone" style="font-size:0.72rem; color:#fff; font-weight:600;">{{ data.phone }}</span>
      </div>
    </div>

    <!-- 프로필 사진 (floating) -->
    <div style="display:flex; justify-content:flex-end; padding:0 1.5rem; margin-top:-2.5rem; margin-bottom:0.5rem; position:relative; z-index:10;">
      <div style="width:80px; height:80px; border-radius:9999px; overflow:hidden; background:#ffcdd2; border:3px solid #ffffff; flex-shrink:0; box-shadow:0 4px 20px rgba(164,48,73,0.25);">
        <img v-if="data.profileImage" :src="data.profileImage" style="width:100%;height:100%;object-fit:cover;" />
        <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:1.75rem;">👤</div>
      </div>
    </div>

    <!-- 자기소개 -->
    <div v-if="data.introduction" style="background:#ffffff; margin:0 1rem 0.75rem; border-radius:1rem; padding:1rem 1.25rem; box-shadow:0 2px 12px rgba(164,48,73,0.06);">
      <p style="font-size:0.875rem; line-height:1.75; color:#595c5d;">{{ data.introduction }}</p>
    </div>

    <!-- 보유 기술 -->
    <div v-if="data.skills.length" style="background:#ffffff; margin:0 1rem 0.75rem; border-radius:1rem; padding:1.25rem; box-shadow:0 2px 12px rgba(164,48,73,0.06);">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#a43049; margin-bottom:0.75rem;">Expertise</p>
      <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
        <span
          v-for="skill in data.skills"
          :key="skill"
          style="background:#ffd9e4; color:#a43049; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.7rem; font-weight:600; padding:0.3rem 0.8rem; border-radius:9999px; display:inline-flex; align-items:center; line-height:1;"
        >{{ skill }}</span>
      </div>
    </div>

    <!-- 포트폴리오 -->
    <div v-if="data.portfolioImages.length" style="background:#ffffff; margin:0 1rem 0.75rem; border-radius:1rem; padding:1.25rem; box-shadow:0 2px 12px rgba(164,48,73,0.06);">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#a43049; margin-bottom:0.75rem;">Portfolio</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.625rem;">
        <div v-for="(img, i) in data.portfolioImages" :key="i" style="aspect-ratio:1; border-radius:0.75rem; overflow:hidden;">
          <img :src="img" style="width:100%;height:100%;object-fit:cover;" />
        </div>
      </div>
    </div>

    <!-- 경력 -->
    <div v-if="data.career" style="background:#ffffff; margin:0 1rem 0.75rem; border-radius:1rem; padding:1.25rem; box-shadow:0 2px 12px rgba(164,48,73,0.06);">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#a43049; margin-bottom:0.75rem;">Career</p>
      <p style="font-size:0.875rem; line-height:1.75; color:#595c5d; white-space:pre-line;">{{ data.career }}</p>
    </div>

    <!-- 자격증 -->
    <div v-if="data.certifications" style="background:#ffffff; margin:0 1rem 1rem; border-radius:1rem; padding:1.25rem; box-shadow:0 2px 12px rgba(164,48,73,0.06);">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase; color:#a43049; margin-bottom:0.75rem;">Certifications</p>
      <p style="font-size:0.875rem; line-height:1.75; color:#595c5d; white-space:pre-line;">{{ data.certifications }}</p>
    </div>

  </div>
</template>
