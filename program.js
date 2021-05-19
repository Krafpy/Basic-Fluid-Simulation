class Program {
    constructor(gl, vertShader, fragShader, quadBuffer) {
        this.gl = gl;
        this.program = initShaderProgram(this.gl, vertShader, fragShader);
        this.uniforms = getUniforms(this.gl, this.program);
        this.attributes = getAttributes(this.gl, this.program);

        // Use our rendering program
        this.bind();

        //this.attachVertexAttrib();
        {
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
        }

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
        this.gl.useProgram(this.program);
    }

    run() {
        const offset = 0;
        const vertexCount = 4;
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, vertexCount);
    }
}