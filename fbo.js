class FrameBuffer {
    constructor(width, height, bg){
        gl.activeTexture(gl.TEXTURE0);
        this.targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type  = gl.FLOAT; // gl.UNSIGNED_BYTE;
        const data = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            width, height, border, format, type, data);
        
        this.fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fb);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.targetTexture, 0);
        gl.viewport(0, 0, width, height);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if(bg) {
            gl.clearColor(bg.r, bg.g, bg.b, 1.);
        } else {
            gl.clearColor(0.0,   0.0,  0.0, 1.);
        }

        // Create the texture
        /*this.targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);

        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type  = gl.HALF_FLOAT; // gl.UNSIGNED_BYTE;
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
        if(bg) {
            gl.clearColor(bg.r, bg.g, bg.b, 1.);
        } else {
            gl.clearColor(0.0,   0.0,  0.0, 1.);
        }*/
    }

    attach(texBiding) {
        gl.activeTexture(gl.TEXTURE0 + texBiding);
        gl.bindTexture(gl.TEXTURE_2D, this.targetTexture);
        return texBiding;
    }
}

class DoubleFrameBuffer {
    constructor(width, height, startColor) {
        this.fbo1 = new FrameBuffer(width, height, startColor);
        this.fbo2 = new FrameBuffer(width, height, startColor);
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