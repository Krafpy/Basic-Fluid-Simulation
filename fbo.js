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
        const data = null
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                        width, height, border, format, type, data);
        
        // Create the frame buffer object
        this.fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTexture, level);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        
        gl.viewport(0, 0, width, height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clearColor(0., 0., 0., 1.);
    }

   /* bindBuffer() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fb);
    }

    unbindBuffer() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    }*/

    attach(texBiding) {
        const binding = this.gl.TEXTURE0 + texBiding;
        this.gl.activeTexture(binding);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.targetTexture);
        return texBiding;
    }

    /*bindTexture(samplerLocation, texBiding) {
        this.gl.activeTexture(this.gl.TEXTURE0 + texBiding);
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.targetTexture);
        this.gl.uniform1i(samplerLocation, texBiding);

    }*/
}

class DoubleFrameBuffer {
    constructor(gl, width, height) {
        this.fbo1 = new FrameBuffer(gl, width, height);
        this.fbo2 = new FrameBuffer(gl, width, height);
    }

    swap() {
        const temp = this.fbo1;
        this.fbo1 = this.fbo2;
        this.fbo2 = temp;
    }

    get write() {
        return this.fbo1;
    }

    get read() {
        return this.fbo2;
    }
}