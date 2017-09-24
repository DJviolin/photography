'use strict';

var container, stats;
var camera, scene, renderer;
var geometry, material, mesh, markerRoot;

var app = {
	// Application Constructor
	initialize: function initialize() {
		document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
	},

	// deviceready Event Handler
	//
	// Bind any cordova events here. Common events are:
	// 'pause', 'resume', etc.
	onDeviceReady: function onDeviceReady() {
		this.receivedEvent('deviceready');
	},

	// Update DOM on a Received Event
	receivedEvent: function receivedEvent(id) {
		if (Detector.webgl) {
			this.init(id);
			this.animate();
		} else {
			var warning = Detector.getWebGLErrorMessage();
			document.getElementById(id).appendChild(warning);
		}
	},
	init: function init(id) {
		THREEx.ArToolkitContext.baseURL = '../www/';

		renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			//logarithmicDepthBuffer: true, // logarithmic z-buffer
		});
		
		renderer.shadowMap.enabled = true;
		// THREE.BasicShadowMap | THREE.PCFShadowMap | THREE.PCFSoftShadowMap
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.shadowCameraVisible = true;
		renderer.setClearColor(0xcccccc, 0);
		renderer.setPixelRatio(window.devicePixelRatio);

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.top = '0px';
		renderer.domElement.style.left = '0px';

		//document.body.appendChild(renderer.domElement);
		container = document.getElementById(id);
		container.appendChild(renderer.domElement);
		
		stats = new Stats();
		container.appendChild(stats.dom);

		// array of functions for the rendering loop
		var onRenderFcts = [];




		scene = new THREE.Scene();

		// This light globally illuminates all objects in the scene equally.
		// This light cannot be used to cast shadows as it does not have a direction.
		//var ambient = new THREE.AmbientLight(0x666666);
		var ambient = new THREE.AmbientLight(0x222222);
		ambient.intensity = 1;
		scene.add(ambient);


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

		//Create a helper for the shadow camera (optional)
		var helper = new THREE.CameraHelper(spotLight.shadow.camera);
		scene.add(helper);

		// add a transparent ground-plane shadow-receiver
		/*var material = new THREE.ShadowMaterial();
		material.opacity = 0.7; //! bug in threejs. can't set in constructor
		//var geometry = new THREE.PlaneGeometry(3, 3);
		var geometry = new THREE.PlaneGeometry(1024, 1024);
		var planeMesh = new THREE.Mesh(geometry, material);
		planeMesh.castShadow = false;
		planeMesh.receiveShadow = true;
		planeMesh.depthWrite = false;
		planeMesh.rotation.x = -Math.PI / 2;
		planeMesh.position.y = 0.0;
		scene.add(planeMesh);*/




		// Initialize a basic camera
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
		camera.position.z = 1;

		// add an object in the scene
		markerRoot = new THREE.Group;
		scene.add(markerRoot);
		// Add axis helper for debug
		mesh = new THREE.AxisHelper(1000);
		markerRoot.add(mesh);

		geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
		material = new THREE.MeshNormalMaterial();
		mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = true;
		mesh.receiveShadow = false;
		markerRoot.add(mesh);
	},
	animate: function animate() {
		//requestAnimationFrame(animate);
		//requestAnimationFrame(() => this.animate());
		var _this = this;
		requestAnimationFrame(function () {
			return _this.animate();
		});

		mesh.rotation.x += 0.01;
		mesh.rotation.y += 0.02;
		renderer.render(scene, camera);

		stats.update();
	},
};

app.initialize();
