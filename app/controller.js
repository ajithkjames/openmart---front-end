employeeApp.controller('signupController',[ '$scope', '$rootScope', '$http', 'LocalStorage', 'baseurl', '$location','$rootScope', function($scope,$rootScope,$http,LocalStorage,baseurl,$location,$rootScope) {
            $scope.username="";
            $scope.password="";
            $scope.error="";
            $scope.show = false;
            $rootScope.showsearch = false;
            $scope.closeAlert = function(index) {
                $scope.show = false;
            };

              (function init() {
                // Attempt to load token from local storage
                !function() {
                  var token = LocalStorage.getToken();
                  $scope.token = token ? token : '';
                  console.log($scope.token);
                  if ($scope.token) {
                     $location.path('/');
                      console.log($scope.token);
                  };
                }();
              })()

         $scope.signup = function () {
            var request = {
             method: 'POST',
             url: baseurl+'/api/user/',
             data:{
             "username":$scope.username,
             "password":$scope.password,
             "first_name":$scope.name,
             "phone":$scope.phone
             
             },
             headers: {
                 'Content-Type': "application/json"
             }
         };

         // SEND THE data.
         $http.post(request.url, request.data)
         .then(
             function(response){
               $rootScope.authenticated = true;
               $scope.token=response.data.token;
               $scope.error="";
               localStorage.setItem('id_token', $scope.token);
               $location.path('/home');
             }, 
             function(response){
               $scope.error=response.data;
               $scope.show = true;
             }
          );

          }
          

         }])

employeeApp.controller('loginController',[ '$scope','$rootScope', '$http', 'LocalStorage', 'baseurl', '$location','$rootScope', function($scope,$rootScope,$http,LocalStorage,baseurl,$location,$rootScope) {
            $scope.username="";
            $scope.password="";
            $scope.error="";
            $scope.show = false;
            $rootScope.showsearch = false;
            $scope.closeAlert = function(index) {
                $scope.show = false;
            };

              (function init() {
                // Attempt to load token from local storage
                !function() {
                  var token = LocalStorage.getToken();
                  $scope.token = token ? token : '';
                  console.log($scope.token);
                  if ($scope.token) {
                     $location.path('/home');
                      console.log($scope.token);
                  };
                }();
              })()

         $scope.login = function () {
            var request = {
             method: 'POST',
             url: baseurl+'/api/login/',
             data:{
             "username":$scope.username,
             "password":$scope.password,
             
             },
             headers: {
                 'Content-Type': "application/json"
             }
         };

         // SEND THE data.
         $http.post(request.url, request.data)
         .then(
             function(response){
               $rootScope.authenticated = true;
               $scope.token=response.data.token;
               $scope.error="";
               localStorage.setItem('id_token', $scope.token);
               $http({
                    method: 'GET',
                    url: baseurl+'/api/profile/',
                    headers: {'Authorization': 'token '+ $scope.token}
                   
                }).then(function successCallback(response) {
                    $rootScope.profile = response.data;
                }, function errorCallback(response) {
                    console.log(response);
                });
               $location.path('/home');
             }, 
             function(response){
               $scope.error=response.data;
               $scope.show = true;
             }
          );

          }

         }])

employeeApp.controller("homeController", function ($scope, $rootScope, $http, LocalStorage,baseurl, $location , $rootScope) {

            $rootScope.showsearch = true;
            (function init() {
                // Attempt to load token from local storage
                // !function() {
                //   var token = LocalStorage.getToken();
                //   $scope.token = token ? token : '';
                //   console.log($scope.token);
                //   if (!$scope.token) {
                //      $location.path('/');
                //       console.log($scope.token);
                //   };
                // }();
               
                !function() {
                  $http({
                    method: 'GET',
                    url: baseurl+'/api/advertisement/'
                   
                }).then(function successCallback(response) {
                    $scope.advertisements = response.data;
                    $scope.ad=response.data[0];
                    console.log( $scope.advertisements);
                }, function errorCallback(response) {
                    console.log(response);
                });
                }();


              })()

            $scope.username = "ajith";
             $scope.ad={};
            $scope.logout = function() {
               localStorage.removeItem('id_token');
               $location.path('/');
            };

            $scope.showdetails = function(ad) {
               $scope.ad=ad;
               console.log($scope.ad.id);
            };

            $rootScope.search = function() {
               $location.path('/');
               $http({
                    method: 'GET',
                    url: baseurl+'/api/advertisement/?search='+ $rootScope.varRoot.searchterm
                }).then(function successCallback(response) {
                    $scope.advertisements = response.data;
                    $scope.ad=response.data[0];
                    if($scope.advertisements.length < 1) {
                       console.log( $scope.advertisements);
                       $scope.noresults = true;
                      }else{
                           $scope.noresults = false;
                        }
                       
                }, function errorCallback(response) {
                    console.log(response);
                });
            };

        });


