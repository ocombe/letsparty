// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('letsparty', ['ionic', 'letsparty.controllers', 'letsparty.services', 'restangular', 'auth0', 'LocalForageModule', 'angular-jwt', 'ui.router'])

.run(function($ionicPlatform, auth, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

    // This hooks al auth events to check everything as soon as the app starts
    auth.hookEvents();
})

.config(function($stateProvider, $urlRouterProvider, authProvider) {

    $stateProvider.state('main', {
      abstract: true,
      controller: 'MainCtrl',
      resolve: {
        login: function($q, auth, $rootScope, jwtHelper, $state, $localForage) {

          // Enable pusher logging - don't include this in production
          Pusher.log = function(message) {
            if (window.console && window.console.log) {
              window.console.log(message);
            }
          };
          console.log(auth)

          var pusher = new Pusher('1f956283c4e1b2cda88e');
          $rootScope.channel = pusher.subscribe('users');
          $rootScope.channel.bind('login', function(data) {
            $rootScope.users.push(data);
          });
          $rootScope.channel.bind('logout', function(data) {
            $rootScope.users.push(data);
          });

          $rootScope.users = [];

          if (!auth.isAuthenticated) {
            var deferred = $q.defer();
            var token = $localForage.getItem('token').then(function(token) {
              if (token !== null && !jwtHelper.isTokenExpired(token)) {
                $localForage.getItem('profile').then(function(profile) {
                  auth.authenticate(profile, token);
                  $rootScope.channel.trigger('login', auth.idToken);
                  deferred.resolve();
                });
              } else {
                // Either show Login page or use the refresh token to get a new idToken
                auth.signin({disableSignupAction: false}, function(profile, token) {
                  // Success callback
                  $localForage.setItem('profile', profile);
                  $localForage.setItem('token', token);

                  $rootScope.channel.trigger('login', auth.idToken);

                  $state.go('app.search');
                  deferred.resolve();
                }, function() {
                  // Error callback
                  deferred.reject();
                });
              }
            });
            return deferred.promise;
          }
        }
      }
    });

    $stateProvider.state('app', {
      parent: 'main',
      abstract: true
    });

    $stateProvider.state('app.search', {
      url: "/search/:query",
      views: {
        'menuContent@': {
          templateUrl: "partials/search.html",
          controller: 'SearchCtrl'
        }
      }
    });

    $stateProvider.state('app.artistAlbums', {
      url: "/artist/:artistId",
      views: {
        'menuContent@': {
          templateUrl: "partials/albums.html",
          controller: 'AlbumsCtrl'
        }
      }
    });

    $stateProvider.state('app.albumTracks', {
      url: "/album/:albumId",
      views: {
        'menuContent@': {
          templateUrl: "partials/tracks.html",
          controller: 'TracksCtrl'
        }
      }
    });

    $stateProvider.state('users', {
      parent: 'main',
      url: '/users',
      views: {
        'menuContent@': {
          templateUrl: "partials/users.html",
          controller: 'UsersCtrl'
        }
      }
    });

    $stateProvider.state('logout', {
      parent: 'main',
      url: '/logout',
      onEnter: ['$timeout', '$localForage', '$state', 'auth', '$rootScope', function($timeout, $localForage, $state, auth, $rootScope) {
        $localForage.clear().then(function() {

          $rootScope.channel.trigger('logout', auth.idToken);
          $state.go('app.search').then(function() {
            $timeout(function() {
              location.reload();
            });
          });
        })
      }]
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/search/');

    authProvider.init({
      domain: 'letsparty.auth0.com',
      clientID: 'z1RK5W63tJ0w8vqIUW6ReFTVdG19DB9t'
    });
});

