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
      isEatableCounter: 0, // 可以被吃的時間(秒)
      // 追蹤條件, 判斷鬼自己的座標與小精靈座標
      traceGoCondition: [
        {
          name: 'left',
          condition: target => this.gridP.x > target.x,
        },
        {
          name: 'right',
          condition: target => this.gridP.x < target.x,
        },
        {
          name: 'up',
          condition: target => this.gridP.y > target.y,
        },
        {
          name: 'down',
          condition: target => this.gridP.y < target.y,
        },
      ],
    }

    Object.assign(def, args)
    Object.assign(this, def)
  }

  draw() {
    save(() => {
      translate(this.p)

      if (!this.isDead) {
        // 繪製鬼身體
        beginPath()
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

        // 如果可以吃的時間小於 3 秒, 產生閃爍的白色效果
        const eatableColor = this.isEatableCounter > 3 || time % 10 < 5 ? '#1f37ef' : '#fff'

        fill(!this.isEatable ? this.color : eatableColor)
      }

      const hasEye = !this.isEatable || this.isDead

      // 眼白
      const eyeR = this.r / 3
      const innerEyeR = eyeR / 2

      if (hasEye) {
        beginPath()
        arc(-this.r / 2.5, -eyeR, eyeR, 0, PI(2))
        arc(this.r / 2.5, -eyeR, eyeR, 0, PI(2))
        fill('white')
      }

      // 眼珠
      save(() => {
        // 依據當前走動方向，調整眼珠位置
        const innerEyePan = Vec2.DIR(this.currentDirection).mul(innerEyeR)
        translate(innerEyePan)

        beginPath()
        arc(-this.r / 2.5, -eyeR, innerEyeR, 0, PI(2))
        arc(this.r / 2.5, -eyeR, innerEyeR, 0, PI(2))
        fill(hasEye ? 'black' : 'white')
      })
    })
  }

  setEatable(second) {
    this.isEatableCounter = second
    if (!this.isEatable) {
      this.isEatable = true

      const func = () => {
        this.isEatableCounter--
        console.log('isEatableCounter', this.isEatableCounter)

        if (this.isEatableCounter <= 0) {
          this.isEatable = false
        } else {
          setTimeout(func, 1000)
        }
      }
      func()
    }
  }

  // 鬼的移動 AI 邏輯
  // 可以走動，並朝小精靈的方向隨機選一個
  // 如果沒有朝小精靈的方向，就從當前可以走的方向隨機選一個
  getNextDirection(map, pacman) {
    // 如果鬼死掉了, 移動目標改成地圖中心點
    const currentTarget = this.isDead ? new Vec2(9, 9) : pacman.gridP
    const go = true // 往目標 true, 遠離目標 false

    // 依據定義好的方向規則，找出可以走的方向
    const traceGo = this.traceGoCondition
      .filter(obj => {
        const cond = obj.condition(currentTarget)
        // 如果是要追蹤小精靈的話直接回傳，如果不是就回傳反的
        return go ? cond : !cond
      })
      .map(obj => obj.name)

    const haveWall = map.getWalls(this.gridP.x, this.gridP.y)

    // 判斷要走的方向在當前位置是否有牆壁
    const traceGoAnCanGo = traceGo
      .filter(d => !haveWall[d])
      // 不能走回頭路
      .filter(d => Vec2.DIR(d).add(Vec2.DIR(this.currentDirection)).length !== 0)

    // 不判斷可追蹤小精靈的方向，單純找出沒有牆壁擋住，可以走的方向
    const availGo = ['left', 'right', 'up', 'down'].filter(d => !haveWall[d])

    // 排除鬼打牆的移動, 例如小精靈在下面，但鬼下面有牆壁, 所以往上移動一格後就馬上往下，導致一直上下移動鬼打牆
    // 如果現在走的方向只有兩個
    if (availGo.length === 2) {
      // 如果現在可以走的方向是直向(上下), 或橫向(左右)
      if ((haveWall.up && haveWall.down) || (haveWall.left && haveWall.right)) {
        // 讓他繼續依據當下移動的方向在移動一格，不加入追蹤機制來移動
        return this.currentDirection
      }
    }

    // 如果要追蹤或遠離小精靈的方向有值就使用, 否則用單純判斷沒有牆壁擋住的方向
    const finalPossibleSets = traceGoAnCanGo.length ? traceGoAnCanGo : availGo

    // 隨機找個方向移動, 如果都沒有就往上 'up'
    const finalDecision = finalPossibleSets[parseInt(Math.random() * finalPossibleSets.length)] || 'up'

    return finalDecision
  }

  die() {
    this.isDead = true
  }

  reLive() {
    this.isDead = false
    this.isEatable = false
  }
}