employeeApp.controller("newAdController", function ($scope, $rootScope, $http, LocalStorage, baseurl, $location, fileUpload ) {

   $scope.ad= {
    "author": null,
    "title": "",
    "description": "",
    "price": "",
    "category": null,
    "image": null
   };
   $scope.author="";
   $scope.title = "";
   $scope.description = "";
   $scope.price = "";
   $scope.category = "";
   $scope.image = "";
   $scope.show = false;
   $scope.visible = true;
   $rootScope.showsearch = false;


   (function init() {
                // Attempt to load token from local storage
                !function() {
                  var token = LocalStorage.getToken();
                  $scope.token = token ? token : '';
                  console.log($scope.token);
                  if (!$scope.token) {
                     $location.path('/login');
                      console.log($scope.token);
                  };
                }();
              })();

   $scope.createAd = function() {
         var file = $scope.myFile;
        console.log('file is ' );
        console.dir(file);
        var uploadUrl = baseurl+'/api/advertisement/';
        var fd = new FormData();
         fd.append('image', file);
         fd.append("title", $scope.title);
         fd.append("description", $scope.description);
         fd.append("price", $scope.price);
         fd.append("category", $scope.category);
         $http.post(uploadUrl, fd, {
               transformRequest: angular.identity,
               headers: {'Authorization': 'token '+ $scope.token,
                         'Content-Type': undefined}
           }).then(function successCallback(response) {
           $scope.ad = response.data;
           console.log( $scope.ad);
           $scope.show = true;
           $scope.visible = false;
       }, function errorCallback(response) {
           console.log(response);
       });
       };


   });




employeeApp.controller("navController", function ($scope, $rootScope, $http, LocalStorage,baseurl, $location ) {
   $rootScope.varRoot = {
    searchterm: ""
  };
  $rootScope.profile = {};
  console.log($location.path());
  if ($location.path() == '/'){
   $rootScope.showsearch= true;
  }else{
      $rootScope.showsearch = false;
   }

   !function() {
                  var token = LocalStorage.getToken();
                  $scope.token = token ? token : '';
                  $http({
                    method: 'GET',
                    url: baseurl+'/api/profile/',
                    headers: {'Authorization': 'token '+ $scope.token}
                   
                }).then(function successCallback(response) {
                    $rootScope.profile = response.data;
                }, function errorCallback(response) {
                    console.log(response);
                });
                }();

    !function() {
               $rootScope.authenticated = false;
               var token = LocalStorage.getToken();
               $scope.token = token ? token : '';
               console.log($scope.token);
               if ($scope.token) {
                  $rootScope.authenticated = true;
               };
             }();

      $scope.logout = function() {
         localStorage.removeItem('id_token');
         $location.path('/');
         $rootScope.authenticated = false;
      };

  });

employeeApp.controller('profileController',[ '$scope', '$rootScope', '$http', 'LocalStorage', 'baseurl', '$location','$rootScope', function($scope,$rootScope,$http,LocalStorage,baseurl,$location,$rootScope) {
           $rootScope.showsearch = false;
            !function() {
                  var token = LocalStorage.getToken();
                  $scope.token = token ? token : '';
                  $http({
                    method: 'GET',
                    url: baseurl+'/api/profile/',
                    headers: {'Authorization': 'token '+ $scope.token}
                   
                }).then(function successCallback(response) {
                    $rootScope.profile = response.data;
                }, function errorCallback(response) {
                    console.log(response);
                });
                }();


                $scope.update = function () {
                    $http({
                    method: 'PUT',
                    url: baseurl+'/api/user/'+$rootScope.profile.id+'/',
                    data:{
                       "username":$rootScope.profile.username,
                       "password":$rootScope.profile.password,
                       "first_name":$rootScope.profile.first_name,
                       "phone":$rootScope.profile.phone
                       
                       },
                    headers: {'Authorization': 'token '+ $scope.token}
                   
                }).then(function successCallback(response) {
                    $rootScope.profile = response.data;
                    $location.path('/');
                }, function errorCallback(response) {
                    console.log(response);
                });

          }
          

         }])
