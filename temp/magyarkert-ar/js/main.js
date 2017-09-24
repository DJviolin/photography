/*global THREE, THREEx*/

/*
Dimming issue caused by:
  light.shadow.camera.near
  light.shadow.camera.far
  light.shadow.bias
  light.shadow.mapSize
*/

/*
MODEL LIST:
http://127.0.0.1:8080/?model=boldogkoi-var&scale=0.02&posY=0.7&rotX=0&rotY=270&rotZ=0&debug=true
http://127.0.0.1:8080/?model=parlament&scale=0.02&posY=0.7&rotX=0&rotY=270&rotZ=0&debug=true
http://127.0.0.1:8080/?model=parlament2&ext=glb&scale=0.02&posY=0.7&rotX=0&rotY=270&rotZ=0&debug=true
*/

//document.addEventListener('DOMContentLoaded', function () {

/*function getParameterByName (name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var model = getParameterByName('model');
var extension = getParameterByName('ext');
var scale = getParameterByName('scale');
var posY = getParameterByName('posY');
var rotX = getParameterByName('rotX');
var rotY = getParameterByName('rotY');
var rotZ = getParameterByName('rotZ');
var debug = getParameterByName('debug');

var data = {
  model: model,
  extension: extension,
  scale: scale,
  posY: posY,
  rotX: rotX,
  rotY: rotY,
  rotZ: rotZ,
  //debug: debug,
  debug: true,
};*/

////////////////////////////////////////////////////////////////////////////////
// THREE
////////////////////////////////////////////////////////////////////////////////

//THREEx.ArToolkitContext.baseURL = '../www/';
THREEx.ArToolkitContext.baseURL = '../';

////////////////////////////////////////////////////////////////////////////////
// Init
////////////////////////////////////////////////////////////////////////////////

// init renderer
var renderer = new THREE.WebGLRenderer({
  //antialias: true,
  alpha: true,
  //logarithmicDepthBuffer: true, // logarithmic z-buffer
});
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.BasicShadowMap;
// renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowCameraVisible = true;

////renderer.setClearColor(new THREE.Color('lightgrey'), 0);
renderer.setClearColor(0xcccccc, 0);
//renderer.setClearColor(0xcccccc, 1);
// renderer.setPixelRatio( 1/2 );
renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.domElement.style.position = 'absolute';
renderer.domElement.style.top = '0px';
renderer.domElement.style.left = '0px';
document.body.appendChild(renderer.domElement);

// array of functions for the rendering loop
var onRenderFcts = [];

// init scene and camera
var scene = new THREE.Scene();

// This light globally illuminates all objects in the scene equally.
// This light cannot be used to cast shadows as it does not have a direction.
//var ambient = new THREE.AmbientLight(0x666666);
var ambient = new THREE.AmbientLight(0x222222);
ambient.intensity = 1;
scene.add(ambient);

/*//var directionalLight = new THREE.DirectionalLight('white');
var directionalLight = new THREE.DirectionalLight(0xffeedd);
directionalLight.position.set(1, 2, 0.3).setLength(2);
//directionalLight.shadow.mapSize.set(128, 128);
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.camera.bottom = -0.6;
directionalLight.shadow.camera.top = 0.6;
directionalLight.shadow.camera.right = 0.6;
directionalLight.shadow.camera.left = -0.6;
directionalLight.castShadow = true;
// scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
scene.add(directionalLight);*/

// https://threejs.org/docs/#api/lights/shadows/SpotLightShadow
// Create a SpotLight and turn on shadows for the light
//var spotLight = new THREE.SpotLight(0xffffff);
var spotLight = new THREE.SpotLight(0xffeedd);
//spotLight.position.set(0, 1, 0); // https://threejs.org/docs/#api/math/Vector3
////spotLight.position.set(1, 4, 1);
//spotLight.position.set(1.5, 4, 1);
////spotLight.castShadow = true; // default false
// Set up shadow properties for the light
spotLight.shadow.mapSize.width = 2048; // default: 512
spotLight.shadow.mapSize.height = 2048; // default: 512
spotLight.shadow.camera.near = 0.5; // default: 0.5
spotLight.shadow.camera.far = 500; // default: 500
spotLight.shadow.camera.fov = 90;
//
////scene.add(spotLight);

spotLight.intensity = 1;

var light1 = spotLight;
var light2 = spotLight;

light1.position.set(0, 0, 1);
scene.add(light1);

light2.position.set(0, 5, -5);
light2.castShadow = true;
scene.add(light2);

// https://stackoverflow.com/questions/24087757/three-js-and-loading-a-cross-domain-image
//THREE.ImageUtils.crossOrigin = 'anonymous';
//THREE.ImageUtils.crossOrigin = 'use-credentials';

// Set up shadow properties for the light
//spotLight.shadow.mapSize.width = 512; // default
//spotLight.shadow.mapSize.height = 512; // default
//spotLight.shadow.camera.near = 0.5; // default
//spotLight.shadow.camera.far = 500; // default
//spotLight.shadow.camera.fov = THREE.Math.radToDeg(2 * spotLight.angle);
//spotLight.shadow.camera.far = spotLight.distance; // but only if distance is non-zero
//
//Create a helper for the shadow camera (optional)
var helper = new THREE.CameraHelper(spotLight.shadow.camera);
scene.add(helper);

