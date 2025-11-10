export class GLContext {
    constructor(canvas, options = {}) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl2', {
            alpha: options.alpha !== undefined ? options.alpha : true,
            antialias: options.antialias !== undefined ? options.antialias : true,
            depth: options.depth !== undefined ? options.depth : true,
            preserveDrawingBuffer: options.preserveDrawingBuffer || false,
            powerPreference: options.powerPreference || 'default'
        });

        if (!this.gl) {
            throw new Error('WebGL2 is not supported in this browser');
        }

        this.initializeDefaults();
    }

    initializeDefaults() {
        const gl = this.gl;
        
        
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        
        
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
        
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    }

    clear(mask = null) {
        const gl = this.gl;
        if (mask === null) {
            mask = gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT;
        }
        gl.clear(mask);
    }

    setViewport(x, y, width, height) {
        this.gl.viewport(x, y, width, height);
    }

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.setViewport(0, 0, width, height);
    }

    setClearColor(r, g, b, a = 1.0) {
        this.gl.clearColor(r, g, b, a);
    }

    setDepthTest(enabled) {
        if (enabled) {
            this.gl.enable(this.gl.DEPTH_TEST);
        } else {
            this.gl.disable(this.gl.DEPTH_TEST);
        }
    }

    setBlending(enabled) {
        if (enabled) {
            this.gl.enable(this.gl.BLEND);
        } else {
            this.gl.disable(this.gl.BLEND);
        }
    }

    setBlendFunc(src, dst) {
        this.gl.blendFunc(src, dst);
    }

    enableBlend() {
        this.gl.enable(this.gl.BLEND);
    }

    disableBlend() {
        this.gl.disable(this.gl.BLEND);
    }

    drawArraysInstanced(mode, first, count, instanceCount) {
        this.gl.drawArraysInstanced(mode, first, count, instanceCount);
    }

    drawArrays(mode, first, count) {
        this.gl.drawArrays(mode, first, count);
    }

    drawElements(mode, count, type, offset) {
        this.gl.drawElements(mode, count, type, offset);
    }

    drawElementsInstanced(mode, count, type, offset, instanceCount) {
        this.gl.drawElementsInstanced(mode, count, type, offset, instanceCount);
    }

    get POINTS() { return this.gl.POINTS; }
    get LINES() { return this.gl.LINES; }
    get LINE_STRIP() { return this.gl.LINE_STRIP; }
    get LINE_LOOP() { return this.gl.LINE_LOOP; }
    get TRIANGLES() { return this.gl.TRIANGLES; }
    get TRIANGLE_STRIP() { return this.gl.TRIANGLE_STRIP; }
    get TRIANGLE_FAN() { return this.gl.TRIANGLE_FAN; }
    
    get ARRAY_BUFFER() { return this.gl.ARRAY_BUFFER; }
    get ELEMENT_ARRAY_BUFFER() { return this.gl.ELEMENT_ARRAY_BUFFER; }
    
    get STATIC_DRAW() { return this.gl.STATIC_DRAW; }
    get DYNAMIC_DRAW() { return this.gl.DYNAMIC_DRAW; }
    get STREAM_DRAW() { return this.gl.STREAM_DRAW; }
    
    get FLOAT() { return this.gl.FLOAT; }
    get UNSIGNED_BYTE() { return this.gl.UNSIGNED_BYTE; }
    get UNSIGNED_SHORT() { return this.gl.UNSIGNED_SHORT; }
    get UNSIGNED_INT() { return this.gl.UNSIGNED_INT; }
    
    get SRC_ALPHA() { return this.gl.SRC_ALPHA; }
    get ONE_MINUS_SRC_ALPHA() { return this.gl.ONE_MINUS_SRC_ALPHA; }
    get ONE() { return this.gl.ONE; }
    get ZERO() { return this.gl.ZERO; }

    getContext() {
        return this.gl;
    }

    getCanvas() {
        return this.canvas;
    }
}
