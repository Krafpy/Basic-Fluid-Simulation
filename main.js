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

  loadShaderSources()
  .then(shaderSources => {
    const simulation = new Simulation(gl, shaderSources);

    const loop = timeStamp => {
      simulation.update(timeStamp);
      simulation.draw();
      window.requestAnimationFrame(loop);
    }

    window.requestAnimationFrame(loop);
  });
}

async function loadShaderSources() {
  return {
    vert: await readTextFile("shaders/vertex.glsl"),
    draw: await readTextFile("shaders/draw.glsl"),
    rend: await readTextFile("shaders/render.glsl"),
  };
}