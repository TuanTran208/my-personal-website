<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-gray-900/80 backdrop-blur-md" @click.self="close">
        <div 
          class="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all relative border border-gray-100 dark:border-gray-800"
          role="dialog" 
          aria-modal="true"
        >
          <!-- Close Button -->
          <button 
              @click="close" 
              class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 z-10"
          >
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div class="p-6 md:p-12">
            
            <!-- Hero Section -->
            <div class="flex flex-col-reverse md:flex-row items-center gap-12 mb-16">
                <!-- Text Content -->
                <div class="flex-1 text-center md:text-left space-y-6">
                    <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight">
                        Hi all, I'm Tuan <span class="animate-wave inline-block origin-bottom-right">👋</span>
                    </h1>
                    <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto md:mx-0">
                        A passionate <span class="text-blue-600 dark:text-blue-400 font-bold">Senior Pipeline Engineer</span> �️ specializing in building tools and workflows for 3D production. 
                        <br class="hidden md:block" />
                        <span class="text-sm text-gray-500 italic mt-2 block">(This website is my playground for learning Web Programming 🌐)</span>
                    </p>
                    
                    <!-- Social Links -->
                    <div class="flex items-center justify-center md:justify-start gap-4 pt-4">
                        <a href="https://github.com/TuanTran208" target="_blank" class="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-transform hover:-translate-y-1 shadow-lg" title="GitHub">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                        <a href="mailto:tlmtuan2008@gmail.com" class="p-3 bg-red-600 text-white rounded-full hover:bg-red-500 transition-transform hover:-translate-y-1 shadow-lg" title="Email">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                        </a>
                        <a href="#" class="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-transform hover:-translate-y-1 shadow-lg" title="LinkedIn">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Illustration (Placeholder SVG for now) -->
                <div class="flex-1 flex justify-center">
                    <svg class="w-full max-w-sm h-auto drop-shadow-2xl" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" fill="none">
                         <!-- Pipeline / Logic style illustration -->
                         <rect x="50" y="50" width="400" height="300" rx="20" fill="#1E293B" />
                         <circle cx="90" cy="80" r="10" fill="#FF5F56" />
                         <circle cx="120" cy="80" r="10" fill="#FFBD2E" />
                         <circle cx="150" cy="80" r="10" fill="#27C93F" />
                         <rect x="50" y="110" width="400" height="2" fill="#334155" />
                         <!-- Flow Chart Nodes -->
                         <rect x="100" y="150" width="80" height="60" rx="10" fill="#60A5FA" />
                         <rect x="250" y="150" width="80" height="60" rx="10" fill="#F472B6" />
                         <rect x="180" y="175" width="70" height="10" fill="#94A3B8" /> <!-- Connector -->
                         <!-- Code block below -->
                         <rect x="100" y="250" width="300" height="70" rx="10" fill="#0F172A" />
                         <rect x="120" y="270" width="150" height="8" rx="4" fill="#334155" />
                         <rect x="120" y="290" width="100" height="8" rx="4" fill="#334155" />
                    </svg>
                </div>
            </div>

            <!-- "What I Do" Section -->
            <div class="mb-12">
                <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center md:text-left">What I Do</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Skill Card 1: Pipeline & Tools -->
                    <div class="space-y-4">
                        <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                             <div class="flex flex-col items-center gap-2 group cursor-pointer">
                                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center p-3 transition-all group-hover:shadow-lg group-hover:scale-105">
                                    <svg class="w-10 h-10 text-blue-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                                </div>
                                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Python</span>
                             </div>
                             <div class="flex flex-col items-center gap-2 group cursor-pointer">
                                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center p-3 transition-all group-hover:shadow-lg group-hover:scale-105">
                                    <svg class="w-10 h-10 text-teal-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
                                </div>
                                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Maya</span>
                             </div>
                             <div class="flex flex-col items-center gap-2 group cursor-pointer">
                                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center p-3 transition-all group-hover:shadow-lg group-hover:scale-105">
                                    <svg class="w-10 h-10 text-purple-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                                </div>
                                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">C++</span>
                             </div>
                        </div>
                        
                        <div class="space-y-2 text-center md:text-left">
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white">Pipeline Development</h3>
                            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Automating workflows in DCCs. Building robust pipelines with Python & C++ for high-end production.
                            </p>
                        </div>
                    </div>

                    <!-- Skill Card 2: Web Dev (Learning) -->
                    <div class="space-y-4">
                         <div class="flex flex-wrap gap-4 justify-center md:justify-start">
                             <div class="flex flex-col items-center gap-2 group cursor-pointer">
                                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center p-3 transition-all group-hover:shadow-lg group-hover:scale-105">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" alt="Vue" class="w-10 h-10" />
                                </div>
                                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Vue.js</span>
                             </div>
                             <div class="flex flex-col items-center gap-2 group cursor-pointer">
                                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center p-3 transition-all group-hover:shadow-lg group-hover:scale-105">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="TypeScript" class="w-10 h-10" />
                                </div>
                                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">TypeScrpt</span>
                             </div>
                             <div class="flex flex-col items-center gap-2 group cursor-pointer">
                                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center p-3 transition-all group-hover:shadow-lg group-hover:scale-105">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" alt="Node.js" class="w-10 h-10" />
                                </div>
                                <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Node.js</span>
                             </div>
                        </div>

                        <div class="space-y-2 text-center md:text-left">
                            <h3 class="text-xl font-bold text-gray-800 dark:text-white">Web Development (Learning)</h3>
                            <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                                Building personal tools and dashboards. Exploring modern web stack as a learning journey.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Proficiency Section (Separate) -->
            <div class="mb-16">
                 <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Proficiency</h2>
                 <div class="space-y-6">
                    <!-- Skill Bar: Python -->
                     <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-base font-medium text-gray-700 dark:text-gray-300">Python</span>
                            <span class="text-sm font-medium text-blue-600 dark:text-blue-400">95%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div class="bg-blue-600 h-2.5 rounded-full" style="width: 95%"></div>
                        </div>
                    </div>
                    
                    <!-- Skill Bar: C++ -->
                     <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-base font-medium text-gray-700 dark:text-gray-300">C++</span>
                            <span class="text-sm font-medium text-blue-600 dark:text-blue-400">85%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div class="bg-blue-600 h-2.5 rounded-full" style="width: 85%"></div>
                        </div>
                    </div>
                    
                    <!-- Skill Bar: Maya API -->
                     <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-base font-medium text-gray-700 dark:text-gray-300">Maya API / PyMel</span>
                            <span class="text-sm font-medium text-blue-600 dark:text-blue-400">90%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div class="bg-teal-500 h-2.5 rounded-full" style="width: 90%"></div>
                        </div>
                    </div>

                     <!-- Skill Bar: Unreal Engine -->
                     <div>
                        <div class="flex justify-between mb-1">
                            <span class="text-base font-medium text-gray-700 dark:text-gray-300">Unreal Engine</span>
                            <span class="text-sm font-medium text-blue-600 dark:text-blue-400">80%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div class="bg-purple-600 h-2.5 rounded-full" style="width: 80%"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Enhanced Contact / Reach Out Section -->
            <div class="flex flex-col md:flex-row items-center gap-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                <!-- Profile Avatar -->
                <div class="relative w-40 h-40 md:w-56 md:h-56 flex-shrink-0">
                    <img class="rounded-full w-full h-full object-cover shadow-2xl border-4 border-white dark:border-gray-800" src="https://github.com/TuanTran208.png" alt="Tuan Tran Profile" />
                </div>

                <!-- Contact Details -->
                <div class="flex-1 text-center md:text-left space-y-6">
                    <h2 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Reach Out to me!</h2>
                    <p class="text-lg text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
                        DISCUSS A PROJECT OR JUST WANT TO SAY HI? MY INBOX IS OPEN FOR ALL.
                    </p>
                    <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                        Senior Pipeline Engineer | Python Specialist <br>
                        Open for opportunities: <strong>Yes</strong>
                    </p>
                    
                    <div class="flex flex-col md:flex-row items-center gap-4 text-gray-600 dark:text-gray-300 font-medium">
                        <div class="flex items-center gap-2">
                            <svg class="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                            <span>Vietnam</span>
                        </div>
                    </div>
                    
                     <!-- Social Links (Repeated for convenience) -->
                    <div class="flex items-center justify-center md:justify-start gap-4 pt-2">
                        <a href="https://github.com/TuanTran208" target="_blank" class="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-transform hover:-translate-y-1 shadow-lg" title="GitHub">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </a>
                        <a href="mailto:tlmtuan2008@gmail.com" class="p-3 bg-red-600 text-white rounded-full hover:bg-red-500 transition-transform hover:-translate-y-1 shadow-lg" title="Email">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Footer Small -->
             <div class="mt-12 pt-8 flex justify-center text-center">
                <p class="text-gray-400 text-xs">© {{ new Date().getFullYear() }} Pandory Hub. Made with ❤️ in Vietnam.</p>
             </div>

          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes wave {
    0% { transform: rotate(0deg); }
    10% { transform: rotate(14deg); }
    20% { transform: rotate(-8deg); }
    30% { transform: rotate(14deg); }
    40% { transform: rotate(-4deg); }
    50% { transform: rotate(10deg); }
    60% { transform: rotate(0deg); }
    100% { transform: rotate(0deg); }
}

.animate-wave {
    animation-name: wave;
    animation-duration: 2.5s;
    animation-iteration-count: infinite;
    transform-origin: 70% 70%;
    display: inline-block;
}
</style>
