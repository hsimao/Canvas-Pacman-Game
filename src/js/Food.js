import { PI } from './utils'
import GameObject from './GameObject'
import ctx, { WSPAN, time, save, translate, setFill, beginPath, arc, fill } from './canvas'

export default class Food extends GameObject {
  constructor(args) {
    super(args)

    const def = {
      eaten: false,
      super: false,
    }

    Object.assign(def, args)
    Object.assign(this, def)
  }

  draw() {
    if (!this.eaten) {
      save(() => {
        translate(this.p)
        setFill('#f99595')

        // 大力丸
        if (this.super) {
          // 閃爍控制
          if (time % 10 < 5) {
            beginPath()
            arc(0, 0, WSPAN / 5, 0, PI(2))
            fill('white')
          }
        } else {
          const r = WSPAN / 20
          ctx.fillRect(-r, -r, r * 2, r * 2)
        }
      })
    }
  }
}
