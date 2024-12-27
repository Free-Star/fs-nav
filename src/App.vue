<template>
  <div class="nav-container">
    <div class="header">
      <img src="/home.png" alt="FS Logo" class="logo" />
      <h1>FS导航</h1>
    </div>
    
    <button class="add-button" @click="showForm = true">
      <i class="fas fa-plus"></i> 添加网站
    </button>

    <!-- 网站列表 -->
    <div class="nav-grid">
      <a 
        v-for="(site, index) in sites" 
        :key="site.url"
        :href="site.url" 
        class="nav-item"
        :class="site.gradient" 
        target="_blank"
      >
        <button class="delete-btn" @click.prevent="deleteSite(index)">
          ×
        </button>
        <i :class="site.icon"></i>
        <span>{{ site.name }}</span>
      </a>
    </div>

    <!-- 模态弹窗 -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="showForm" @click="showForm = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h2>添加网站</h2>
            <button class="close-btn" @click="showForm = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="form-group">
              <label>网站名称</label>
              <input v-model="newSite.name" placeholder="请输入网站名称" />
            </div>
            
            <div class="form-group url-group">
              <label>网站链接</label>
              <div class="protocol-url-group">
                <!-- 协议选择 -->
                <div class="protocol-select">
                  <select v-model="newSite.protocol">
                    <option value="http">http://</option>
                    <option value="https">https://</option>
                  </select>
                </div>
                
                <!-- URL和端口输入 -->
                <div class="url-inputs">
                  <input 
                    v-model="newSite.url" 
                    placeholder="域名或IP地址 (例如: example.com 或 192.168.1.1)"
                    class="url-input"
                  />
                  <div class="port-input-group">
                    <span class="port-separator">:</span>
                    <input 
                      v-model="newSite.port" 
                      placeholder="端口" 
                      class="port-input"
                      type="number"
                      min="1"
                      max="65535"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label>网站图标</label>
              <div class="icon-selector">
                <div class="selected-icon" @click="showIcons = !showIcons">
                  <i :class="newSite.icon || 'fas fa-globe'"></i>
                  <span>{{ newSite.icon ? '更换图标' : '选择图标' }}</span>
                </div>
                
                <div class="icon-grid" v-if="showIcons">
                  <div class="icon-categories">
                    <button 
                      v-for="(category, name) in iconCategories" 
                      :key="name"
                      @click="currentCategory = name"
                      :class="{ active: currentCategory === name }"
                    >
                      {{ name }}
                    </button>
                  </div>
                  <div class="icons-list">
                    <button
                      v-for="icon in iconCategories[currentCategory]"
                      :key="icon"
                      @click="selectIcon(icon)"
                      :class="{ active: newSite.icon === icon }"
                    >
                      <i :class="icon"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="cancel-btn" @click="showForm = false">取消</button>
            <button class="submit-btn" @click="addSite">添加</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Site {
  name: string
  url: string
  port?: string
  protocol: string
  icon: string
  gradient: string
}

const gradients = [
  'gradient-1',
  'gradient-2',
  'gradient-3',
  'gradient-4',
  'gradient-5'
]

const defaultSites = [
  {
    name: 'GitHub',
    url: 'https://github.com',
    icon: 'fab fa-github',
    gradient: 'gradient-1'
  },
  {
    name: 'Google',
    url: 'https://google.com',
    icon: 'fab fa-google',
    gradient: 'gradient-2'
  },
  {
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    icon: 'fas fa-robot',
    gradient: 'gradient-3'
  }
]

// 从 localStorage 读取数据，如果没有则使用默认数据
const sites = ref<Site[]>(
  JSON.parse(localStorage.getItem('sites') || JSON.stringify(defaultSites))
)

const showForm = ref(false)
const newSite = ref({
  name: '',
  url: '',
  port: '',
  protocol: 'http',
  icon: ''
})

