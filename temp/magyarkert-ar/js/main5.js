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
			//this.animate();
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
	
		// init scene and camera
		var scene = new THREE.Scene();

		// Adding lights
		var ambient = new THREE.AmbientLight(0x222222);
		ambient.intensity = 1;
		scene.add(ambient);
		var light1 = new THREE.DirectionalLight(0xffeedd);
		light1.position.set(0, 0, 1);
		light1.intensity = 1;
		light1.castShadow = false;
		scene.add(light1);
		var light2 = new THREE.DirectionalLight(0xffeedd);
		light2.position.set(0, 5, -5);
		light2.intensity = 1;
		light2.castShadow = false;
		scene.add(light2);





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
		mesh.castShadow = false;
		mesh.receiveShadow = false;
		markerRoot.add(mesh);

		onRenderFcts.push(function () {
			mesh.rotation.x += 0.01;
			mesh.rotation.y += 0.02;
		});

		////////////////////////////////////////////////////////////////////////
		//		render the whole thing on the page
		////////////////////////////////////////////////////////////////////////

		// render the scene
		onRenderFcts.push(function () {
			renderer.render(scene, camera);
			stats.update();
		})

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
			onRenderFcts.forEach(function(onRenderFct) {
				onRenderFct(deltaMsec / 1000, nowMsec / 1000);
			});
		});
	},
	/*animate: function animate() {
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
	},*/
};

app.initialize();
