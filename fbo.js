class FrameBuffer {
    constructor(gl, width, height){
        this.gl = gl;

        // Create the texture
        this.targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type  = gl.UNSIGNED_BYTE;
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                        width, height, border, format, type, data);
        
        // Create the frame buffer object
        this.fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);

        const attachPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachPoint, gl.TEXTURE_2D, this.targetTexture, level);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    bindBuffer() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
    }

    unbindBuffer() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }

    bindTexture(shaderProgram, uSampler) {
        if(shaderProgram.uniforms[uSampler] == undefined) {
            return;
        }
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.targetTexture);
        this.gl.uniform1i(shaderProgram.uniforms[uSampler], 0);
    }
}