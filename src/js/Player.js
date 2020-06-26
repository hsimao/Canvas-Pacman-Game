import Vec2 from './Vec2'
import GameObject from './GameObject'
import ctx, { beginPath, fill } from './canvas'

export default class Player extends GameObject {
  constructor(args) {
    super(args)

    const def = {
      nextDirection: null,
      currentDirection: null,
      isMoving: false,
      speed: 40,
    }

    Object.assign(def, args)
    Object.assign(this, def)
  }

  draw() {
    beginPath()
    ctx.circle(this.p, 5)
    fill('white')
  }

  get directionAngle() {
    return Vec2.DIR_ANGLE(this.currentDirection)
  }
}
