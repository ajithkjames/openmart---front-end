var employeeApp = angular.module("employeeApp", ["ngRoute","ngFileUpload"])

// The default API base url
.constant('baseurl', 'http://192.168.1.105:8000')

employeeApp.config(function($routeProvider) {
    $routeProvider.when('/', {
                templateUrl: '/home.html',
                controller: 'homeController'
            }).when('/login', {
                templateUrl: '/login.html',
                controller: 'loginController'
            }).when('/signup', {
                templateUrl: '/signup.html',
                controller: 'signupController'
            }).when('/new', {
                templateUrl: '/new.html',
                controller: 'newAdController'
            }).when('/editprofile', {
                templateUrl: '/profile.html',
                controller: 'profileController'
            }).otherwise({
                redirectTo: "/"
            });
        });