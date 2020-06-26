import { PI } from './utils'
import Vec2 from './Vec2'
import Food from './Food'
import Pacman from './Pacman'
import Ghost from './Ghost'
import gsap from 'gsap'

import ctx, {
  WSPAN,
  GETPOS,
  save,
  translate,
  setStroke,
  beginPath,
  lineTo,
  moveTo,
  stroke,
  rotate,
  arc,
} from './canvas'

export default class GameMap {
  constructor() {
    /* 地圖資料說明
      o => 牆壁
      空的 => 食物
      + => 大力丸
      x => 沒有食物
    */
    this.foods = []
    this.ghosts = []
    this.pacman = null
    this.mapData = [
      'ooooooooooooooooooo',
      'o        o        o',
      'o oo ooo o ooo oo o',
      'o+               +o',
      'o oo o ooooo o oo o',
      'o    o   o   o    o',
      'oooo ooo o ooo oooo',
      'xxxo o       o oxxx',
      'oooo o oo oo o oooo',
      '       oxxxo       ',
      'oooo o ooooo o oooo',
      'xxxo o   x   o oxxx',
      'oooo ooo o ooo oooo',
      'o    o   o   o    o',
      'o oo o ooooo o oo o',
      'o+               +o',
      'o oo ooo o ooo oo o',
      'o        o        o',
      'ooooooooooooooooooo',
    ]

    this.init()
  }

  init() {
    // 創建小精靈
    this.pacman = new Pacman({
      gridP: new Vec2(9, 11),
      gameMapGetWalls: this.getWalls.bind(this),
      gameMapIsWall: this.isWall.bind(this),
    })

    // 小精靈嘴巴動畫
    gsap.to(this.pacman, {
      deg: 0,
      ease: 'linear',
      repeat: -1,
      yoyo: true,
      duration: 0.15,
    })

    // 創建四隻鬼
    this.ghosts = []
    for (let i = 0; i < 4; i++) {
      this.ghosts.push(
        new Ghost({
          gridP: new Vec2(9 + (i % 3) - 1, 9),
          color: ['red', '#ffa928', '#16ebff', '#ff87ab'][i],
          gameMapGetWalls: this.getWalls.bind(this),
          gameMapIsWall: this.isWall.bind(this),
        })
      )
    }

    // 創建食物
    this.foods = []
    for (let i = 0; i < 20; i++) {
      for (let o = 0; o < 20; o++) {
        const foodType = this.isFood(i, o)
        if (foodType) {
          const food = new Food({
            gridP: new Vec2(i, o),
            super: foodType.super,
          })
          this.foods.push(food)
        }
      }
    }
  }

  isFood(i, o) {
    let type = this.getWallContent(i, o)
    if (type === '+' || type === ' ') {
      return {
        super: type === '+',
      }
    }
    return false
  }

  getWallContent(o, i) {
    return this.mapData[i] && this.mapData[i][o]
  }

  isWall(i, o) {
    const type = this.getWallContent(i, o)
    return type === 'o'
  }

  // 取得自己上下左右的牆壁資訊
  getWalls(i, o) {
    return {
      up: this.isWall(i, o - 1),
      down: this.isWall(i, o + 1),
      left: this.isWall(i - 1, o),
      right: this.isWall(i + 1, o),
      none: !this.isWall(i, o),
    }
  }

