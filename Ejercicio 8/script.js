"use strict";

var canvas;
var gl;

var numVertices = 36;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var rotate = [0, 0, 0];
var translate = [0, 0, 0];
var escala = [1, 1, 1];
var theta = [30, 30, 30];

var thetaLoc;
var translateLoc;
var scaleLoc;
var centerLoc;

var vertices = [
    vec3(-0.5, -0.5, 0.5),
    vec3(-0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, -0.5, 0.5),
    vec3(-0.5, -0.5, -0.5),
    vec3(-0.5, 0.5, -0.5),
    vec3(0.5, 0.5, -0.5),
    vec3(0.5, -0.5, -0.5)
];

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0), // black
    vec4(1.0, 0.0, 0.0, 1.0), // red
    vec4(1.0, 1.0, 0.0, 1.0), // yellow
    vec4(0.0, 1.0, 0.0, 1.0), // green
    vec4(0.0, 0.0, 1.0, 1.0), // blue
    vec4(1.0, 0.0, 1.0, 1.0), // magenta
    vec4(1.0, 1.0, 1.0, 1.0), // white
    vec4(0.0, 1.0, 1.0, 1.0) // cyan
];

var indices = [
    1,
    0,
    3,
    3,
    2,
    1,
    2,
    3,
    7,
    7,
    6,
    2,
    3,
    0,
    4,
    4,
    7,
    3,
    6,
    5,
    1,
    1,
    2,
    6,
    4,
    5,
    6,
    6,
    7,
    4,
    5,
    4,
    0,
    0,
    1,
    5
];

function createSlider(name, callback) {
    let slider = document.getElementById(name);
    callback(slider.value);
    slider.oninput = function () {
        callback(this.value);
    };
}

createSlider("scaleX", (value) => (escala[xAxis] = parseInt(value) / 100));
createSlider("scaleY", (value) => (escala[yAxis] = parseInt(value) / 100));
createSlider("scaleZ", (value) => (escala[zAxis] = parseInt(value) / 100));
createSlider("rotX", (value) => (rotate[xAxis] = parseInt(value)));
createSlider("rotY", (value) => (rotate[yAxis] = parseInt(value)));
createSlider("rotZ", (value) => (rotate[zAxis] = parseInt(value)));
createSlider("movX", (value) => (translate[xAxis] = parseInt(value) / 100));
createSlider("movY", (value) => (translate[yAxis] = parseInt(value) / 100));
createSlider("movZ", (value) => (translate[zAxis] = parseInt(value) / 100));

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint8Array(indices),
        gl.STATIC_DRAW
    );

    // color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    thetaLoc = gl.getUniformLocation(program, "theta");
    translateLoc = gl.getUniformLocation(program, "translation");
    scaleLoc = gl.getUniformLocation(program, "scale_delta");
    centerLoc = gl.getUniformLocation(program, "center");

    render();
}

function calculateCubeCenter() {
    let x = 0;
    let y = 0;
    let z = 0;
    for (let i = 0; i < vertices.length; i++) {
        x += vertices[i][0];
        y += vertices[i][1];
        z += vertices[i][2];
    }
    x /= vertices.length;
    y /= vertices.length;
    z /= vertices.length;
    return [x, y, z];
}

window.onload = init;

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    theta[xAxis] += rotate[xAxis];
    theta[yAxis] += rotate[yAxis];
    theta[zAxis] += rotate[zAxis];
    gl.uniform3fv(thetaLoc, theta);
    gl.uniform3fv(translateLoc, translate);
    gl.uniform3fv(scaleLoc, escala);
    gl.uniform3fv(centerLoc, calculateCubeCenter());

    gl.drawElements(gl.TRIANGLES, numVertices, gl.UNSIGNED_BYTE, 0);

    requestAnimFrame(init);
}
