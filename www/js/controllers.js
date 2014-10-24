angular.module('letsparty.controllers', [])

  .controller('MainCtrl', function($rootScope) {


  })

  .controller('UsersCtrl', function($scope, Users, $rootScope) {
    $scope.usersList = Users.all().$object;

    $scope.isOnline = function(id) {
      console.log(id)
      return $rootScope.users.indexOf(id) !== -1;
    }
  })

  .controller('SearchCtrl', ['$scope', '$spotify', '$ionicLoading', '$state', '$stateParams', function($scope, $spotify, $ionicLoading, $state, $stateParams) {
    $scope.search = function(query, manual) {
      if(!query) {
        $scope.artists = false;
      } else {
        $ionicLoading.show({
          template: 'Chargement...'
        });
        $spotify.search(query, 'artist').then(function(res) {
          $scope.artists = res.artists.items;
          $ionicLoading.hide();
        });
      }
      if(manual) {
        $state.go('app.search', {query: query}, {notify: false});
      }
    }

    if($stateParams.query) {
      $scope.query = $stateParams.query;
      $scope.search($stateParams.query);
    }
  }])

  .controller('TracksCtrl', ['$scope', '$spotify', '$ionicLoading', '$stateParams', '$q', function($scope, $spotify, $ionicLoading, $stateParams, $q) {
    var audio = null;

    $scope.isLoved = function isLoved(track) {

    }

    $scope.playStream = function playStream(track) {
      if(audio !== null) {
        audio.pause();
        audio = null;
        $scope.playing = false;
        track.playing = false;
      } else {
        audio = new Audio(track.preview_url);
        audio.play();
        $scope.playing = true;
        track.playing = true;
      }
    }

    $ionicLoading.show({
      template: 'Chargement...'
    });

    var req1 = $spotify.getAlbumTracks($stateParams.albumId).then(function(res) {
      $scope.tracks = res.items;
      $ionicLoading.hide();
    });

    var req2 = $spotify.getAlbum($stateParams.albumId).then(function(res) {
      $scope.album = res;
    });

    $q.all([req1, req2]).then(function() {
      $ionicLoading.hide();
    })
  }])

  .controller('AlbumsCtrl', ['$scope', '$spotify', '$ionicLoading', '$stateParams', '$q', function($scope, $spotify, $ionicLoading, $stateParams, $q) {
    $scope.searchAlbumPreview = function(album) {
      $spotify.getAlbumTracks(album.id).then(function(res) {
        album.previewUrl = res.items[0].preview_url;
        $ionicLoading.hide();
      });
    }

    $ionicLoading.show({
      template: 'Chargement...'
    });

    var req1 = $spotify.getArtistAlbums($stateParams.artistId).then(function(res) {
      $scope.albums = res.items;
    });

    var req2 = $spotify.getArtist($stateParams.artistId).then(function(res) {
      $scope.artist = res;
    });

    $q.all([req1, req2]).then(function() {
      $ionicLoading.hide();
    })
  }]);