class Simulation {
    constructor(shaders){
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;

        const quadBuffer = createQuadBuffer();

        this.copyProgram     = new Program(shaders.vertex, shaders.copy,     quadBuffer);
        this.splatProgram    = new Program(shaders.vertex, shaders.splat,    quadBuffer);
        this.forceProgram    = new Program(shaders.vertex, shaders.force,    quadBuffer);
        this.diffuseProgram  = new Program(shaders.vertex, shaders.diffuse,  quadBuffer);
        this.advectProgram   = new Program(shaders.vertex, shaders.advect,   quadBuffer);
        this.bndProgram      = new Program(shaders.vertex, shaders.bnd,      quadBuffer);
        this.pressureProgram = new Program(shaders.vertex, shaders.pressure, quadBuffer);
        this.projectProgram  = new Program(shaders.vertex, shaders.project,  quadBuffer);
        this.clearProgram    = new Program(shaders.vertex, shaders.clear,    quadBuffer);

        this.density   = new DoubleFrameBuffer(this.width, this.height);
        this.gscompute = new DoubleFrameBuffer(this.width, this.height);
        this.velocity  = new DoubleFrameBuffer(this.width, this.height);

        this.lastTime = 0;
        this.deltaTime = 0;

        this.mouse = {x:0, y:0, pressed:0};
        this.splatColor = HSVtoRGB(0., 1., 1.);

        this.force = {x:0, y:0};
    }

    update(timeStamp) {
        const inputs = gui.inputs;

        const currentTime = timeStamp / 1000.;
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.addSources(inputs);

        this.diffuse(this.velocity, inputs.velDiffCoeff);
        this.setBoundaries(this.velocity, -1.);
        this.advect(this.density, this.velocity);
        this.setBoundaries(this.velocity, -1.);

        this.clearVelocityDivergence();
        this.setBoundaries(this.velocity, -1.);

        this.diffuse(this.density, inputs.densDiffCoeff);
        this.setBoundaries(this.density, 1.);
        this.advect(this.density, this.velocity);
        this.setBoundaries(this.density, 1.);
    }

    addSources(inputs) {
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
        
        // Force source
        {
            const {uniforms} = this.forceProgram;
            this.forceProgram.bind();

            gl.uniform2f(uniforms.resolution, this.width, this.height);
            gl.uniform1f(uniforms.radius, 0.02);
            gl.uniform3f(uniforms.mouse, this.mouse.x, this.mouse.y, this.mouse.pressed);
            gl.uniform1f(uniforms.decay, 0);
            gl.uniform1f(uniforms.deltaTime, this.deltaTime);
            gl.uniform2f(uniforms.force, this.force.x, this.force.y)
            gl.uniform1i(uniforms.density, this.velocity.read.attach(0));

            this.forceProgram.run(this.velocity.write);
            this.velocity.swap();
        }
    }

    diffuse(field, diffCoef) {
        this.clearTexture(this.gscompute);

        {
            const {uniforms} = this.diffuseProgram;
            this.diffuseProgram.bind();

            gl.uniform2f(uniforms.resolution, this.width, this.height);
            gl.uniform1f(uniforms.k, this.deltaTime * diffCoef);
            gl.uniform1i(uniforms.field, field.read.attach(0));

            for(let i = 0; i < 20; ++i){
                gl.uniform1i(uniforms.compute, this.gscompute.read.attach(1));
                this.diffuseProgram.run(this.gscompute.write);
                this.gscompute.swap();
            }
        }

        {
            const {uniforms} = this.copyProgram; 
            this.copyProgram.bind();

            gl.uniform2f(uniforms.resolution, this.width, this.height);
            gl.uniform1i(uniforms.texture, this.gscompute.read.attach(0));

            this.copyProgram.run(field.write);
            field.swap();
        }
    }

    advect(field, velocity) {
        const {uniforms} = this.advectProgram;
        this.advectProgram.bind();

        gl.uniform2f(uniforms.resolution, this.width, this.height);
        gl.uniform1f(uniforms.deltaTime, this.deltaTime);
        gl.uniform1i(uniforms.velocity, velocity.read.attach(0));
        gl.uniform1i(uniforms.field, field.read.attach(1));

        this.advectProgram.run(field.write);
        field.swap();
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

    setBoundaries(field, factor) {
        const {uniforms} = this.bndProgram;
        this.bndProgram.bind();

        gl.uniform2f(uniforms.resolution, this.width, this.height);
        gl.uniform1i(uniforms.field, field.read.attach(0));
        gl.uniform1f(uniforms.factor, factor);

        this.bndProgram.run(field.write);
        field.swap();
    }

    clearTexture(doubleFBO) {
        this.clearProgram.bind();
        this.clearProgram.run(doubleFBO.write);
        doubleFBO.swap();
    }

    clearVelocityDivergence() {
        this.clearTexture(this.gscompute);

        {
            const {uniforms} = this.pressureProgram;
            this.pressureProgram.bind();

            gl.uniform2f(uniforms.resolution, this.width, this.height);
            gl.uniform1i(uniforms.velocity, this.velocity.read.attach(0));

            for(let i = 0; i < 20; ++i){
                gl.uniform1i(uniforms.compute, this.gscompute.read.attach(1));
                this.pressureProgram.run(this.gscompute.write);
                this.gscompute.swap();
            }
        }

        this.setBoundaries(this.gscompute, 1.);

        {
            const {uniforms} = this.projectProgram;
            this.projectProgram.bind();

            gl.uniform2f(uniforms.resolution, this.width, this.height);
            gl.uniform1i(uniforms.velocity, this.velocity.read.attach(0));
            gl.uniform1i(uniforms.divergent, this.gscompute.read.attach(1));

            this.projectProgram.run(this.velocity.write);
            this.velocity.swap();
        }
    }

    setMousePosition(event) {
        if(event.target.tagName == "BODY") {
            pauseEvent(event);
        }
        const pos = getRelativeMousePosition(event, gl.canvas);

        const f = 1.;
        this.force.x = (pos.x - this.mouse.x) * f;
        this.force.y = (pos.y - this.mouse.y) * f;

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