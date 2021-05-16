const { vec2, vec3, mat3, mat4 } = glMatrix;

function makeProjectionMatrix() {
    const matrix = mat4.create();
    mat4.ortho(matrix, -1., 1., -1., 1., 0.1, 100);
    return matrix;
}

function makeModelViewMatrix() {
    const matrix = mat4.create();
    mat4.translate(matrix, matrix, [0.,0.,-1.]);
    return matrix;
}