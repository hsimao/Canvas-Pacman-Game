import { PI } from './utils'

export default class Vec2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  set(x, y) {
    this.x = x
    this.y = y
  }

  move(x, y) {
    this.x += x
    this.y += y
  }

  add(v) {
    return new Vec2(this.x + v.x, this.y + v.y)
  }

  sub(v) {
    return new Vec2(this.x - v.x, this.y - v.y)
  }

  mul(s) {
    return new Vec2(this.x * s, this.y * s)
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  set length(nv) {
    let temp = this.unit.mul(nv)
    this.set(temp.x, temp.y)
  }

  clone() {
    return new Vec2(this.x, this.y)
  }

  toString() {
    return `(${this.x}, ${this.y})`
  }

  equal(v) {
    return this.x == v.x && this.y == v.y
  }

  get angle() {
    return Math.atan2(this.y, this.x)
  }

  get unit() {
    return this.mul(1 / this.length)
  }

  static get ZERO() {
    return new Vec2(0, 0)
  }

  static get UP() {
    return new Vec2(0, -1)
  }

  static get DOWN() {
    return new Vec2(0, 1)
  }

  static get LEFT() {
    return new Vec2(-1, 0)
  }

  static get RIGHT() {
    return new Vec2(1, 0)
  }

  static DIR(str) {
    if (!str) return Vec2.ZERO
    let type = ('' + str).toUpperCase()
    return Vec2[type]
  }

  static DIR_ANGLE(str) {
    switch (str) {
      case 'right':
        return 0
      case 'left':
        return PI()
      case 'up':
        return PI(-0.5)
      case 'down':
        return PI(0.5)
    }
    return 0
  }
}
