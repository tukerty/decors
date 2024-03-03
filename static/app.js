(function () {
  const canvas = document.getElementById('app')
  const ctx = canvas.getContext('2d')

  let mousex = 0
  let mousey = 0
  let mouseDotsVisible = false
  let dotsArray = []
  const rotatorsArray = []

  const size = 100
  const gap = 4

  ctx.canvas.width = window.innerWidth
  ctx.canvas.height = window.innerHeight

  function roundRect (ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === 'undefined') {
      stroke = true
    }
    if (typeof radius === 'undefined') {
      radius = 5
    }
    if (typeof radius === 'number') {
      radius = { tl: radius, tr: radius, br: radius, bl: radius }
    } else {
      var defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side]
      }
    }
    ctx.beginPath()
    ctx.moveTo(x + radius.tl, y)
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
    ctx.closePath()
    if (fill) {
      ctx.fill()
    }
    if (stroke) {
      ctx.stroke()
    }
  }

  function fillSquares (size, gap, round) {
    ctx.fillStyle = '#404040'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    for (let x = 0; x < ctx.canvas.width; x += size + gap) {
      for (let y = 0; y < ctx.canvas.height; y += size + gap) {
        ctx.fillStyle = '#000000'
        roundRect(ctx, x, y, size, size, round, true)
      }
    }
  }

  function drawFlashlight (radius, x, y) {
    const flashlight = ctx.createRadialGradient(x, y, 5, x, y, radius)
    flashlight.addColorStop(0, 'rgba(0,0,0,0.35)')
    flashlight.addColorStop(1, 'rgba(0,0,0,0.85)')
    ctx.fillStyle = flashlight
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
  }

  function drawDots () {
    dotsArray.forEach(dot => {
      ctx.beginPath()
      ctx.globalAlpha = dot.opacity
      ctx.arc(dot.x, dot.y, gap, 0, 2 * Math.PI)
      ctx.fillStyle = dot.color
      ctx.strokeStyle = 'rgba(0,0,0,0)'
      ctx.shadowBlur = 10
      ctx.shadowColor = dot.color
      ctx.fill()
      ctx.stroke()
      ctx.globalAlpha = 1
      ctx.shadowBlur = 0
      ctx.shadowColor = 'rgba(0,0,0,0)'
    })
  }

  function getRandomInt (max) {
    return Math.floor(Math.random() * Math.floor(max))
  }

  function generateDots () {
    dotsArray = dotsArray.filter(dot => {
      return dot.active
    })
    const num = getRandomInt(10) + 10
    const startx = getRandomInt(window.innerHeight % size)
    const starty = getRandomInt(window.innerWidth % size)
    const dir = getRandomInt(10)

    for (let i = 0; i < num; i++) {
      setTimeout(() => {
        let x, y
        switch (dir) {
          case 0:
            x = ((startx + i) * (size + gap) - gap / 2) / 2
            y = ((starty + i % 2) * (size + gap) - gap / 2) / 2
            break
          case 1:
            x = ((startx + i % 2) * (size + gap) - gap / 2) / 2
            y = ((starty + i) * (size + gap) - gap / 2) / 2
            break
          case 2:
            x = ((startx + i) * (size + gap) - gap / 2) / 2
            y = ((starty - i) * (size + gap) - gap / 2) / 2
            break
          case 3:
            x = ((startx + i % 2) * (size + gap) - gap / 2) / 2
            y = ((starty + i % 3) * (size + gap) - gap / 2) / 2
            break
          case 4:
            x = ((startx - i) * (size + gap) - gap / 2) / 2
            y = ((starty + i % 3) * (size + gap) - gap / 2) / 2
            break
          case 5:
            x = ((startx + i % 3) * (size + gap) - gap / 2) / 2
            y = ((starty - i) * (size + gap) - gap / 2) / 2
            break
          case 6:
            x = ((startx - i) * (size + gap) - gap / 2) / 2
            y = ((starty) * (size + gap) - gap / 2) / 2
            break
          case 7:
            x = ((startx + i % 3) * (size + gap) - gap / 2) / 2
            y = ((starty + i) * (size + gap) - gap / 2) / 2
            break
          case 8:
            x = ((startx + i % 3) * (size + gap) - gap / 2) / 2
            y = ((starty + i % 2) * (size + gap) - gap / 2) / 2
            break
          case 9:
            x = ((startx + i % 4) * (size + gap) - gap / 2) / 2
            y = ((starty + i % 3) * (size + gap) - gap / 2) / 2
            break
        }
        const dot = {
          x: x,
          y: y,
          active: true,
          color: '#4bcffa',
          blinked: false,
          opacity: 0
        }
        dot.pulse = setInterval(() => {
          if (!dot.blinked) {
            dot.opacity += 0.05
          } else {
            dot.opacity -= 0.05
          }

          if (dot.opacity > 0.95) {
            dot.blinked = true
          }
          if (dot.blinked && dot.opacity < 0.05) {
            dot.opacity = 0
            dot.active = false
            clearInterval(dot.pulse)
          }
        }, 50)
        dotsArray.push(dot)
      }, i * 100)
    }
  }

  setInterval(() => {
    generateDots()
  }, 500)

  // generateRotators()

  document.addEventListener('mousemove', e => {
    mousex = e.clientX
    mousey = e.clientY
    mouseDotsVisible = true
    transformContainer(mousex, mousey)
  })
  document.addEventListener('touchmove', e => {
    mousex = e.touches[0].clientX
    mousey = e.touches[0].clientY
    transformContainer(mousex, mousey)
  })

  window.addEventListener('resize', e => {
    ctx.canvas.width = window.innerWidth
    ctx.canvas.height = window.innerHeight
  })

  function draw () {
    fillSquares(size, gap, 10)
    drawFlashlight(300, mousex, mousey)
    drawDots(size, gap)
    window.requestAnimationFrame(draw)
  }

  function transformContainer (x, y) {
    const xoffset = x - window.innerWidth / 2
    const yoffset = y - window.innerHeight / 2
    document.querySelector('.container').style.transform = `translateZ(50px) rotateY( ${xoffset / 200}deg ) rotateX(${yoffset / -100}deg)`
  }

  let glow
  setInterval(() => {
    glow = getRandomInt(3) + 7
    document.querySelector('h1 span').style.textShadow = `0 0 ${glow * 4}px #4bcffa,0 0 ${glow * 8}px #4bcffa, 0 0 ${glow * 10}px #4bcffa, 0 0 ${glow * 15}px #4bcffa`
  }, 1000)

  draw()
})()
