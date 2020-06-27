import Vec2 from './Vec2'
import Player from './Player'
import { PI } from './utils'
import { WSPAN, save, translate, moveTo, rotate, lineTo, arc, closePath, fill } from './canvas'
import { TweenMax } from 'gsap'

export default class pacmanPacman extends Player {
  constructor(args) {
    super(args)

    const def = {
      r: WSPAN / 2,
      deg: Math.PI / 4, //  嘴巴張開的角度
      deadDeg: 0,
      isDead: false,
    }

    Object.assign(def, args)
    Object.assign(this, def)
  }

  draw() {
    let useDeg = this.deg
    if (this.isDead) {
      useDeg = this.deadDeg
    }

    save(() => {
      translate(this.p)
      rotate(this.directionAngle)

      // 繪製小精靈
      moveTo(Vec2.ZERO())
      rotate(useDeg)
      lineTo(this.r, 0)
      arc(0, 0, this.r, 0, PI(2) - useDeg * 2)
      closePath()
      fill('yellow')
    })
  }

  die() {
    if (!this.isDead) {
      this.isDead = true
      TweenMax.killAll()
      this.deadDeg = 0
      TweenMax.to(this, 1.5, {
        deadDeg: PI(),
        ease: 'linear',
        delay: 1,
      })
    }
  }
}
