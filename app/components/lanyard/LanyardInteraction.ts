import * as THREE from 'three'
import type { LanyardState } from '~/types/lanyard'

export function setupDragInteraction(
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
  state: LanyardState
) {
  const raycaster = new THREE.Raycaster()
  const pointer   = new THREE.Vector2()
  const plane     = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
  const hit       = new THREE.Vector3()

  const toWorld = (clientX: number, clientY: number): THREE.Vector3 | null => {
    const r       = canvas.getBoundingClientRect()
    pointer.x     =  ((clientX - r.left) / r.width)  * 2 - 1
    pointer.y     = -((clientY - r.top)  / r.height) * 2 + 1
    raycaster.setFromCamera(pointer, camera)
    return raycaster.ray.intersectPlane(plane, hit) ? hit.clone() : null
  }

  const nearestDraggable = (world: THREE.Vector3): number => {
    const start = Math.floor(state.points.length * 0.6)  // 40% titik terbawah
    let bestIdx = -1, bestDist = Infinity
    for (let i = start; i < state.points.length; i++) {
      const p = state.points[i]
      if (!p) continue
      const d = world.distanceTo(new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z))
      if (d < bestDist) { bestDist = d; bestIdx = i }
    }
    return bestDist < 1.5 ? bestIdx : -1
  }

  const getClientPos = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      const touch = e.touches[0]
      return touch ? { clientX: touch.clientX, clientY: touch.clientY } : null
    }
    return { clientX: (e as MouseEvent).clientX, clientY: (e as MouseEvent).clientY }
  }

  const onDown = (e: MouseEvent | TouchEvent) => {
    const pos = getClientPos(e)
    if (!pos) return
    const world = toWorld(pos.clientX, pos.clientY)
    if (!world) return
    const idx = nearestDraggable(world)
    if (idx >= 0) {
      state.isDragging     = true
      state.dragPointIndex = idx
      canvas.style.cursor  = 'grabbing'
    }
  }

  const onMove = (e: MouseEvent | TouchEvent) => {
    const pos = getClientPos(e)
    if (!pos) return
    if (state.isDragging) {
      const world = toWorld(pos.clientX, pos.clientY)
      if (world) state.mouseWorldPos = { x: world.x, y: world.y, z: world.z }
    } else {
      const world = toWorld(pos.clientX, pos.clientY)
      canvas.style.cursor = (world && nearestDraggable(world) >= 0) ? 'grab' : 'default'
    }
  }

  const onUp = () => {
    state.isDragging     = false
    state.dragPointIndex = -1
    canvas.style.cursor  = 'default'
  }

  canvas.addEventListener('mousedown',  onDown)
  window.addEventListener('mousemove',  onMove)
  window.addEventListener('mouseup',    onUp)
  canvas.addEventListener('touchstart', onDown, { passive: true })
  window.addEventListener('touchmove',  onMove, { passive: true })
  window.addEventListener('touchend',   onUp)

  return () => {
    canvas.removeEventListener('mousedown',  onDown)
    window.removeEventListener('mousemove',  onMove)
    window.removeEventListener('mouseup',    onUp)
    canvas.removeEventListener('touchstart', onDown)
    window.removeEventListener('touchmove',  onMove)
    window.removeEventListener('touchend',   onUp)
  }
}
