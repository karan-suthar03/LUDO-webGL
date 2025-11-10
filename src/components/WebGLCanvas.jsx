import React, { useEffect, useRef } from 'react'
import { LudoMain } from '../renderer/LudoMain.js'

const WebGLCanvas = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new LudoMain(canvas)
    let animationRef = null

    const init = async () => {
      try {
        await renderer.init()
        console.log('Renderer initialized')
        render()
      } catch (error) {
        console.error('Failed to initialize renderer:', error)
      }
    }

    const render = () => {
      renderer.renderer.render()
      animationRef = requestAnimationFrame(render)
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        renderer.renderer.resize(canvas.width, canvas.height)
      }
    }

    init()
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef) {
        cancelAnimationFrame(animationRef)
      }
      renderer.cleanup()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        background: '#000'
      }}
    />
  )
}

export default WebGLCanvas
