import Vec2 from './Vec2'
import Player from './Player'
import { PI } from './utils'
import { WSPAN, time, save, translate, lineTo, arc, closePath, fill, beginPath } from './canvas'

export default class pacmanPacman extends Player {
  constructor(args) {
    super(args)

    const def = {
      r: WSPAN / 2,
      color: 'red',
      isEatable: false, // 是否可以被吃
      isDead: false,
    }

    Object.assign(def, args)
    Object.assign(this, def)
  }

  draw() {
    save(() => {
      translate(this.p)
      beginPath()

      // 繪製鬼身體
      arc(0, 0, this.r, PI(), 0)
      lineTo(this.r, this.r)

      // 算出底部產生七個鋸齒狀的寬度
      let tt = parseInt(time / 3)
      const ttSpan = (this.r * 2) / 7
      const ttHeight = this.r / 3

      // 繪製鋸齒
      for (let i = 0; i < 7; i++) {
        lineTo(this.r * 0.9 - ttSpan * i, (((i + tt) % 2) - 1) * ttHeight + this.r)
      }

      lineTo(-this.r, this.r)
      closePath()
      fill(this.color)

      // 眼白
      const eyeR = this.r / 3
      const innerEyeR = eyeR / 2

      beginPath()
      arc(-this.r / 2.5, -eyeR, eyeR, 0, PI(2))
      arc(this.r / 2.5, -eyeR, eyeR, 0, PI(2))
      fill('white')

      // 眼珠
      save(() => {
        // 依據當前走動方向，調整眼珠位置
        const innerEyePan = Vec2.DIR(this.currentDirection).mul(innerEyeR)
        translate(innerEyePan)

        beginPath()
        arc(-this.r / 2.5, -eyeR, innerEyeR, 0, PI(2))
        arc(this.r / 2.5, -eyeR, innerEyeR, 0, PI(2))
        fill('black')
      })
    })
  }
}
