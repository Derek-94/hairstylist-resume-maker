<script setup lang="ts">
import type { ResumeData } from '@/stores/resume'
defineProps<{ data: ResumeData }>()
</script>

<template>
  <div style="background:#121212; font-family:'Manrope',sans-serif; color:#e5e2e1; width:100%;">

    <!-- Hero -->
    <div style="background:linear-gradient(160deg,#1e1e1e 0%,#121212 100%); padding:2.5rem 1.5rem 2rem;">
      <div style="display:flex; flex-direction:column; align-items:center; text-align:center; gap:1rem;">
        <div style="width:96px; height:96px; border-radius:9999px; overflow:hidden; background:#2a2a2a; border:2px solid #e9c349; flex-shrink:0;">
          <div v-if="data.profileImage" :style="`background-image:url('${data.profileImage}');background-size:cover;background-position:center;width:100%;height:100%;`"></div>
          <div v-else style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;">👤</div>
        </div>
        <div>
          <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:#e9c349; margin-bottom:0.4rem;">Hair Stylist</p>
          <h1 style="font-family:'Noto Serif KR',serif; font-size:1.75rem; font-weight:700; letter-spacing:-0.02em; color:#ffffff;">{{ data.name || '이름' }}</h1>
          <div style="display:flex; justify-content:center; gap:0.75rem; margin-top:0.6rem; flex-wrap:wrap;">
            <span v-if="data.birthDate" style="font-size:0.7rem; color:#888; letter-spacing:0.04em;">{{ data.birthDate }}</span>
            <span v-if="data.gender" style="font-size:0.7rem; color:#888;">{{ data.gender }}</span>
            <span v-if="data.phone" style="font-size:0.7rem; color:#e9c349; font-weight:600;">{{ data.phone }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 자기소개 -->
    <div v-if="data.introduction" style="padding:1.25rem 1.5rem; border-bottom:1px solid rgba(255,255,255,0.06);">
      <p style="font-size:0.875rem; line-height:1.8; color:#aaa; text-align:center; font-style:italic; word-break:break-word; overflow-wrap:break-word;">{{ data.introduction }}</p>
    </div>

    <!-- 보유 기술 -->
    <div v-if="data.skills.length" style="padding:1.5rem 1.5rem; border-bottom:1px solid rgba(255,255,255,0.06);">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:#e9c349; margin-bottom:0.875rem;">Expertise</p>
      <div style="line-height:2.2;">
        <span
          v-for="skill in data.skills"
          :key="skill"
          style="background:rgba(233,195,73,0.1); color:#e9c349; font-family:'Plus Jakarta Sans',sans-serif; font-size:0.7rem; font-weight:600; letter-spacing:0.04em; padding:0.3rem 0.9rem 0.2rem; border-radius:9999px; border:1px solid rgba(233,195,73,0.25); display:inline-block; white-space:nowrap; max-width:48%; overflow:hidden; text-overflow:ellipsis; margin:0 0.35rem 0 0; vertical-align:middle;"
        ><span style="position:relative; top:-2px; display:block; line-height:1.2;">{{ skill }}</span></span>
      </div>
    </div>

    <!-- 포트폴리오 -->
    <div v-if="data.portfolioImages.length" style="padding:1.5rem 1.5rem; border-bottom:1px solid rgba(255,255,255,0.06);">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:#e9c349; margin-bottom:0.875rem;">Portfolio</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.625rem;">
        <div v-for="(img, i) in data.portfolioImages" :key="i" style="position:relative; padding-bottom:100%; border-radius:0.5rem; overflow:hidden;">
          <div :style="`position:absolute;top:0;left:0;width:100%;height:100%;background-image:url('${img}');background-size:cover;background-position:center;`"></div>
        </div>
      </div>
    </div>

    <!-- 경력 -->
    <div v-if="data.career" style="padding:1.5rem 1.5rem; border-bottom:1px solid rgba(255,255,255,0.06);">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:#e9c349; margin-bottom:0.875rem;">Career</p>
      <div style="border-left:2px solid rgba(233,195,73,0.3); padding-left:1rem;">
        <p style="font-size:0.875rem; line-height:1.8; color:#aaa; white-space:pre-line; word-break:break-word; overflow-wrap:break-word;">{{ data.career }}</p>
      </div>
    </div>

    <!-- 자격증 -->
    <div v-if="data.certifications" style="padding:1.5rem 1.5rem;">
      <p style="font-family:'Plus Jakarta Sans',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:0.16em; text-transform:uppercase; color:#e9c349; margin-bottom:0.875rem;">Certifications</p>
      <p style="font-size:0.875rem; line-height:1.8; color:#aaa; white-space:pre-line; word-break:break-word; overflow-wrap:break-word;">{{ data.certifications }}</p>
    </div>

  </div>
</template>
