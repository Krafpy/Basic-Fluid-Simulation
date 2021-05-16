// Utility functions for WebGL shader programs

function initShaderProgram(gl, vsSource, fsSource){
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if(vertexShader == null || fragmentShader == null){
        return null;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
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

function initBuffer(gl, data){
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    return buffer;
}