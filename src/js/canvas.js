import Vec2 from './Vec2'

// == 環境變數
const updateFPS = 30 // 每秒執行30次, 控制update的setInterval, (1000/updateFPS)
const bgColor = 'black'
let time = 0
let ww, wh

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

const getVec2 = args => {
  if (args.length === 1) {
    return args[0]
  } else if (args.length === 2) {
    return new Vec2(args[0], args[1])
  }
}

function moveTo() {
  const v = getVec2(arguments)
  ctx.moveTo(v.x, v.y)
}

function lineTo() {
  const v = getVec2(arguments)
  ctx.lineTo(v.x, v.y)
}

function translate() {
  const v = getVec2(arguments)
  ctx.translate(v.x, v.y)
}

function arc() {
  cta.arc.apply(ctx, arguments)
}

function rotate(angle) {
  if (angle !== 0) {
    ctx.rotate(angle)
  }
}

function beginPath() {
  ctx.beginPath()
}

function closePath() {
  ctx.closePath()
}

function setFill(color) {
  ctx.fillStyle = color
}

function setStroke(color) {
  ctx.strokeStyle = color
}

function fill(color) {
  if (color) {
    setFill(color)
  }
  ctx.fill()
}

function stroke(color) {
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
function save(func) {
  ctx.save()
  func()
  ctx.restore()
}

function initCanvas() {
  ww = canvas.width = window.innerWidth //將視窗寬度給canvas寬度 以及 ww 變數
  wh = canvas.height = window.innerHeight
}
initCanvas()

// == 邏輯初始化
function init() {}

// == 更新畫面邏輯
function update() {
  time++ //每秒會累加30
}

// == 畫面更新
function draw() {
  //清空背景
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, ww, wh)

  // == 在這裡開始繪製

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

const a = new Vec2(3, 4)
