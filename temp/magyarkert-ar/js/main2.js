'use strict';

var camera, scene, renderer;
var geometry, material, mesh;

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
		camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
		camera.position.z = 1;

		scene = new THREE.Scene();

		geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
		material = new THREE.MeshNormalMaterial();

		mesh = new THREE.Mesh(geometry, material);
		scene.add(mesh);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);

		//document.body.appendChild( renderer.domElement );
		var container = document.getElementById(id);
  		container.appendChild(renderer.domElement);
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
	},
};

app.initialize();
