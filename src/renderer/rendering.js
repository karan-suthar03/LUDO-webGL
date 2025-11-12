import { GLContext, Program, VertexArray, Buffer } from './webgl/index.js'
import { loadShaders } from './shaders/loader.js'
import { vec2 } from 'gl-matrix'

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
    if (!this.LudoCells) return

    const instancePositions = new Float32Array(this.LudoCells.flat())

    
    this.instanceBuffer = new Buffer(
      this.glContext.getContext(),
      this.glContext.ARRAY_BUFFER,
      this.glContext.DYNAMIC_DRAW
    )
    this.instanceBuffer.setData(instancePositions)

    
    if (!this.vao) {
      this.vao = new VertexArray(this.glContext.getContext())
    }

    const positionLoc = this.program.getAttributeLocation('a_position')
    const colorLoc = this.program.getAttributeLocation('a_color')
    const sizeMultiplierLoc = this.program.getAttributeLocation('a_sizeMultiplier')
    const typeLoc = this.program.getAttributeLocation('a_type')
    
    const stride = this.LudoCells[0].length * 4
    
    if (positionLoc !== -1) {
      this.vao.addInstancedAttribute(positionLoc, this.instanceBuffer.getBuffer(), 2, this.glContext.FLOAT, false, stride, 0, 1)
    }
    if (colorLoc !== -1) {
      this.vao.addInstancedAttribute(colorLoc, this.instanceBuffer.getBuffer(), 1, this.glContext.FLOAT, false, stride, 8, 1)
    }
    if (sizeMultiplierLoc !== -1) {
      this.vao.addInstancedAttribute(sizeMultiplierLoc, this.instanceBuffer.getBuffer(), 1, this.glContext.FLOAT, false, stride, 12, 1)
    }
    if (typeLoc !== -1) {
      this.vao.addInstancedAttribute(typeLoc, this.instanceBuffer.getBuffer(), 1, this.glContext.FLOAT, false, stride, 16, 1)
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
      this.glContext.setClearColor(0.05, 0.05, 0.05, 1.0)

      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize renderer:', error)
      throw error
    }
  }

  async initializeGameboard() {
    try {
      let whole = 2; // total coordinate span from -1 to +1
      let margin = 0.05;
      let cells = 15;

      let usable = whole - margin * 2;

      let cellSize = usable / cells;

      this.LudoCells = [];

      /* 
      * structure of each: [x, y, color, sizeMultiplier,type]
      * color 0: gray
      * color 1: red
      * color 2: green
      * color 3: blue
      * color 4: yellow
      * sizeMultiplier: number
      * type: 0 for normal cell, 1 for home area cell, 2 for inside home cells
      */

      for (let i = 0; i < cells; i++) {
        for (let j = 0; j < cells; j++) {
          if ((i >=9 && j >=9) || (i <=5 && j <=5) || (i <=5 && j >=9) || (i >=9 && j <=5)) {
            continue;
          }
          let x = -1 + margin + cellSize * (j + 0.5);
          let y = -1 + margin + cellSize * (i + 0.5);

          if ((i === 7 && j > 0 && j < 6) || (i == 8 && j == 1)) {
            this.LudoCells.push([x, y, 4, 1,0]);
            continue;
          }

          if ((i === 7 && j > 8 && j < 14) || (i == 6 && j == 13)) {
            this.LudoCells.push([x, y, 1, 1,0]);
            continue;
          }

          if ((j === 7 && i > 0 && i < 6) || (j == 6 && i == 1)) {
            this.LudoCells.push([x, y, 3, 1,0]);
            continue;
          }

          if (j === 7 && i > 8 && i < 14 || (j == 8 && i == 13)) {
            this.LudoCells.push([x, y, 2, 1,0]);
            continue;
          }

          this.LudoCells.push([x, y, 0, 1,0]);
        }
      }

      // home areas

      let areaSize = 6;

      let centerX = (areaSize - 1) / 2;
      let centerY = (areaSize - 1) / 2;

      let x = -1 + margin + cellSize * (centerX + 0.5);
      let y = 1 - (margin + cellSize * (centerY + 0.5));

      this.LudoCells.push([x, y, 4, 6.1,1]);
      this.LudoCells.push([-x, y, 2, 6.1,1]);
      this.LudoCells.push([-x, -y, 1, 6.1,1]);
      this.LudoCells.push([x, -y, 3, 6.1,1]);

      let offset = 0.1;

      const quadrants = [
        { xMult: 1, yMult: 1, color: 4 },
        { xMult: -1, yMult: 1, color: 2 }, 
        { xMult: -1, yMult: -1, color: 1 },
        { xMult: 1, yMult: -1, color: 3 },
      ];

      for (const { xMult, yMult, color } of quadrants) {
        for (let i = 0; i < 4; i++) {
          const x2 = x * xMult;
          const y2 = y * yMult;

          this.LudoCells.push([x2 - offset, y2 - offset, color, 1.5, 2]);
          this.LudoCells.push([x2 + offset, y2 - offset, color, 1.5, 2]);
          this.LudoCells.push([x2 + offset, y2 + offset, color, 1.5, 2]);
          this.LudoCells.push([x2 - offset, y2 + offset, color, 1.5, 2]);
        }
      }



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

    // Update the instance buffer with new data
    if (this.instanceBuffer) {
      const instancePositions = new Float32Array(this.LudoCells.flat());
      this.instanceBuffer.setData(instancePositions);
    }

    this.glContext.clear()
    this.glContext.setViewport(0, 0, this.canvas.width, this.canvas.height)

    this.program.use()
    const pointSize = this.canvas.width * 0.06
    this.program.setUniform('u_squareSize', pointSize)

    if (this.vao) {
      this.vao.drawInstanced(this.glContext.POINTS, 1, this.LudoCells.length)
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