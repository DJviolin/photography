'use strict';

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
		} else {
			var warning = Detector.getWebGLErrorMessage();
			document.getElementById(id).appendChild(warning);
		}
	},
	init: function init(id) {
		THREEx.ArToolkitContext.baseURL = '../www/';

		var renderer = new THREE.WebGLRenderer({
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
		var container = document.getElementById(id);
		container.appendChild(renderer.domElement);
		
		var stats = new Stats();
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

		////////////////////////////////////////////////////////////////////////
		//		Initialize a basic camera
		////////////////////////////////////////////////////////////////////////

		// Create a camera
		var camera = new THREE.Camera();
		scene.add(camera);

		////////////////////////////////////////////////////////////////////////
		//          handle arToolkitSource
		////////////////////////////////////////////////////////////////////////

		var arToolkitSource = new THREEx.ArToolkitSource({
			// to read from the webcam 
			//sourceType: 'webcam',

			// to read from an image
			sourceType: 'image',
			sourceUrl: THREEx.ArToolkitContext.baseURL + 'img/augment2.jpg',

			// to read from an image
			// sourceType : 'image',
			// sourceUrl : THREEx.ArToolkitContext.baseURL + 'data/images/img.jpg',	

			// to read from a video
			// sourceType : 'video',
			// sourceUrl : THREEx.ArToolkitContext.baseURL + 'data/videos/headtracking.mp4',		
		});

		arToolkitSource.init(function onReady() {
			onResize();
		});
		
		// handle resize
		window.addEventListener('resize', function() {
			onResize();
		});
		function onResize() {
			//arToolkitSource.onResize();
			arToolkitSource.onResizeElement();
			//arToolkitSource.copySizeTo(renderer.domElement);
			arToolkitSource.copyElementSizeTo(renderer.domElement);
			if (arToolkitContext.arController !== null) {
				//arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);
				arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);		
			}
		}

		////////////////////////////////////////////////////////////////////////
		//          initialize arToolkitContext
		////////////////////////////////////////////////////////////////////////

		// create atToolkitContext
		/*var arToolkitContext = new THREEx.ArToolkitContext({
			cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'data/camera_para.dat',
			detectionMode: 'mono',
			maxDetectionRate: 30,
			canvasWidth: 80 * 3,
			canvasHeight: 60 * 3,
		});
		// initialize it
		arToolkitContext.init(function onCompleted() {
			// copy projection matrix to camera
			camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
		});

		// update artoolkit on every frame
		onRenderFcts.push(function () {
			if(arToolkitSource.ready === false) return;
			arToolkitContext.update(arToolkitSource.domElement);
		});*/

		////////////////////////////////////////////////////////////////////////
		// initialize arToolkitContext
		////////////////////////////////////////////////////////////////////////

		// create atToolkitContext
		var arToolkitContext = new THREEx.ArToolkitContext({
			cameraParametersUrl: THREEx.ArToolkitContext.baseURL + 'data/camera_para.dat',
			//detectionMode: 'mono',
			// maxDetectionRate: 30,
			// canvasWidth: 80*3,
			// canvasHeight: 60*3,

			// AR backend - ['artoolkit', 'aruco', 'tango']
			//trackingBackend: 'artoolkit',
			trackingBackend: 'aruco',
			// the mode of detection - ['color', 'color_and_matrix', 'mono', 'mono_and_matrix']
			detectionMode: 'mono',
			//debug: true,
			imageSmoothingEnabled: true,

			maxDetectionRate: 30,
			canvasWidth: window.innerWidth,
			canvasHeight: window.innerHeight,
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

		////////////////////////////////////////////////////////////////////////
		// Create a ArMarkerControls
		////////////////////////////////////////////////////////////////////////

		/*var markerRoot = new THREE.Group;
		scene.add(markerRoot);
		var artoolkitMarker = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
			type: 'pattern',
			patternUrl: THREEx.ArToolkitContext.baseURL + 'data/patt.hiro',
			// patternUrl: THREEx.ArToolkitContext.baseURL + 'data/patt.kanji',
		});
	
		// build a smoothedControls
		var smoothedRoot = new THREE.Group();
		scene.add(smoothedRoot);
		var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
			lerpPosition: 0.4,
			lerpQuaternion: 0.3,
			lerpScale: 1,
		});
		onRenderFcts.push(function (delta) {
			smoothedControls.update(markerRoot);
		});*/

		////////////////////////////////////////////////////////////////////////
		// Create a ArMarkerControls
		////////////////////////////////////////////////////////////////////////

		var markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
			type: 'pattern',
			patternUrl: THREEx.ArToolkitContext.baseURL + 'data/patt.hiro',
			//patternUrl: THREEx.ArToolkitContext.baseURL + 'data/patt.kanji',
			// as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
			changeMatrixMode: 'cameraTransformMatrix',
		});
		// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
		scene.visible = false;

		//var markerRoot = new THREE.Group;
		//scene.add(markerRoot);
		//var smoothedRoot = markerRoot;

		var arWorldRoot = new THREE.Group;
		scene.add(arWorldRoot);

		////////////////////////////////////////////////////////////////////////
		// add an object in the scene
		////////////////////////////////////////////////////////////////////////

		//var arWorldRoot = smoothedRoot;

		var geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
		var material = new THREE.MeshNormalMaterial();
		var mesh = new THREE.Mesh(geometry, material);
		mesh.castShadow = false;
		mesh.receiveShadow = false;
		arWorldRoot.add(mesh);

		onRenderFcts.push(function () {
			mesh.rotation.x += 0.01;
			mesh.rotation.y += 0.02;
		});

		// Add axis helper for debug
		var meshHelper = new THREE.AxisHelper(1000);
		arWorldRoot.add(meshHelper);

		////////////////////////////////////////////////////////////////////////
		// render the whole thing on the page
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
			onRenderFcts.forEach(function (onRenderFct) {
				onRenderFct(deltaMsec / 1000, nowMsec / 1000);
			});
		});
	},
};

app.initialize();