const addSite = () => {
  if (newSite.value.name && newSite.value.url) {
    let fullUrl = newSite.value.url
    fullUrl = fullUrl.replace(/^https?:\/\//i, '')
    fullUrl = `${newSite.value.protocol}://${fullUrl}`
    
    if (newSite.value.port) {
      fullUrl = fullUrl + ':' + newSite.value.port
    }

    const newSiteData = {
      name: newSite.value.name,
      url: fullUrl,
      port: newSite.value.port,
      protocol: newSite.value.protocol,
      icon: newSite.value.icon,
      gradient: gradients[Math.floor(Math.random() * gradients.length)]
    }

    sites.value.push(newSiteData)
    localStorage.setItem('sites', JSON.stringify(sites.value))
    
    newSite.value = { 
      name: '', 
      url: '', 
      port: '', 
      protocol: 'http', 
      icon: '' 
    }
    showForm.value = false
  }
}

const deleteSite = (index: number) => {
  if (confirm('确定要删除这个网站吗？')) {
    sites.value.splice(index, 1)
    localStorage.setItem('sites', JSON.stringify(sites.value))
  }
}

const showIcons = ref(false)
const currentCategory = ref('常用')

// 图标分类
const iconCategories = {
  '常用': [
    'fas fa-home',
    'fas fa-globe',
    'fas fa-search',
    'fas fa-envelope',
    'fas fa-star',
    'fas fa-heart',
    'fas fa-user',
    'fas fa-cog',
    'fas fa-book',
    'fas fa-music',
    'fas fa-video',
    'fas fa-image',
    'fas fa-file',
    'fas fa-folder'
  ],
  '社交': [
    'fab fa-github',
    'fab fa-twitter',
    'fab fa-facebook',
    'fab fa-instagram',
    'fab fa-linkedin',
    'fab fa-youtube',
    'fab fa-discord',
    'fab fa-telegram',
    'fab fa-weixin',
    'fab fa-qq',
    'fab fa-weibo'
  ],
  '工具': [
    'fas fa-code',
    'fas fa-terminal',
    'fas fa-database',
    'fas fa-cloud',
    'fas fa-server',
    'fas fa-laptop-code',
    'fas fa-robot',
    'fas fa-bug',
    'fas fa-tools'
  ],
  '媒体': [
    'fas fa-play',
    'fas fa-film',
    'fas fa-camera',
    'fas fa-headphones',
    'fas fa-podcast',
    'fas fa-photo-video',
    'fas fa-newspaper'
  ]
}

const selectIcon = (icon: string) => {
  newSite.value.icon = icon
  showIcons.value = false
}
</script>

<style scoped>
.add-site-form {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.add-site-form input {
  padding: 0.8rem;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
}

.form-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.form-buttons button, .add-button {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-buttons button:hover, .add-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.add-button {
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
}

/* 添加删除按钮样式 */
.nav-item {
  position: relative;
}

.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 3;
  padding: 0;
  font-size: 14px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.5);
}

.nav-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 0.15);
  transform: scale(1.1);
}

.icon-selector {
  position: relative;
}

.selected-icon {
  padding: 0.8rem;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.selected-icon i {
  font-size: 1.2rem;
}

.icon-grid {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 100;
  max-height: 300px;
  display: flex;
  flex-direction: column;
}

.icon-categories {
  display: flex;
  gap: 0.5rem;
  padding: 0.8rem;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
}

.icon-categories button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
  white-space: nowrap;
}

.icon-categories button.active {
  background: var(--primary-color);
  color: white;
}

.icons-list {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 0.5rem;
  overflow-y: auto;
  max-height: 200px;
}

.icons-list button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
}

.icons-list button:hover {
  background: #eee;
  transform: scale(1.1);
}

.icons-list button.active {
  background: var(--primary-color);
  color: white;
}

.icons-list i {
  font-size: 1.2rem;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--primary-color);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  padding: 0.5rem;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn, .submit-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
}

.submit-btn {
  background: var(--primary-color);
  color: white;
}

.cancel-btn:hover, .submit-btn:hover {
  transform: translateY(-2px);
}

/* 调整图标选择器在模态框中的样式 */
.icon-grid {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 0.5rem;
  z-index: 100;
}

.selected-icon {
  width: 100%;
  box-sizing: border-box;
}

.url-group {
  margin-bottom: 2rem;
}

.url-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.url-input {
  flex: 1;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.port-input-group {
  display: flex;
  align-items: center;
}

.port-separator {
  color: #666;
  margin: 0 0.25rem;
  font-weight: bold;
}

.port-input {
  width: 80px;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

/* 移除数字输入框的箭头 */
.port-input::-webkit-inner-spin-button,
.port-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.port-input[type=number] {
  -moz-appearance: textfield;
}

/* 输入框焦点样式 */
.url-input:focus,
.port-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.protocol-url-group {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.protocol-select {
  min-width: 90px;
}

.protocol-select select {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.protocol-select select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
}

.url-inputs {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.logo {
  width: 40px;
  height: 40px;
}

h1 {
  color: white;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 2.5rem;
}
</style>
