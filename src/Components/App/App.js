import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults:[],
      playlistName: 'New Playlist',
      playlistTracks:[]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (this.state.playlistTracks.indexOf(track) === -1) {
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    }
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.indexOf(track) > -1) {
      tracks = tracks.filter(currentSong => currentSong.id !== track.id);
      this.setState({playlistTracks: tracks});
    }
  }

  updatePlaylistName(name){
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    let trackUri = this.state.playlistTracks.map(track => {return track.uri});
    Spotify.savePlaylist(this.state.playlistName,trackUri);
    this.setState({
      playlistTracks: [],
      playlistName: 'New Playlist'
    })
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(tracks => this.setState({searchResults: tracks}));
  }
  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
              <SearchBar onSearch={this.search}/>
            <div className="App-playlist">
              <SearchResults
                searchResults={this.state.searchResults}
                onAdd={this.addTrack}
              />
              <Playlist
                playlistname={this.state.playlistName}
                playlistTracks={this.state.playlistTracks}
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}
              />
            </div>
          </div>
        </div>
    )
  }
}

export default App;
