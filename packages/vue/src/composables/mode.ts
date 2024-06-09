import { CoolModeContextKey, type Context, type Particle, type RainbowKitPluginOptions } from '@/types'
import { inject, ref } from 'vue'

let instanceCounter = 0
export function createCoolModeContext(option: RainbowKitPluginOptions):Context<boolean>{
  const context = ref<boolean>(option.coolMode ?? false);
  return context;
}

export function useCoolModeContext(){
  const context = inject(CoolModeContextKey);
  if(!context) throw Error(`Could not find injected '${String(CoolModeContextKey)}' instance.`);
  return context;
}

const getContainer = () => {
  const id = '_rk_coolMode'
  const existingContainer = document.getElementById(id)

  if (existingContainer) {
    return existingContainer
  }

  const container = document.createElement('div')
  container.setAttribute('id', id)
  container.setAttribute(
    'style',
    [
      'overflow:hidden',
      'position:fixed',
      'height:100%',
      'top:0',
      'left:0',
      'right:0',
      'bottom:0',
      'pointer-events:none',
      'z-index:2147483647'
    ].join(';')
  )

  document.body.appendChild(container)

  return container
}

export const createElementCool = (
  element: HTMLElement,
  imageUrl: string,
): (() => void) => {
  instanceCounter++

  const sizes = [15, 20, 25, 35, 45]
  const limit = 35

  let particles: Particle[] = []
  let autoAddParticle = false
  let mouseX = 0
  let mouseY = 0
  let animationFrame: number | undefined

  const container = getContainer()

  function createParticle() {
    const size = sizes[Math.floor(Math.random() * sizes.length)]
    const speedHorz = Math.random() * 10
    const speedUp = Math.random() * 25
    const spinVal = Math.random() * 360
    const spinSpeed = Math.random() * 35 * (Math.random() <= 0.5 ? -1 : 1)
    const top = mouseY - size / 2
    const left = mouseX - size / 2
    const direction = Math.random() <= 0.5 ? -1 : 1

    const particle = document.createElement('div')
    particle.innerHTML = `<img src="${imageUrl}" width="${size}" height="${size}" style="border-radius: 25%">`
    particle.setAttribute(
      'style',
      [
        'position:absolute',
        'will-change:transform',
        `top:${top}px`,
        `left:${left}px`,
        `transform:rotate(${spinVal}deg)`
      ].join(';')
    )

    container.appendChild(particle)

    particles.push({
      direction,
      element: particle,
      left,
      size,
      speedHorz,
      speedUp,
      spinSpeed,
      spinVal,
      top
    })
  }

  function updateParticles() {
    for (const p of particles) {
      p.left = p.left - p.speedHorz * p.direction
      p.top = p.top - p.speedUp
      p.speedUp = Math.min(p.size, p.speedUp - 1)
      p.spinVal = p.spinVal + p.spinSpeed

      if (p.top >= Math.max(window.innerHeight, document.body.clientHeight) + p.size) {
        particles = particles.filter((o) => o !== p)
        p.element.remove()
      }

      p.element.setAttribute(
        'style',
        [
          'position:absolute',
          'will-change:transform',
          `top:${p.top}px`,
          `left:${p.left}px`,
          `transform:rotate(${p.spinVal}deg)`
        ].join(';')
      )
    }
  }

  function loop() {
    if (autoAddParticle && particles.length < limit) {
      createParticle()
    }

    updateParticles()
    animationFrame = requestAnimationFrame(loop)
  }

  loop()

  const isTouchInteraction =
    'ontouchstart' in window ||
    // @ts-expect-error
    navigator.msMaxTouchPoints

  const tap = isTouchInteraction ? 'touchstart' : 'mousedown'
  const tapEnd = isTouchInteraction ? 'touchend' : 'mouseup'
  const move = isTouchInteraction ? 'touchmove' : 'mousemove'

  const updateMousePosition = (e: MouseEvent | TouchEvent) => {
    if ('touches' in e) {
      mouseX = e.touches?.[0].clientX
      mouseY = e.touches?.[0].clientY
    } else {
      mouseX = e.clientX
      mouseY = e.clientY
    }
  }

  const tapHandler = (e: MouseEvent | TouchEvent) => {
    updateMousePosition(e)
    autoAddParticle = true
  }

  const disableAutoAddParticle = () => {
    autoAddParticle = false
  }
  element.addEventListener(move, updateMousePosition, { passive: true })
  element.addEventListener(tap, tapHandler, { passive: true })
  element.addEventListener(tapEnd, disableAutoAddParticle, { passive: true })
  element.addEventListener('mouseleave', disableAutoAddParticle, {
    passive: true
  })

  return () => {
    element.removeEventListener(move, updateMousePosition)
    element.removeEventListener(tap, tapHandler)
    element.removeEventListener(tapEnd, disableAutoAddParticle)
    element.removeEventListener('mouseleave', disableAutoAddParticle)

    // Cancel animation loop once animations are done
    const interval = setInterval(() => {
      if (animationFrame && particles.length === 0) {
        cancelAnimationFrame(animationFrame)
        clearInterval(interval)

        // Clean up container if this is the last instance
        if (--instanceCounter === 0) {
          container.remove()
        }
      }
    }, 500)
  }
}

/*export function useCoolMode(imageUrl: Ref<string>): Ref<HTMLElement|undefined> {
  const htmlElementRef = ref<HTMLElement>();
  const enableCoolMode  = useCoolModeContext();

  watch([enableCoolMode,htmlElementRef],([newCooldModeEnabled, newHtmlElement ],_)=>{
    if(newCooldModeEnabled && newHtmlElement){
      createElementCool(newHtmlElement,imageUrl.value)();
    }
  });
  
  return htmlElementRef;
}*/
