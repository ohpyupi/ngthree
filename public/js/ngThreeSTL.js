angular.module('ngThreeSTL', [])

.factory('stl', [function () {
var stl = {
	container: '',
	geometry: '',
	material: new THREE.MeshPhongMaterial({
		color: '#0a85ff', 
		shininess: 2000,
	}),
	width: function () {
		return $(this.container).width();
	},
	height: function () {
		return $(this.container).height();
	},
	camera: new THREE.PerspectiveCamera(100, 1, 1, 1000),
	scene: new THREE.Scene(),
	renderer: new THREE.WebGLRenderer({ antialias: true }),
	objPath: '',
	grid: new THREE.GridHelper(400, 200, new THREE.Color('#ffffff'), new THREE.Color('#ffffff')),
	//dirLight: new THREE.DirectionalLight(0xffffff, 1),
	controls: '',
	loader: new THREE.STLLoader(),
	colors: {
		primary: new THREE.Color('#0a85ff'),
		warning: new THREE.Color('#47002A'),
		support: new THREE.Color('#CACACA'),
		white: new THREE.Color('#ffffff'),
	},
};

stl.init = function () {
	var _this = stl;
	_this.loader.load(_this.objPath, function (geometry) {
		// tipical config
		_this.scene.background = new THREE.Color(stl.colors.support);
		// geometry config
		_this.geometry = geometry;
		_this.geometry.center();// centering the object.
		_this.geometry.rotateZ(Math.PI/2);
		_this.geometry.rotateX(-Math.PI/2);
		_this.geometry.lookAt(new THREE.Vector3(0, 0, 1));
		// material config
		_this.material.depthWrite = true;
		_this.material.side = THREE.DoubleSide;
		// mesh config
		_this.mesh = new THREE.Mesh(_this.geometry, _this.material);
		// bounding box config
		_this.bbox = new THREE.Box3().setFromObject(_this.mesh);
		// object size defined
		_this.size = {
			x: _this.bbox.max.x/2,
			y: _this.bbox.max.y/2,
			z: _this.bbox.max.z/2,
		};
		// object's alingment config
		_this.mesh.position.set(0, _this.size.y, 0);
		_this.mesh.receiveShadow = true;
		_this.mesh.castShadow = true;
		_this.mesh.scale.set(.5, .5, .5);
		_this.scene.add(_this.mesh);
		//_this.dirLight.castShadow = true;
		//_this.dirLight.shadow.camera.zoom = 4;
		_this.camera.position.set(2*_this.size.x, 2*_this.size.y, 2*_this.size.z);
	});
	_this.scene.add(_this.grid);
	//_this.scene.add(new THREE.AmbientLight(_this.colors.support, .5));
	//_this.dirLight.position.set(0, 0, 0);
	//_this.scene.add(_this.dirLight);
	_this.camera.updateProjectionMatrix();
	// components added to scene.
	_this.renderer.setSize(_this.width(), _this.height());
	_this.renderer.shadowMap.enabled = true;
	_this.scene.fog = new THREE.FogExp2(_this.colors.support, 0.0128);
	_this.container.appendChild(_this.renderer.domElement);
	window.addEventListener('resize', _this.onWindowResize, false);
};

stl.addLight = function (x, y, z, color, intensity) {
	var _this = stl;
	_this.dirLight = new THREE.DirectionalLight(color, intensity);
	_this.dirLight.position.set(x, y, z)
	_this.scene.add(_this.dirLight);
};

stl.animate = function () {
	var _this = stl;
	window.requestAnimationFrame(function () {
		return _this.animate();
	});
	_this.render();
};

stl.addOrbitControl = function () {
	var _this = stl;
	_this.controls = new THREE.OrbitControls(_this.camera, _this.renderer.domElement);// orbitcontrols();
};

stl.render = function () {
	var _this = stl;
	var timer = Date.now()*0.0005;
	_this.camera.lookAt(new THREE.Vector3(-1, -2, 0));
	_this.renderer.render(_this.scene, _this.camera);
	_this.renderer.setClearColor(0xffffff, 1);
};

stl.toggleWireframe = function () {
	var _this = stl;
	if (_this.material.wireframe === false) {
		_this.material.wireframe = true;
	} else {
		_this.material.wireframe = false;
	}
};

stl.addPlane = function () {
	var _this = stl;
	_this.plane.rotation.x = -Math.PI/2;
	_this.plane.position.y = -0.5;
	_this.plane.receiveShadow = true;
	_this.scene.add(_this.plane);
};

stl.addGrid = function () {
	var _this = stl;
	console.log(_this.grid);
	_this.scene.add(_this.grid);
};

stl.changeColor = function (color) {
	var _this = stl;
	if (color === 'r') {
		_this.material.color = _this.colors.warning;
	} else if (color === 'b') {
		_this.material.color = _this.colors.primary;
	} else if (color === 'y') {
		_this.material.color = new THREE.Color('#FFEB01');
	}
};

stl.onWindowResize = function () {
	var _this = stl;
	_this.camera.aspect = _this.width() / _this.height();
	_this.camera.updateProjectionMatrix();
	_this.renderer.setSize(_this.width(), _this.height());
}// onWindowResize() ending

return stl;
}]);