// add a transparent ground-plane shadow-receiver
var material = new THREE.ShadowMaterial();
material.opacity = 0.7; //! bug in threejs. can't set in constructor
//var geometry = new THREE.PlaneGeometry(3, 3);
var geometry = new THREE.PlaneGeometry(1024, 1024);
var planeMesh = new THREE.Mesh(geometry, material);
planeMesh.castShadow = false;
planeMesh.receiveShadow = true;
planeMesh.depthWrite = false;
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.y = 0.0;
scene.add(planeMesh);

////////////////////////////////////////////////////////////////////////////////
// Initialize a basic camera
////////////////////////////////////////////////////////////////////////////////

// Create a camera
var camera = new THREE.Camera();
scene.add(camera);

////////////////////////////////////////////////////////////////////////////////
// handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////

var arToolkitSource = new THREEx.ArToolkitSource({
  // to read from the webcam
  //sourceType: 'webcam',

  // to read from an image
  sourceType: 'image',
  // sourceUrl: THREEx.ArToolkitContext.baseURL + './images/img.jpg',
  //sourceUrl: THREEx.ArToolkitContext.baseURL + './images/augment2.jpg',
  //sourceUrl: '../img/augment2.jpg',
  sourceUrl: THREEx.ArToolkitContext.baseURL + './img/augment2.jpg',

  // to read from a video
  //sourceType: 'video',
  //sourceUrl: THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',
});

arToolkitSource.init(function onReady() {
  onResize();
});

// handle resize
window.addEventListener('resize', function () {
  onResize();
});
function onResize(){
  arToolkitSource.onResize();
  arToolkitSource.copySizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
  }
};

////////////////////////////////////////////////////////////////////////////////
// initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////

// create atToolkitContext
var arToolkitContext = new THREEx.ArToolkitContext({
  //cameraParametersUrl: THREEx.ArToolkitContext.baseURL + './vendor/AR.js/data/data/camera_para.dat',
  cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'data/camera_para.dat',
  detectionMode: 'mono',
  // maxDetectionRate: 30,
  // canvasWidth: 80*3,
  // canvasHeight: 60*3,
});
// initialize it
arToolkitContext.init(function onCompleted() {
  // copy projection matrix to camera
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

// update artoolkit on every frame
onRenderFcts.push(function () {
  if (arToolkitSource.ready === false) {
    return;
  }
  arToolkitContext.update(arToolkitSource.domElement);
  // update scene.visible if the marker is seen
  scene.visible = camera.visible;
});

////////////////////////////////////////////////////////////////////////////////
// Create a ArMarkerControls
////////////////////////////////////////////////////////////////////////////////

var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
  type: 'pattern',
  //patternUrl: THREEx.ArToolkitContext.baseURL + './vendor/AR.js/data/data/patt.hiro',
  patternUrl: THREEx.ArToolkitContext.baseURL + 'data/patt.hiro',
  //patternUrl: THREEx.ArToolkitContext.baseURL + './vendor/AR.js/data/data/patt.kanji',
  // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
  changeMatrixMode: 'cameraTransformMatrix',
});
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false;

////////////////////////////////////////////////////////////////////////////////
// add an object in the scene
////////////////////////////////////////////////////////////////////////////////

var markerRoot = new THREE.Group;
scene.add(markerRoot);

// Add axis helper for debug
var mesh = new THREE.AxisHelper(1000);
markerRoot.add(mesh);

// add a torus knot
// var geometry	= new THREE.CubeGeometry(1,1,1);
// var material	= new THREE.MeshNormalMaterial({
// 	transparent : true,
// 	opacity: 0.5,
// 	side: THREE.DoubleSide
// });
// var mesh	= new THREE.Mesh( geometry, material );
// mesh.position.y	= geometry.parameters.height/2
// markerRoot.add( mesh );

//;(function(){
//var geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16); // make it slightly larger for better view
/*var geometry = new THREE.TorusKnotGeometry(0.6, 0.13, 64, 16); // make it slightly larger for better view
var material = new THREE.MeshNormalMaterial();
var material = new THREE.MeshLambertMaterial();
var mesh = new THREE.Mesh(geometry, material);
//var mesh = new THREE.Mesh();
mesh.castShadow = true;
mesh.receiveShadow = true;
//mesh.castShadow = false;
//mesh.receiveShadow = false;
//mesh.position.y	= 0.7;
mesh.position.y	= 1.0;
markerRoot.add(mesh);
// point the directionalLight to the marker
//directionalLight.target = mesh;

onRenderFcts.push(function() {
  mesh.rotation.x += 0.04;
});*/

// add a transparent ground-plane shadow-receiver
/*var material = new THREE.ShadowMaterial();
material.opacity = 0.7; //! bug in threejs. can't set in constructor

var geometry = new THREE.PlaneGeometry(3, 3);
var planeMesh = new THREE.Mesh( geometry, material);
planeMesh.receiveShadow = true;
planeMesh.depthWrite = false;
planeMesh.rotation.x = -Math.PI / 2;
markerRoot.add(planeMesh);*/
//})()

