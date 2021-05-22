class Simulation {
    constructor(shaders){
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;

        const quadBuffer = createQuadBuffer();

        this.copyProgram   = new Program(shaders.vertex, shaders.copy,   quadBuffer);
        this.splatProgram  = new Program(shaders.vertex, shaders.splat,  quadBuffer);
        this.gsstepProgram = new Program(shaders.vertex, shaders.gsstep, quadBuffer);

        this.density = new DoubleFrameBuffer(this.width, this.height);

        this.lastTime = 0;
        this.deltaTime = 0;

        this.mouse = {x:0, y:0, pressed:0};
        this.splatColor = HSVtoRGB(0., 1., 1.);
    }

    update(timeStamp) {
        const inputs = gui.inputs;

        const currentTime = timeStamp / 1000.;
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // Density source
        {
            const {uniforms} = this.splatProgram;
            this.splatProgram.bind();

            gl.uniform2f(uniforms.resolution, this.width, this.height);
            gl.uniform1f(uniforms.radius, inputs.splatRadius);
            gl.uniform3f(uniforms.mouse, this.mouse.x, this.mouse.y, this.mouse.pressed);
            gl.uniform1f(uniforms.decay, inputs.decay);
            gl.uniform1f(uniforms.deltaTime, this.deltaTime);
            gl.uniform3f(uniforms.color, this.splatColor.r, this.splatColor.g, this.splatColor.b)
            gl.uniform1i(uniforms.density, this.density.read.attach(0));

            this.splatProgram.run(this.density.write);
            this.density.swap();
        }

        // Diffusion solving using Gauss-Seidel relaxation
        {
            const {uniforms} = this.gsstepProgram;
            this.gsstepProgram.bind();

            gl.uniform2f(uniforms.resolution, this.width, this.height);
            gl.uniform1f(uniforms.k, this.deltaTime * inputs.diffusionCoeff);

            for(let i = 0; i < 20; ++i){
                gl.uniform1i(uniforms.field, this.density.read.attach(0));
                this.gsstepProgram.run(this.density.write);
                this.density.swap();
            }
        }
    }

    draw() {
        const {uniforms} = this.copyProgram;
        this.copyProgram.bind();

        gl.clearColor(0.,0.,0.,1.);
        gl.clearDepth(1.);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.uniform2f(uniforms.resolution, this.width, this.height);
        gl.uniform1i(uniforms.texture, this.density.read.attach(0));

        this.copyProgram.run();
    }

    setMousePosition(event) {
        if(event.target.tagName == "BODY") {
            pauseEvent(event);
        }
        const pos = getRelativeMousePosition(event, gl.canvas);
        this.mouse.x = pos.x;
        this.mouse.y = pos.y;
        this.splatColor = HSVtoRGB(this.lastTime, 1., 1.);
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