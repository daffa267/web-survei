import { createRouter, createWebHistory } from 'vue-router'
import Esurvei from '../components/Esurvei.vue'
import KategoriOPD from '../components/kategori-opd.vue'
import KategoriDinas from '../components/kategori-dinas.vue'
import ListSurvey from '../components/list-survey.vue' 
import DataResponden from '../components/data-responden.vue'
import Survei from '../components/survei.vue'
import KritikSaran from '../components/kritik-saran.vue'
import Finish from '../components/finish.vue'

const routes = [
  { path: '/', component: Esurvei },
  { path: '/kategori-opd', component: KategoriOPD },
  { path: '/kategori-dinas/:id?', component: KategoriDinas },
  { path: '/list-survey/:id', component: ListSurvey },
  { path: '/data-responden/:id', component: DataResponden },
  { path: '/survei/:id', component: Survei },
  { path: '/kritik-saran', component: KritikSaran },
  { path: '/finish', component: Finish },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
