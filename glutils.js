// Utility functions for WebGL shader programs

function initShaderProgram(gl, vertShader, fragShader){
    if(!vertShader || !fragShader){
        return null;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertShader);
    gl.attachShader(shaderProgram, fragShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program: " + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source){
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function getUniforms(gl, shaderProgram){
    let uniforms = {};
    const numUniforms = gl.getProgramParameter(shaderProgram, gl.ACTIVE_UNIFORMS);
    for(let i = 0; i < numUniforms; ++i){
        const uniformName = gl.getActiveUniform(shaderProgram, i).name;
        uniforms[uniformName] = gl.getUniformLocation(shaderProgram, uniformName);
    }
    return uniforms;
}

function getAttributes(gl, shaderProgram){
    let attribs = {};
    const numAttribs = gl.getProgramParameter(shaderProgram, gl.ACTIVE_ATTRIBUTES);
    for(let i = 0; i < numAttribs; ++i){
        const attribName = gl.getActiveAttrib(shaderProgram, i).name;
        attribs[attribName] = gl.getAttribLocation(shaderProgram, attribName);
    }
    return attribs;
}