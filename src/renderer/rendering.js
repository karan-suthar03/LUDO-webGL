import { GLContext, Program, VertexArray, Buffer } from './webgl/index.js'
import { loadShaders } from './shaders/loader.js'

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas
    this.glContext = new GLContext(canvas, {
      antialias: true,
      alpha: false
    })
    this.program = null
    this.vao = null
    this.instanceBuffer = null
    this.isInitialized = false
  }

  createInstanceBuffer() {
    if (!this.points2D) return

    const instancePositions = new Float32Array(this.points2D.flat())

    
    this.instanceBuffer = new Buffer(
      this.glContext.getContext(),
      this.glContext.ARRAY_BUFFER,
      this.glContext.STATIC_DRAW
    )
    this.instanceBuffer.setData(instancePositions)

    
    if (!this.vao) {
      this.vao = new VertexArray(this.glContext.getContext())
    }

    const instancePosLoc = this.program.getAttributeLocation('a_instancePos')
    if (instancePosLoc !== -1) {
      this.vao.addInstancedAttribute(instancePosLoc,this.instanceBuffer.getBuffer(),3,this.glContext.FLOAT,false,16,0,1)
    }
  }

  async init() {
    try {
      const shaders = await loadShaders({
        vertex: '/src/renderer/shaders/triangle.vert',
        fragment: '/src/renderer/shaders/triangle.frag'
      })

      this.program = new Program(this.glContext.getContext(), shaders.vertex, shaders.fragment)
      
      this.glContext.enableBlend()
      this.glContext.setBlendFunc(this.glContext.SRC_ALPHA, this.glContext.ONE_MINUS_SRC_ALPHA)

      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize renderer:', error)
      throw error
    }
  }

  async initializeGameboard() {
    try {
        this.points2D = [
        [-0.5, -0.5,0,1],
        [0.5, -0.5,2,1],
        [0.5, 0.5,3,1],
        [-0.5, 0.5,4,1]
    ];
    } catch (error) {
      throw error
    }
  }

  resize(width, height) {
    const size = Math.min(width, height)
    this.canvas.width = size
    this.canvas.height = size
    this.glContext.resize(size, size)
  }

  render() {
    if (!this.isInitialized) return

    this.glContext.clear()
    this.glContext.setViewport(0, 0, this.canvas.width, this.canvas.height)

    this.program.use()
    const pointSize = this.canvas.width * 0.05
    this.program.setUniform('u_squareSize', pointSize)

    if (this.vao) {
      this.vao.drawInstanced(this.glContext.POINTS, 1, this.points2D.length)
    }
  }

  cleanup() {
    if (this.program) {
      this.program.delete()
      this.program = null
    }
    if (this.vao) {
      this.vao.delete()
      this.vao = null
    }
    if (this.instanceBuffer) {
      this.instanceBuffer.delete()
      this.instanceBuffer = null
    }
    this.isInitialized = false
  }
}