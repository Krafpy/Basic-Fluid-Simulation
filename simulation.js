class Simulation {
    constructor(gl, shaders){
        this.gl = gl;

        const width = gl.canvas.width;
        const height = gl.canvas.height;

        // Programs and constant uniforms
        this.drawProgram = new Program(gl, shaders.vert, shaders.draw);
        this.gl.uniform2f(this.drawProgram.uniforms.resolution, width, height);

        this.renderProgram = new Program(gl, shaders.vert, shaders.rend);
        this.gl.uniform2f(this.renderProgram.uniforms.resolution, width, height);

        // Frame buffers
        this.renderBuffer = new FrameBuffer(gl, width, height);

        // Time
        this.lastTime = 0;
        this.deltaTime = 0;
    }

    update(timeStamp) {
        const currentTime = timeStamp / 1000.;
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.drawProgram.bind();
        this.renderBuffer.bindBuffer();

        // Update elapsed time
        this.gl.uniform1f(this.drawProgram.uniforms.time, timeStamp / 1000.);

        this.drawQuad();

        this.renderBuffer.unbindBuffer();
    }

    draw() {
        this.renderProgram.bind();
        this.renderBuffer.bindTexture(this.renderProgram, "renderTexture");

        const gl = this.gl;

        gl.clearColor(0.,0.,0.,1.);
        gl.clearDepth(1.);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.drawQuad();
    }

    drawQuad() {
        const offset = 0;
        const vertexCount = 4;
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}