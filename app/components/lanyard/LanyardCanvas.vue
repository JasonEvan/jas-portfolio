<script setup lang="ts">
import { createLanyardPhysics, stepPhysics } from './LanyardPhysics'
import { createLanyardScene }                from './LanyardRenderer'
import { setupDragInteraction }              from './LanyardInteraction'
import type { LanyardConfig }               from '~/types/lanyard'

const props = defineProps<{
  photoBase64?: string   // field lanyardPhotoBase64 dari Firestore
  name?:        string
  role?:        string
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let rafId: number, lastTs = 0

const config: LanyardConfig = {
  numSegments:          24,
  ropeLength:           4.5,
  gravity:              12,
  damping:              0.015,
  constraintIterations: 8,
  cardWidth:            1.4,
  cardHeight:           2.0,
  cardTexturePath:      '/images/lanyard/card-template.png',
}

onMounted(async () => {
  await nextTick()
  if (!canvasRef.value) return

  const physics                                   = createLanyardPhysics(config)
  const { render, updateFromState, setPhotoBase64, camera, dispose } =
    createLanyardScene(canvasRef.value, config)
  const cleanDrag = setupDragInteraction(canvasRef.value, camera, physics)

  // Tampilkan foto dari Firestore base64
  if (props.photoBase64) setPhotoBase64(props.photoBase64)

  lastTs = performance.now()
  const loop = (ts: number) => {
    const dt = (ts - lastTs) / 1000
    lastTs   = ts
    stepPhysics(physics, config, dt)
    updateFromState(physics)
    render()
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)

  // Force resize after a short delay to ensure DOM dimensions are settled
  setTimeout(() => {
    window.dispatchEvent(new Event('resize'))
  }, 100)

  onUnmounted(() => { cancelAnimationFrame(rafId); cleanDrag(); dispose() })
})

// Jika foto diupdate dari admin, muat ulang tekstur
watch(() => props.photoBase64, (val) => {
  // setPhotoBase64(val) — would need to expose it if needed
})
</script>

<template>
  <div class="lanyard-wrap">
    <canvas ref="canvasRef" class="lanyard-canvas" />
    <span class="lanyard-hint">Seret kartu ↕</span>
  </div>
</template>

<style scoped>
.lanyard-wrap {
  position: relative;
  width: 100%;
  max-width: 380px;
  height: 700px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lanyard-canvas {
  width: 100%;
  height: 100%;
  border-radius: 20px;
  cursor: grab;
}
.lanyard-hint {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.28);
  pointer-events: none;
  animation: float 2.4s ease-in-out infinite;
}
@keyframes float {
  0%, 100% { transform: translateX(-50%) translateY(0);   }
  50%       { transform: translateX(-50%) translateY(-8px); }
}
</style>
