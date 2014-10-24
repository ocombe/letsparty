angular.module('letsparty.services', [])
  .constant('spotifyUrl', "https://api.spotify.com/v1")
  .constant('authUrl', "https://letsparty.auth0.com/api")
  .constant('authToken', {
    "access_token": "k7FDd6QYxaESpiurxh2Pnl9b3AOxAVqcmkB05MiDKTIqN8V87uUVcfZzJUegNgcu",
    "token_type": "bearer"
  })

  .factory('$authApi', function(Restangular, authUrl, authToken) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(authUrl).setDefaultHeaders({authorization:authToken.token_type + " " + authToken.access_token});
    });
  })

  .factory('$spotifyApi', function(Restangular, spotifyUrl) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setBaseUrl(spotifyUrl);
    });
  })

  .factory('Users', function(Restangular, auth, $q, $authApi, authToken) {
    var api = $authApi.all("");

    //var users = Restangular.allUrl('users', 'https://letsparty.auth0.com/api/users');

    var self = {
      all: function() {
        return api.all("users").getList();
      }
    };

    return self;
  })

.factory('$spotify', ['$http', 'Restangular', '$spotifyApi', function($http, Restangular, $spotifyApi) {
  var api = $spotifyApi.all("");
  return {
    search: function search(query, type) {
      return $spotifyApi.all('search').get("", {
        'q': query+'*',
        type: type
      });
    },

    getArtistAlbums: function getArtistAlbums(artistId) {
      return api.get("artists/"+artistId+"/albums");
    },

    getAlbumTracks: function getAlbumTracks(albumId) {
      return api.get("albums/"+albumId+"/tracks");
    },

    getArtist: function(artistId) {
      return api.get('artists/'+artistId);
    },

    getAlbum: function(albumId) {
      return api.get('albums/'+albumId);
    }
  };
}]);
