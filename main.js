window.onload = main;

function main() {
  const canvas = document.getElementById("glCanvas");
  // fullScreen
  /*canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;*/
  canvas.width = 640;
  canvas.height = 480;

  const gl = canvas.getContext("webgl2");

  if(!gl){
    alert("Unable to initialize WebGL.");
    return;
  }

  loadShaderSources(gl)
  .then(shaders => {
    const gui = new GUI(document.getElementById("configPanel"));
    const simulation = new Simulation(gl, shaders);
    
    const loop = timeStamp => {
      simulation.update(timeStamp);
      simulation.draw();
      window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
  });
}

async function loadShaderSources(gl) {
  const vs = gl.VERTEX_SHADER;
  const fs = gl.FRAGMENT_SHADER;
  return {
    vertex: loadShader(gl, vs, await readTextFile("shaders/vertex.glsl")),
    draw:   loadShader(gl, fs, await readTextFile("shaders/draw.glsl")),
    render: loadShader(gl, fs, await readTextFile("shaders/render.glsl")),
  };
}