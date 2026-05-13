import type { LanyardConfig, LanyardState } from '~/types/lanyard'

export function createLanyardPhysics(config: LanyardConfig): LanyardState {
  const points      = []
  const constraints = []

  for (let i = 0; i <= config.numSegments; i++) {
    const t = i / config.numSegments
    points.push({
      pos:     { x: 0, y: -t * config.ropeLength, z: 0 },
      prevPos: { x: 0, y: -t * config.ropeLength, z: 0 },
      acc:     { x: 0, y: 0, z: 0 },
      pinned:  i === 0,
    })
  }

  const segLen = config.ropeLength / config.numSegments
  for (let i = 0; i < config.numSegments; i++) {
    constraints.push({ a: i, b: i + 1, restLength: segLen, stiffness: 0.98 })
  }

  return {
    points, constraints,
    isDragging: false, dragPointIndex: -1,
    mouseWorldPos: { x: 0, y: 0, z: 0 },
  }
}

export function stepPhysics(state: LanyardState, config: LanyardConfig, dt: number): void {
  const dtSafe = Math.min(dt, 1 / 30)

  // 1. Verlet integration
  for (const p of state.points) {
    if (!p || p.pinned) continue
    const vx = (p.pos.x - p.prevPos.x) * (1 - config.damping)
    const vy = (p.pos.y - p.prevPos.y) * (1 - config.damping)
    const vz = (p.pos.z - p.prevPos.z) * (1 - config.damping)
    const nx = p.pos.x + vx + p.acc.x * dtSafe * dtSafe
    const ny = p.pos.y + vy - config.gravity * dtSafe * dtSafe
    const nz = p.pos.z + vz + p.acc.z * dtSafe * dtSafe
    p.prevPos = { ...p.pos }
    p.pos = { x: nx, y: ny, z: nz }
    p.acc = { x: 0, y: 0, z: 0 }
  }

  // 2. Paksa titik drag ke posisi mouse dengan lerp
  if (state.isDragging && state.dragPointIndex >= 0) {
    const dp = state.points[state.dragPointIndex]
    if (dp) {
      const m  = state.mouseWorldPos
      const s  = 0.4  // lerp speed
      dp.pos.x += (m.x - dp.pos.x) * s
      dp.pos.y += (m.y - dp.pos.y) * s
      dp.pos.z += (m.z - dp.pos.z) * s
      dp.prevPos = { ...dp.pos }
    }
  }

  // 3. Selesaikan constraint
  for (let iter = 0; iter < config.constraintIterations; iter++) {
    for (const c of state.constraints) {
      const pa = state.points[c.a]
      const pb = state.points[c.b]
      if (!pa || !pb) continue
      
      const dx = pb.pos.x - pa.pos.x
      const dy = pb.pos.y - pa.pos.y
      const dz = pb.pos.z - pa.pos.z
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001
      const diff = ((dist - c.restLength) / dist) * 0.5 * c.stiffness
      if (!pa.pinned) { pa.pos.x += dx * diff; pa.pos.y += dy * diff; pa.pos.z += dz * diff }
      if (!pb.pinned) { pb.pos.x -= dx * diff; pb.pos.y -= dy * diff; pb.pos.z -= dz * diff }
    }
  }
}
