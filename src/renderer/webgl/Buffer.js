export class Buffer {
    constructor(gl, target = null, usage = null) {
        this.gl = gl;
        this.buffer = gl.createBuffer();
        this.target = target || gl.ARRAY_BUFFER;
        this.usage = usage || gl.STATIC_DRAW;

        if (!this.buffer) {
            throw new Error('Failed to create buffer');
        }
    }

    bind() {
        this.gl.bindBuffer(this.target, this.buffer);
    }

    unbind() {
        this.gl.bindBuffer(this.target, null);
    }

    setData(data, usage = null) {
        if (usage) {
            this.usage = usage;
        }
        
        this.bind();
        this.gl.bufferData(this.target, data, this.usage);
        this.unbind();
    }

    setSubData(data, offset = 0) {
        this.bind();
        this.gl.bufferSubData(this.target, offset, data);
        this.unbind();
    }

    delete() {
        if (this.buffer) {
            this.gl.deleteBuffer(this.buffer);
            this.buffer = null;
        }
    }

    getBuffer() {
        return this.buffer;
    }

    getTarget() {
        return this.target;
    }
}
