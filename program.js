class Program {
    constructor(vertShader, fragShader, quadBuffer) {
        this.program = initShaderProgram(vertShader, fragShader);
        this.uniforms = getUniforms(this.program);
        this.attributes = getAttributes(this.program);

        // Use our rendering program
        this.bind();

        //this.attachVertexAttrib();
        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
    
        gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
        gl.vertexAttribPointer(
            this.attributes.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
    
        gl.enableVertexAttribArray(
            this.attributes.vertexPosition
        );

        // Pass the projection and modelview matrices
        // into the corresponding uniforms
        gl.uniformMatrix4fv(
            this.uniforms.projectionMatrix,
            false,
            makeProjectionMatrix()
        );
        gl.uniformMatrix4fv(
            this.uniforms.modelViewMatrix,
            false,
            makeModelViewMatrix()
        );
    }

    bind() {
        gl.useProgram(this.program);
    }

    run(fbo) {
        if(fbo) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.fb);
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER,   null);
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
}