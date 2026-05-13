export interface Vec3 {
  x: number; y: number; z: number
}

export interface PointMass {
  pos:     Vec3
  prevPos: Vec3
  acc:     Vec3
  pinned:  boolean   // true = anchor di atas, tidak bergerak
}

export interface Constraint {
  a:          number   // index titik A
  b:          number   // index titik B
  restLength: number   // panjang istirahat (world units)
  stiffness:  number   // 0-1
}

export interface LanyardConfig {
  numSegments:          number   // jumlah titik tali (default: 24)
  ropeLength:           number   // panjang total tali (default: 4.5)
  gravity:              number   // percepatan jatuh (default: 12)
  damping:              number   // hambatan udara 0-1 (default: 0.015)
  constraintIterations: number   // iterasi per frame (default: 8)
  cardWidth:            number
  cardHeight:           number
  cardTexturePath:      string   // path PNG template kartu
}

export interface LanyardState {
  points:          PointMass[]
  constraints:     Constraint[]
  isDragging:      boolean
  dragPointIndex:  number
  mouseWorldPos:   Vec3
}
