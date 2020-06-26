import Vec2 from './Vec2'
import { WSPAN, GETPOS } from './canvas'

export default class GameObject {
  constructor(args) {
    const def = {
      p: new Vec2.ZERO(),
      gridP: new Vec2.ZERO(),
    }

    Object.assign(def, args)
    Object.assign(this, def)

    this.p = GETPOS(this.gridP)
  }

  collide(gobj) {
    return this.p.sub(gobj.p).length < WSPAN
  }
}
