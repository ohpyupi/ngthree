angular.module('MyApp', ['ngThreeSTL'])
.directive('stlHandler', ['stl', '$compile',function (stl, $compile) {return {// stl-handler starting
restrict: 'A',
controller: ['$scope', '$element', '$attrs', function ($scope, ele, attrs) {
	stl.container = ele[0];
	stl.scene.fog = new THREE.Fog(stl.colors.support);
	stl.objPath = attrs['url'];
	stl.init();
	stl.animate();
	stl.addLight(1, 1, 1, 0xffffff, 1);
	// UI functions
	$scope.toggleWireframe = stl.toggleWireframe;
	$scope.changeColor = stl.changeColor;
}],
link: function ($scope, ele, attrs) {
	var nav = $('<div class="ng-three nav"></div>');
	var btnWireframe = $('<button class="btn-wireframe" ng-click="toggleWireframe()">Wireframe</button>')
	var btnRed = $('<button class="btn-colors" ng-click="changeColor(\'r\')">Red</button>')
	var btnBlue = $('<button class="btn-colors" ng-click="changeColor(\'b\')">Blue</button>')
	var btnYellow = $('<button class="btn-colors" ng-click="changeColor(\'y\')">Red</button>')
	$compile(btnWireframe)($scope);
	$compile(btnRed)($scope);
	$compile(btnBlue)($scope);
	$compile(btnYellow)($scope);
	nav.append(btnWireframe);
	nav.append(btnRed);
	nav.append(btnBlue);
	nav.append(btnYellow);
	$(ele).append(nav);

	stl.addOrbitControl();
},// link ending
};}])// stl-handler ending
;// angular.module ending
