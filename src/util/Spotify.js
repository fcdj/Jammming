let accessToken;
const clientId = '69a0459260754717b816a9154e4c3b06';
const redirectUri = `http://localhost:3000`;

const Spotify = {
  getAccessToken() {
    if (accessToken)  {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    }
    else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    }
  },

  search(searchTerm) {
    const accessToken =Spotify.getAccessToken();
      return fetch(`https://cors-anywhere.herokuapp.com/https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
      {
          headers: { Authorization: `Bearer ${accessToken}`}
      }
    ).then(response =>
      {return response.json()}
      ).then(jsonResponse => {
          if (jsonResponse.tracks) {
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
              }
            ));
          } else {
            return [];
          }
        })
  },

  savePlaylist(newPlaylist, trackUriList)  {
    if (!newPlaylist || !trackUriList.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    let userId ='';

    return fetch(`https://api.spotify.com/v1/me`,
      {
        headers: { Authorization: `Bearer ${accessToken}`}
      })
    .then(response => {
      return response.json();
      })
    .then(jsonResponse => {

        userId = jsonResponse.id;

    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
      {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`},
          body: JSON.stringify({name: newPlaylist})
      }).then(response => {
          return response.json();
      }).then(jsonResponse => {
        if (!jsonResponse.id) {
          return;
        }

        let playlistId = jsonResponse.id;

      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`},
          body: JSON.stringify({uris: trackUriList})
      });
    });
  });
}
};


export default Spotify;
