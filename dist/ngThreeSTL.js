angular.module('ngThreeSTL', [])
.directive('stlHandler', ['$compile', function ($compile) {
	return {// stl-handler starting
		restrict: 'A',
		scope: {},
		controller: ['$scope', '$element', '$attrs', function ($scope, ele, attrs) {
		}],
		link: function ($scope, ele, attrs) {
			var engine = {// define STL engine
				container: ele[0],
				objPath: attrs['url'],
				geometry: '',
				material: new THREE.MeshPhongMaterial({
					color: '',
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
				renderer: new THREE.WebGLRenderer({antialias: true}),
				grid: new THREE.GridHelper(400, 200, new THREE.Color('#ffffff'), new THREE.Color('#ffffff')),
				controls: '',
				loader: new THREE.STLLoader(),
				colors: {
						primary: new THREE.Color('#0a85ff'),
						warning: new THREE.Color('#47002A'),
						support: new THREE.Color('#CACACA'),
						white: new THREE.Color('#ffffff'),
				},
				size: {},
			};// end of STL engine
			// STL engine methods
			engine.init = function () {
				var _this = this;
				_this.camera.aspect = _this.width() / _this.height();
				_this.loader.load(_this.objPath, function (geometry) {
					// typical config
					_this.scene.background = new THREE.Color(_this.colors.support);
					// geometry config
					_this.geometry = geometry;
					_this.geometry.center();// centering the object.
					_this.geometry.rotateZ(Math.PI/2);
					_this.geometry.rotateX(-Math.PI/2);
					_this.geometry.lookAt(new THREE.Vector3(0, 0, 1));
					// material config
					_this.material.depthWrite = true;
					_this.material.color = _this.colors.primary;
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
					_this.camera.position.set(2*_this.size.x, 2*_this.size.y, 2*_this.size.z);
				});
				_this.scene.add(_this.grid);
				_this.scene.add(new THREE.AmbientLight(_this.colors.support, .5));
				_this.camera.updateProjectionMatrix();
				// components added to scene.
				_this.renderer.setSize(_this.width(), _this.height());
				_this.renderer.shadowMap.enabled = true;
				_this.scene.fog = new THREE.FogExp2(_this.colors.support, 0.0128);
				_this.addOrbitControl();
				_this.container.appendChild(_this.renderer.domElement);
				_this.addLight(1, 1, 1, 0xffffff, 1);
				window.addEventListener('resize', function () {// onResizeWindow()
					_this.camera.aspect = _this.width() / _this.height();
					_this.camera.updateProjectionMatrix();
					_this.renderer.setSize(_this.width(), _this.height());
				}, false);
			};
			engine.addOrbitControl = function () {
				var _this = this;
				_this.controls = new THREE.OrbitControls(_this.camera, _this.renderer.domElement);// orbitcontrols();
				_this.controls.maxDistance = 100;
			};
			engine.animate = function () {
				var _this = this;
				window.requestAnimationFrame(function () {
					return _this.animate();
				});
				_this.render();
			};
			engine.render = function () {
				var _this = this;
				var timer = Date.now()*0.0005;
				_this.camera.lookAt(new THREE.Vector3(-1, -2, 0));
				_this.renderer.render(_this.scene, _this.camera);
				_this.renderer.setClearColor(0xffffff, 1);
			};
			engine.addLight = function (x, y, z, color, intensity) {
				var _this = this;
				_this.dirLight = new THREE.DirectionalLight(color, intensity);
				_this.dirLight.position.set(x, y, z)
				_this.scene.add(_this.dirLight);
			};
			engine.changeColor = function (color) {
				var _this = this;
				_this.material.color = new THREE.Color(color);
			};
			engine.toggleWireframe = function () {
				var _this = this;
				if (_this.material.wireframe === false) {
					_this.material.wireframe = true;
				} else {
					_this.material.wireframe = false;
				}
			};
			// end of methods
			// initialize engine
			engine.init();
			engine.animate();
			// start of UI
			var nav = $('<div class="ng-three nav"></div>');
			var btnWireframe = $('<button type="button" style="margin-left: 4px" class="btn-wireframe" ng-click="toggleWireframe()" alt="Wireframe"></button>')
			var btnColor = $('<input class="spectrum-color"></input>')
			$compile(btnWireframe)($scope);
			nav.append(btnWireframe);
			nav.append(btnColor);
			$(ele).append(nav);
			// spectrum defulat color setup
			$('.spectrum-color').spectrum({
				color: engine.colors.primary.getHexString(),
			});
			// Wirefream toggle button
			btnWireframe.on('click', function (e) {
				engine.toggleWireframe();
			});
			// Specturm color change button
			btnColor.on('move.spectrum', function (e, color) {
				var hex = color.toHexString();
				engine.changeColor(hex);
			});
			// end of UI
		},// link ending
	};
}]);// stl-handler ending

