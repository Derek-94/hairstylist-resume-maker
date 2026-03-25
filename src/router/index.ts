import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/survey/1'
    },
    {
      path: '/survey/:step',
      name: 'survey',
      component: () => import('@/views/SurveyView.vue')
    },
    {
      path: '/preview',
      name: 'preview',
      component: () => import('@/views/PreviewView.vue')
    }
  ]
})

export default router
