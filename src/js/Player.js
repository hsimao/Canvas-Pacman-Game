import Vec2 from './Vec2'
import GameObject from './GameObject'
import { TweenMax } from 'gsap'
import ctx, { GETPOS, beginPath, fill } from './canvas'

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

  moveStep() {
    const i0 = this.gridP.x
    const o0 = this.gridP.y
    const oldDirection = this.currentDirection

    const haveWall = this.gameMapGetWalls(this.gridP.x, this.gridP.y)

    if (!haveWall[this.nextDirection] && this.nextDirection) {
      this.currentDirection = this.nextDirection
    }
    this.gridP = this.gridP.add(Vec2.DIR(this.currentDirection))

    const isWall = this.gameMapIsWall(this.gridP.x, this.gridP.y)
    if (!isWall) {
      this.isMoving = true
      let moveStepTime = 10 / this.speed

      // 如果超出左邊界, 且是往左邊走，順移到右邊
      if (this.gridP.x <= -1 && this.currentDirection === 'left') {
        moveStepTime = 0
        this.gridP.x = 18
      }

      // 如果超出右邊邊界, 且是往右邊走，順移到左邊
      if (this.gridP.x >= 19 && this.currentDirection === 'right') {
        moveStepTime = 0
        this.gridP.x = 0
      }

      TweenMax.to(this.p, moveStepTime, {
        ...GETPOS(this.gridP),
        ease: 'linear',
        onComplete: () => {
          this.isMoving = false
          this.moveStep()
        },
      })
    } else {
      this.gridP.set(i0, o0)
      this.currentDirection = oldDirection
    }
  }
}
