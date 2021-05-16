class Program {
    constructor(gl, vsSource, fsSource) {
        this.gl = gl;
        this.program = initShaderProgram(this.gl, vsSource, fsSource);
        this.uniforms = getUniforms(this.gl, this.program);
        this.attributes = getAttributes(this.gl, this.program);

        this.attachVertexAttrib();

        const projectionMatrix = makeProjectionMatrix();
        const modelViewMatrix = makeModelViewMatrix();

        // Use our rendering program
        this.bind();

        // Pass the projection and modelview matrices
        // into the corresponding uniforms
        gl.uniformMatrix4fv(
            this.uniforms.projectionMatrix,
            false,
            projectionMatrix
        );
        gl.uniformMatrix4fv(
            this.uniforms.modelViewMatrix,
            false,
            modelViewMatrix
        );
    }

    bind() {
        this.gl.useProgram(this.program);
    }

    attachVertexAttrib() {
        if(this.attributes.vertexPosition == undefined) {
            return;
        }

        // Quad vertices positions, fills the entire screen with the defined
        // orthographic projection matrix
        const positions = [
             1.0,  1.0,
            -1.0,  1.0,
             1.0, -1.0,
            -1.0, -1.0,
        ];

        const positionBuffer = initBuffer(this.gl, positions);
        
        // Tell WebGL how to extract the positions from the buffer
        // to write them in the vertexAttribute attribute
        const numComponents = 2;
        const type = this.gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
    
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.vertexAttribPointer(
            this.attributes.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
    
        this.gl.enableVertexAttribArray(
            this.attributes.vertexPosition
        );

        this.positionBuffer = positionBuffer;
    }
}