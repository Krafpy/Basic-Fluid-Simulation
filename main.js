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

  gl = canvas.getContext("webgl");
  if(!gl){
    alert("Unable to initialize WebGL.");
    return;
  }

  const texFloat = gl.getExtension('OES_texture_float');
  const bufFloat = gl.getExtension('WEBGL_color_buffer_float');
  if(!texFloat || !bufFloat){
    alert("Unable to load floats extension.");
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
    force:    loadShader(fs, await readTextFile("shaders/force.glsl")),
    diffuse:  loadShader(fs, await readTextFile("shaders/diffuse.glsl")),
    advect:   loadShader(fs, await readTextFile("shaders/advect.glsl")),
    bnd:      loadShader(fs, await readTextFile("shaders/bnd.glsl")),
    pressure: loadShader(fs, await readTextFile("shaders/pressure.glsl")),
    project:  loadShader(fs, await readTextFile("shaders/project.glsl")),
    clear:    loadShader(fs, await readTextFile("shaders/clear.glsl")),
  };
}