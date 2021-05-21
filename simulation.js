class Simulation {
    constructor(gl, shaders, gui){
        this.gl = gl;
        this.gui = gui;

        this.width = gl.canvas.width;
        this.height = gl.canvas.height;

        const quadBuffer = createQuadBuffer(gl);

        this.copyProgram =  new Program(this.gl, shaders.vertex, shaders.copy,  quadBuffer);
        this.splatProgram = new Program(this.gl, shaders.vertex, shaders.splat, quadBuffer);

        this.densityField = new DoubleFrameBuffer(gl, this.width, this.height);

        this.lastTime = 0;
        this.deltaTime = 0;

        this.mouse = {x:0, y:0, pressed:0};
    }

    update(timeStamp) {
        const gl = this.gl;

        const currentTime = timeStamp / 1000.;
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Density source
        {
            const {uniforms} = this.splatProgram;

            this.splatProgram.bind();
            this.densityField.fbo1.bindBuffer();

            gl.uniform2f(uniforms.resolution, this.width, this.height);
            gl.uniform1f(uniforms.radius, this.gui.inputs.splatRadius.value);
            gl.uniform3f(uniforms.mouse, this.mouse.x, this.mouse.y, this.mouse.pressed);

            this.densityField.fbo2.bindTexture(uniforms.densityField, 0);

            this.splatProgram.run();

            this.densityField.fbo1.unbindBuffer();
            this.densityField.swap();
        }
    }

    draw() {
        const {uniforms} = this.copyProgram;
        this.copyProgram.bind();
        this.densityField.fbo2.bindTexture(uniforms.texture, 0);

        const gl = this.gl;

        gl.clearColor(0.,0.,0.,1.);
        gl.clearDepth(1.);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.uniform2f(uniforms.resolution, this.width, this.height);

        this.copyProgram.run();
    }

    setMousePosition(event) {
        if(event.target.tagName == "BODY") {
            pauseEvent(event);
        }
        const pos = getRelativeMousePosition(event, this.gl.canvas);
        this.mouse.x = pos.x;
        this.mouse.y = pos.y;
    }

    setMousePressed(event) {
        if(event.target.tagName == "BODY" && event.buttons == 1) {
            pauseEvent(event);
            this.mouse.pressed = 1;
        } else {
            this.mouse.pressed = 0;
        }
    }
}