// https://github.com/donmccurdy/three-gltf-viewer/blob/master/Viewer.js
// https://github.com/donmccurdy/three-gltf-viewer/blob/master/index.js
// https://threejs.org/docs/#examples/loaders/GLTF2Loader
// http://jsdo.it/cx20/M7WC
//var url = 'sketchfab/models/Duck/glTF-Binary/Duck.glb';
// Self converted
//var url = 'models/Duck/gltf/text/Duck.gltf';
//var url = 'models/Duck/gltf/binary-sep/Duck.glb';
//var url = 'models/Duck/gltf/binary/Duck.glb';
//var url = './models/Duck/gltf/gzip/Duck.glb';
//var url = './models/boldogkoi-var/model.glb';
////var url = './models/' + data.model + '/model.' + data.extension;
//var url = THREEx.ArToolkitContext.baseURL + 'models/parlament2/model.glb';
var url = THREEx.ArToolkitContext.baseURL + 'models/Duck/gltf/binary/Duck.glb';
// Instantiate a loader
var loader = new THREE.GLTFLoader();
//allow cross origin loading
loader.crossOrigin = '';
// Load a glTF resource
loader.load(url, function (gltf) {
  // Create a sphere that cast shadows (but does not receive them)
  var sphere = gltf.scene || gltf.scenes[0];
  sphere.castShadow = true; // default: false
  //sphere.receiveShadow = true; // default: false
  sphere.receiveShadow = false; // default: false
  //sphere.position.y = 0.7;
  //sphere.rotation.x = 0 * (Math.PI / 180);
  //sphere.rotation.y = 270 * (Math.PI / 180);
  //sphere.rotation.z = 0 * (Math.PI / 180);
  //sphere.scale.set(0.02, 0.02, 0.02);
  //
  /*sphere.position.y = data.posY;
  sphere.rotation.x = data.rotX * (Math.PI / 180);
  sphere.rotation.y = data.rotY * (Math.PI / 180);
  sphere.rotation.z = data.rotZ * (Math.PI / 180);
  sphere.scale.set(scale, scale, scale);*/

  /*sphere.position.y = 0.7;
  sphere.rotation.x = 0 * (Math.PI / 180);
  sphere.rotation.y = 270 * (Math.PI / 180);
  sphere.rotation.z = 0 * (Math.PI / 180);
  sphere.scale.set(0.02, 0.02, 0.02);*/
  
  //
  scene.add(sphere);
  onRenderFcts.push(function () {
    //sphere.rotation.x += 0.04;
    //sphere.rotation.x += 0.02;
    sphere.rotation.y += 0.01;
  });

  //gltf.animations; // Array<THREE.AnimationClip>
  //gltf.scene;      // THREE.Scene
  //gltf.scenes;     // Array<THREE.Scene>
  //gltf.cameras;    // Array<THREE.Camera>
});

/*var loader = new THREE.ColladaLoader();
//var url = 'models/Duck/Duck.dae';
var url = 'models/Duck/export/Duck.DAE';
loader.load(url, function(result) {
  var sphere = result.scene;
  sphere.position.y = 0.7;
  sphere.rotation.x = 90 * (Math.PI / 180);
  sphere.rotation.y = 180 * (Math.PI / 180);
  sphere.rotation.z = 90 * (Math.PI / 180);
  sphere.castShadow = true;
  sphere.receiveShadow = false;
  scene.add(sphere);
  onRenderFcts.push(function() {
    sphere.rotation.x += 0.04;
  });
});*/

/*// add a transparent ground-plane shadow-receiver
var material = new THREE.ShadowMaterial();
material.opacity = 0.7; //! bug in threejs. can't set in constructor
//var geometry = new THREE.PlaneGeometry(3, 3);
var geometry = new THREE.PlaneGeometry(1024, 1024);
var planeMesh = new THREE.Mesh(geometry, material);
planeMesh.castShadow = false;
planeMesh.receiveShadow = true;
planeMesh.depthWrite = false;
planeMesh.rotation.x = -Math.PI / 2;
planeMesh.position.y = 0.0;
markerRoot.add(planeMesh);*/

////////////////////////////////////////////////////////////////////////////////
// render the whole thing on the page
////////////////////////////////////////////////////////////////////////////////

// render the scene
onRenderFcts.push(function () {
  renderer.render(scene, camera);
});

/*if (data.debug === 'true') {
  var stats = new Stats();
  document.body.appendChild(stats.dom);
  onRenderFcts.push(function () {
    stats.update();
  });
}*/

var stats = new Stats();
document.body.appendChild(stats.dom);
onRenderFcts.push(function () {
  stats.update();
});

// run the rendering loop
var lastTimeMsec = null;
requestAnimationFrame(function animate(nowMsec) {
  // keep looping
  requestAnimationFrame(animate);
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
  var deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
  lastTimeMsec = nowMsec;
  // call each update function
  onRenderFcts.forEach(function (onRenderFct) {
    onRenderFct(deltaMsec / 1000, nowMsec / 1000);
  });
});

//});
