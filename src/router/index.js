import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import About from '../components/About.vue'
import Esurvei from '../components/Esurvei.vue'
import KategoriOPD from '../components/kategori-opd.vue'

const routes = [
  { path: '/', component: Esurvei },
  { path: '/kategori-opd', component: KategoriOPD },
  { path: '/about', component: About },
  { path: '/:pathMatch(.*)*', redirect: '/' } // Redirect any unknown paths to home
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
