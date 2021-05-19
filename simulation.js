class Simulation {
    constructor(gl, shaders){
        this.gl = gl;

        this.width = gl.canvas.width;
        this.height = gl.canvas.height;

        const quadBuffer = createQuadBuffer(gl);

        this.drawProgram =   new Program(this.gl, shaders.vertex, shaders.draw,   quadBuffer);
        this.renderProgram = new Program(this.gl, shaders.vertex, shaders.render, quadBuffer);

        this.renderBuffer =  new FrameBuffer(gl, this.width, this.height);

        this.lastTime = 0;
        this.deltaTime = 0;
    }

    update(timeStamp) {
        const currentTime = timeStamp / 1000.;
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        {
            const {uniforms} = this.drawProgram;

            this.drawProgram.bind();
            this.renderBuffer.bindBuffer();

            this.gl.uniform2f(uniforms.resolution, this.width, this.height);
            this.gl.uniform1f(uniforms.time, timeStamp / 1000.);

            this.drawProgram.run();

            this.renderBuffer.unbindBuffer();
        }
    }

    draw() {
        const {uniforms} = this.renderProgram;
        this.renderProgram.bind();
        this.renderBuffer.bindTexture(uniforms.renderTexture);

        const gl = this.gl;

        gl.clearColor(0.,0.,0.,1.);
        gl.clearDepth(1.);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        this.gl.uniform2f(uniforms.resolution, this.width, this.height);

        this.renderProgram.run();
    }
}