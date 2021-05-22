let gl, gui;
window.onload = main;

function main() {
  const panel = document.getElementById("configPanel");
  gui = new GUI(panel);

  const canvas = document.getElementById("glCanvas");
  // fullScreen
  /*canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;*/
  canvas.width = 640;
  canvas.height = 480;

  gl = canvas.getContext("webgl2");

  if(!gl){
    alert("Unable to initialize WebGL.");
    return;
  }

  loadShaderSources()
  .then(shaders => {
    const simulation = new Simulation(shaders);

    //window.addEventListener("mousemove", e => simulation.setMousePosition(e));
    window.onmousemove = e => simulation.setMousePosition(e);
    window.onmousedown = e => simulation.setMousePressed(e);
    window.onmouseup   = e => simulation.setMousePressed(e);
    
    const loop = timeStamp => {
      simulation.update(timeStamp);
      simulation.draw();
      window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
  });
}

async function loadShaderSources() {
  const vs = gl.VERTEX_SHADER;
  const fs = gl.FRAGMENT_SHADER;
  return {
    vertex:   loadShader(vs, await readTextFile("shaders/vertex.glsl")),
    copy:     loadShader(fs, await readTextFile("shaders/copy.glsl")),
    splat:    loadShader(fs, await readTextFile("shaders/splat.glsl")),
    gsstep:   loadShader(fs, await readTextFile("shaders/gsstep.glsl")),
  };
}