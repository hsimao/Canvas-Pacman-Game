import Vec2 from './Vec2'
import Player from './Player'
import { PI } from './utils'
import { WSPAN, save, translate, moveTo, rotate, lineTo, arc, closePath, fill } from './canvas'

export default class pacmanPacman extends Player {
  constructor(args) {
    super(args)

    const def = {
      r: WSPAN / 2,
      deg: Math.PI / 4, //  嘴巴張開的角度
    }

    Object.assign(def, args)
    Object.assign(this, def)
  }

  draw() {
    save(() => {
      translate(this.p)
      rotate(this.directionAngle)

      // 繪製小精靈
      moveTo(Vec2.ZERO())
      rotate(this.deg)
      lineTo(this.r, 0)
      arc(0, 0, this.r, 0, PI(2) - this.deg * 2)
      closePath()
      fill('yellow')
    })
  }
}
