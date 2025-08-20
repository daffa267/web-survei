import { createRouter, createWebHistory } from 'vue-router'
import About from '../components/About.vue'
import Esurvei from '../components/Esurvei.vue'
import KategoriOPD from '../components/kategori-opd.vue'
import KategoriDinas from '../components/kategori-dinas.vue'
import DataResponden from '../components/data-responden.vue'
import Survei from '../components/survei.vue'

const routes = [
  { path: '/', component: Esurvei },
  { path: '/kategori-opd', component: KategoriOPD },
  { path: '/kategori-dinas', component: KategoriDinas },
  { path: '/about', component: About },
  { path: '/data-responden', component: DataResponden },
  { path: '/survei', component: Survei },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
