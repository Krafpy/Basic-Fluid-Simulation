class Simulation {
    constructor(gl, shaderSources){
        this.gl = gl;

        // Constant uniform values
        const width = gl.canvas.width;
        const height = gl.canvas.height;

        /// Programs and constant uniforms
        this.generatorProgram = new Program(gl, shaderSources.vert, shaderSources.draw);
        this.gl.uniform2f(this.generatorProgram.uniforms.resolution, width, height);

        this.renderProgram = new Program(gl, shaderSources.vert, shaderSources.rend);
        this.gl.uniform2f(this.renderProgram.uniforms.resolution, width, height);

        // Frame buffers
        this.renderBuffer = new FrameBuffer(gl, gl.canvas.width, gl.canvas.height);

        // Time
        this.lastTime = 0;
        this.deltaTime = 0;
    }

    update(timeStamp) {
        const currentTime = timeStamp / 1000.;
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.generatorProgram.bind();
        this.renderBuffer.bindBuffer();

        // Update elapsed time
        this.gl.uniform1f(
            this.generatorProgram.uniforms.time,
            timeStamp / 1000.
        );

        this.drawQuad();

        this.renderBuffer.unbindBuffer();
    }

    draw() {
        this.renderProgram.bind();
        this.renderBuffer.bindTexture(this.renderProgram, "renderTexture");

        this.drawQuad();
    }

    drawQuad() {
        const gl = this.gl;

        gl.clearColor(0.,0.,0.,1.);
        gl.clearDepth(1.);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const offset = 0;
        const vertexCount = 4;
        this.gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}