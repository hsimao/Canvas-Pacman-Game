import Vec2 from './Vec2'
import GameMap from './GameMap'

// == 環境變數
const updateFPS = 30 // 每秒執行30次, 控制update的setInterval, (1000/updateFPS)
const bgColor = 'black'
export let time = 0
let ww, wh, gameMap

// == canvas初始化
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

// 快速繪製圓形方法 => ctx.circal(向量座標, 半徑)
ctx.circle = function(v, r) {
  this.arc(v.x, v.y, r, 0, Math.PI * 2)
}

//快速繪製線條方法 => ctx.line(起始點座標, 結束點座標)
ctx.line = function(v1, v2) {
  this.moveTo(v1.x, v1.y)
  this.lineTo(v2.x, v2.y)
}

export const getVec2 = args => {
  if (args.length === 1) {
    return args[0]
  } else if (args.length === 2) {
    return new Vec2(args[0], args[1])
  }
}

export function moveTo() {
  const v = getVec2(arguments)
  ctx.moveTo(v.x, v.y)
}

export function lineTo() {
  const v = getVec2(arguments)
  ctx.lineTo(v.x, v.y)
}

export function translate() {
  const v = getVec2(arguments)
  ctx.translate(v.x, v.y)
}

export function arc() {
  ctx.arc.apply(ctx, arguments)
}

export function rotate(angle) {
  if (angle !== 0) {
    ctx.rotate(angle)
  }
}

export function beginPath() {
  ctx.beginPath()
}

export function closePath() {
  ctx.closePath()
}

export function setFill(color) {
  ctx.fillStyle = color
}

export function setStroke(color) {
  ctx.strokeStyle = color
}

export function fill(color) {
  if (color) {
    setFill(color)
  }
  ctx.fill()
}

export function stroke(color) {
  if (color) {
    setStroke(color)
  }
  ctx.stroke()
}

// 封裝 save 跟 restore 的 wrapper
/* 用法
  save(() => {
    stroke(255)
    translate(3, 5)
    fill()
  })
*/
export function save(func) {
  ctx.save()
  func()
  ctx.restore()
}

function initCanvas() {
  ww = canvas.width = window.innerWidth //將視窗寬度給canvas寬度 以及 ww 變數
  wh = canvas.height = window.innerHeight
}
initCanvas()

// 地圖格子的寬高, 要繪製 20 x 20 格子, 確保都在範圍內，除 24
export const WSPAN = Math.min(ww, wh) / 20

export function GETPOS(i, o) {
  const sourceV = getVec2(arguments)
  return sourceV.mul(WSPAN).add(new Vec2(WSPAN / 2, WSPAN / 2))
}

// == 邏輯初始化
function init() {
  gameMap = new GameMap()
}

// == 更新畫面邏輯
function update() {
  time++ //每秒會累加30

  // 讓鬼隨機移動
  gameMap.ghosts.forEach(ghost => {
    ghost.nextDirection = ['left', 'right', 'up', 'down'][parseInt(Math.random() * 4)]
    if (!ghost.isMoving) {
      ghost.moveStep()
    }
  })

  // 判斷碰到食物, 將食物吃掉
  const currentFood = gameMap.foods.find(food => {
    return food.gridP.sub(gameMap.pacman.gridP).length <= 3 && food.p.sub(gameMap.pacman.p).length <= WSPAN / 2
  })

  if (currentFood && !currentFood.eaten) {
    currentFood.eaten = true

    // 吃到大力丸時, 有 10秒 鬼可以被小精靈吃掉
    if (currentFood.super) {
      gameMap.ghosts.forEach(ghost => {
        ghost.setEatable(10)
      })
    }
  }
}

// == 畫面更新
function draw() {
  //清空背景
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, ww, wh)

  // == 在這裡開始繪製
  save(() => {
    // 置中
    translate(ww / 2 - WSPAN * 10, wh / 2 - WSPAN * 10)
    gameMap.draw()
    gameMap.foods.forEach(food => food.draw())
    gameMap.pacman.draw()
    gameMap.ghosts.forEach(ghost => ghost.draw())
  })

  ctx.save()
  ctx.beginPath()
  ctx.fillStyle = 'white'
  ctx.circle(mousePos, time % 30)
  ctx.fill()
  ctx.restore()

  // 滑鼠
  ctx.fillStyle = 'red'
  ctx.beginPath()
  ctx.circle(mousePos, 3)
  ctx.fill()

  ctx.save()
  ctx.beginPath()
  ctx.translate(mousePos.x, mousePos.y)
  ctx.strokeStyle = 'red'
  let len = 20
  ctx.line(new Vec2(-len, 0), new Vec2(len, 0))
  ctx.fillText(mousePos, 10, -10)
  ctx.rotate(Math.PI / 2)
  ctx.line(new Vec2(-len, 0), new Vec2(len, 0))
  ctx.stroke()
  ctx.restore()
  // == 繪製End ==

  requestAnimationFrame(draw) //預定下一次執行
}

// == canvas 頁面載入執行順序控制
function loaded() {
  initCanvas()
  init()
  requestAnimationFrame(draw) //繪製畫面用-盡可能地快速執行
  setInterval(update, 1000 / updateFPS) //更新畫面邏輯用Interval
}
window.addEventListener('load', loaded)
window.addEventListener('resize', initCanvas) //重新設置寬、高

export default ctx

// == 滑鼠事件 ==
var mousePos = new Vec2(0, 0) //滑鼠移動時的向量座標
var mousePosDown = new Vec2(0, 0) //滑鼠按下時的向量座標
var mousePosUp = new Vec2(0, 0) //滑鼠放開時的向量座標

window.addEventListener('mousemove', mousemove)
window.addEventListener('mouseup', mouseup)
window.addEventListener('mousedown', mousedown)

function mousemove(e) {
  mousePos.set(e.x, e.y)
}

function mouseup(e) {
  mousePos.set(e.x, e.y)
  mousePosUp = mousePos.clone()
}

function mousedown(e) {
  mousePos.set(e.x, e.y)
  mousePosDown = mousePos.clone()
}
// ==滑鼠事件End ==

// 鍵盤事件
window.addEventListener('keydown', function(evt) {
  gameMap.pacman.nextDirection = evt.key.replace('Arrow', '').toLowerCase()
  if (!gameMap.pacman.isMoving) {
    gameMap.pacman.moveStep()
  }
})
