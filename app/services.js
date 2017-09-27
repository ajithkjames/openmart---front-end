// Service for accessing local storage
employeeApp.service('LocalStorage', [function() {

  var Service = {};

  // Returns true if there is a token stored
  var hasToken = function() {
    return !!localStorage['id_token'];
  };

  // Returns a stored token (false if none is stored)
  Service.getToken = function() {
    if (hasToken()) {
      return localStorage['id_token'];
    } else {
      return false;
    }
  };

   return Service;
  
}]);

employeeApp.directive('fileModel', ['$parse', function ($parse) {
return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
};
}]);
employeeApp.service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('image', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Authorization': 'token '+ 'e3ed9ea54b0585db36b42da5bca662b60390df4c',
                      'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);