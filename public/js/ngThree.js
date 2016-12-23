angular.module('ngThree', ['ngThreeSTL'])
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
	var btnWireframe = $('<button style="margin-left: 4px" class="btn-wireframe" ng-click="toggleWireframe()" alt="Wireframe"></button>')
	var btnColor = $('<input class="spectrum-color"></input>')
	$compile(btnWireframe)($scope);
	nav.append(btnWireframe);
	nav.append(btnColor);
	$(ele).append(nav);
	// 
	console.log(stl.colors.primary.getHex());
	$('.spectrum-color').spectrum({
		color: stl.colors.primary.getHexString(),
	});
	btnColor.on('move.spectrum', function (e, color) {
		var hex = color.toHexString();
		stl.changeColor(hex);
	});
},// link ending
};}])// stl-handler ending
;// angular.module ending
