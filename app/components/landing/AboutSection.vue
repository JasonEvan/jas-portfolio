<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  Layers,
  Database,
  BrainCircuit,
  Server,
  GraduationCap,
  Code2,
} from "lucide-vue-next";

const sectionTitle = ref<HTMLElement | null>(null);
const textContent = ref<HTMLElement | null>(null);
const techCard = ref<HTMLElement[]>([]);

const { splitTextReveal, revealOnScroll } = useGsap();
const { $ScrollTrigger } = useNuxtApp();

onMounted(() => {
  if (sectionTitle.value) splitTextReveal(sectionTitle.value);
  if (textContent.value) revealOnScroll(textContent.value, 0.1);
  if (techCard.value.length) revealOnScroll(techCard.value, 0.2);
  $ScrollTrigger?.refresh();
});
</script>

<template>
  <section id="about" class="about-section">
    <div class="container mx-auto max-w-6xl px-6 lg:px-10">
      <div class="mb-10">
        <h2
          ref="sectionTitle"
          class="text-gradient text-3xl font-semibold tracking-tight md:text-4xl"
        >
          About Me
        </h2>
      </div>

      <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div class="lg:col-span-7">
          <div
            ref="textContent"
            class="space-y-5 text-base leading-relaxed text-slate-200/90 md:text-lg"
          >
            <p>
              Saya adalah mahasiswa Computer Science di Universitas Bina
              Nusantara (BINUS) yang sangat tertarik pada pengembangan web,
              terutama backend development. Saya menikmati merancang arsitektur
              yang rapi, aman, dan dapat diandalkan untuk mendukung produk
              digital yang skalabel.
            </p>
            <p>
              Selain itu, saya terus mengeksplorasi pengembangan aplikasi mobile
              dan machine learning engineering untuk memperluas cara saya
              membangun solusi cerdas yang berdampak pada kebutuhan nyata.
            </p>
          </div>

          <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div
              ref="techCard"
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <div class="flex items-center gap-3">
                <Layers class="h-5 w-5 text-slate-200/80" />
                <h3
                  class="text-sm font-semibold uppercase tracking-wide text-slate-200/80"
                >
                  Modern Web
                </h3>
              </div>
              <p class="mt-3 text-sm text-slate-300/80">
                Nuxt, Next.js, &amp; NestJS
              </p>
            </div>

            <div
              ref="techCard"
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <div class="flex items-center gap-3">
                <Database class="h-5 w-5 text-slate-200/80" />
                <h3
                  class="text-sm font-semibold uppercase tracking-wide text-slate-200/80"
                >
                  Database
                </h3>
              </div>
              <p class="mt-3 text-sm text-slate-300/80">
                Scalable MySQL & PostgreSQL
              </p>
            </div>

            <div
              ref="techCard"
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <div class="flex items-center gap-3">
                <BrainCircuit class="h-5 w-5 text-slate-200/80" />
                <h3
                  class="text-sm font-semibold uppercase tracking-wide text-slate-200/80"
                >
                  ML &amp; AI
                </h3>
              </div>
              <p class="mt-3 text-sm text-slate-300/80">
                Python &amp; Automation
              </p>
            </div>

            <div
              ref="techCard"
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md"
            >
              <div class="flex items-center gap-3">
                <Server class="h-5 w-5 text-slate-200/80" />
                <h3
                  class="text-sm font-semibold uppercase tracking-wide text-slate-200/80"
                >
                  Efficiency
                </h3>
              </div>
              <p class="mt-3 text-sm text-slate-300/80">Real-world Solutions</p>
            </div>
          </div>

          <blockquote
            class="mt-8 border-l border-white/15 pl-4 text-sm italic text-slate-300/90"
          >
            Saya berkomitmen membangun software yang efisien dan berdampak,
            menghadirkan solusi nyata yang kuat, terukur, dan relevan untuk
            kebutuhan pengguna.
          </blockquote>
        </div>

        <div class="lg:col-span-5">
          <div
            class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:p-8"
          >
            <div class="flex items-start justify-between gap-6">
              <div>
                <h3 class="text-xl font-semibold text-slate-100">
                  Academic Focus
                </h3>
                <p class="mt-1 text-sm text-slate-300/80">
                  Computer Science @ BINUS
                </p>
              </div>
              <div class="rounded-xl border border-white/10 bg-white/5 p-3">
                <GraduationCap class="h-5 w-5 text-slate-200/80" />
              </div>
            </div>

            <div class="mt-8 space-y-5">
              <div>
                <div
                  class="flex items-center justify-between text-sm text-slate-200/90"
                >
                  <span>Backend Architecture</span>
                  <span>90%</span>
                </div>
                <div class="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div
                    class="h-2 rounded-full bg-linear-to-r from-sky-400 to-indigo-500"
                    style="width: 90%"
                  ></div>
                </div>
              </div>

              <div>
                <div
                  class="flex items-center justify-between text-sm text-slate-200/90"
                >
                  <span>Full-stack Ecosystem</span>
                  <span>85%</span>
                </div>
                <div class="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div
                    class="h-2 rounded-full bg-linear-to-r from-teal-400 to-cyan-500"
                    style="width: 85%"
                  ></div>
                </div>
              </div>

              <div>
                <div
                  class="flex items-center justify-between text-sm text-slate-200/90"
                >
                  <span>Machine Learning</span>
                  <span>70%</span>
                </div>
                <div class="mt-2 h-2 w-full rounded-full bg-white/10">
                  <div
                    class="h-2 rounded-full bg-linear-to-r from-amber-400 to-orange-500"
                    style="width: 70%"
                  ></div>
                </div>
              </div>
            </div>

            <div class="mt-6 rounded-xl border border-white/10 bg-white/5 p-5">
              <div class="flex items-start gap-3">
                <p class="text-sm text-slate-300/85">
                  Fokus saya adalah membangun sistem yang scalable dan
                  teroptimasi, menjembatani logika backend yang kompleks dengan
                  antarmuka yang intuitif.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 96px 0;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(
      1200px 520px at 10% -10%,
      rgba(255, 255, 255, 0.08),
      transparent 60%
    ),
    radial-gradient(
      900px 520px at 90% 0%,
      rgba(255, 255, 255, 0.06),
      transparent 55%
    );
}
</style>