  draw() {
    for (let i = 0; i < 19; i++) {
      for (let o = 0; o < 19; o++) {
        save(() => {
          translate(GETPOS(i, o))

          // 格子線條
          // setStroke('rgba(255, 255, 255, 0.2)')
          // ctx.strokeRect(-WSPAN / 2, -WSPAN / 2, WSPAN, WSPAN)

          const walltype = this.getWalls(i, o)
          setStroke('blue')
          ctx.lineWidth = WSPAN / 5
          ctx.shadowColor = 'rgb(30, 30, 255)'
          ctx.shadowBlur = 30

          // 將當下位置的上下左右牆壁編碼成為四位數的 0或1
          /*
            {
              up: true,
              down: true,
              left: false,
              right: false
            }
            編譯成為 '1100'
          */
          let typecode = ['up', 'down', 'left', 'right'].map(d => (walltype[d] ? 1 : 0)).join('')
          if (walltype.none) typecode = ''

          // 將牆壁的 typecode 寫出來
          // setFill('white')
          // ctx.fillText(typecode, 0, 0)

          // 有幾面牆
          const countSide = (typecode.match(/1/g) || []).length

          const wallSpan = WSPAN / 4.5
          const wallLen = WSPAN / 2

          // 繪製兩條線的直線牆壁
          // 1100 => 上下有牆壁, 左右沒有牆壁, 繪製由上到下左右兩條線的牆壁
          // 0011 => 上下沒有牆壁, 左右有牆壁, 繪製由左到右兩條線的牆壁
          if (typecode === '1100' || typecode === '0011') {
            save(() => {
              // 如果是 0011 水平兩條線牆壁, 水平旋轉
              if (typecode === '0011') {
                rotate(PI(0.5))
              }
              beginPath()
              // 右邊的線條
              moveTo(wallSpan, -wallLen)
              lineTo(wallSpan, wallLen)
              // 左邊的線
              moveTo(-wallSpan, -wallLen)
              lineTo(-wallSpan, wallLen)
              stroke()
            })
            // 如果只有 2 面牆, 繪製 4分之1 圓弧的牆壁
          } else if (countSide === 2) {
            // 旋轉角度
            const angles = {
              '1010': 0, // 上面跟左邊有牆壁
              '1001': 0.5, // 上面跟右邊有牆壁
              '0101': 1, // 下面跟右邊有牆壁
              '0110': 1.5, // 下面跟左邊有牆壁
            }

            save(() => {
              rotate(PI(angles[typecode]))

              const bigRadius = wallLen + wallSpan
              const smallRadius = wallLen - wallSpan

              beginPath()
              arc(-wallLen, -wallLen, bigRadius, 0, PI(0.5))
              stroke()

              beginPath()
              arc(-wallLen, -wallLen, smallRadius, 0, PI(0.5))
              stroke()
            })
            // 如果只有 1 面牆, 繪製雙線條加上閉合的 2分之1 圓牆壁
          } else if (countSide === 1) {
            // 旋轉角度
            const angles = {
              '1000': 0, // 上面有牆壁
              '0001': 0.5, // 右邊有牆壁
              '0100': 1, // 下面有牆壁
              '0010': 1.5, // 左邊有牆壁
            }

            save(() => {
              rotate(PI(angles[typecode]))
              // 閉合的圓弧
              beginPath()
              arc(0, 0, wallSpan, 0, PI())
              stroke()

              // 雙線條
              beginPath()
              moveTo(wallSpan, -wallLen)
              lineTo(wallSpan, 0)
              moveTo(-wallSpan, -wallLen)
              lineTo(-wallSpan, 0)
              stroke()
            })
            // 如果有 3 面牆, 繪製左右兩邊圓弧跟底線
          } else if (countSide === 3) {
            // 圓弧旋轉角度
            const angles = {
              '1011': 0, // 上、左右有牆壁
              '1101': 0.5, // 上下、右邊有牆壁
              '0111': 1, // 下、左右有牆壁
              '1110': 1.5, // 上下、左邊有牆壁
            }
            save(() => {
              rotate(PI(angles[typecode]))
              const radius = wallLen - wallSpan

              // 左邊圓弧
              beginPath()
              arc(-wallLen, -wallLen, radius, 0, PI(0.5))
              stroke()

              // 右邊圓弧
              beginPath()
              arc(wallLen, -wallLen, radius, PI(0.5), PI(1))
              stroke()

              // 底線
              beginPath()
              moveTo(-wallLen, wallSpan)
              lineTo(wallLen, wallSpan)
              stroke()
            })
          }
        })
      }
    }
  }
}
