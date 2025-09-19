import React from 'react';
import { FiMusic, FiTrash2, FiPlay } from 'react-icons/fi';
import {
  PlaylistContainer,
  PlaylistHeader,
  TrackList,
  TrackItem,
  TrackInfo,
  TrackActions,
  ActionButton,
  EmptyPlaylist,
  ClearAllButton
} from '../styles/PlaylistManager.styled';
import { formatFileSize, formatDuration } from '../utils/formatter';

const PlaylistManager = ({ 
  playlist = [], 
  currentTrack, 
  onTrackSelect, 
  onTrackRemove,
  onClearPlaylist 
}) => {

  if (playlist.length === 0) {
    return (
      <PlaylistContainer>
        <EmptyPlaylist>
          <FiMusic />
          <h3>No tracks in playlist</h3>
          <p>Upload some audio files to build your playlist</p>
        </EmptyPlaylist>
      </PlaylistContainer>
    );
  }

  return (
    <PlaylistContainer>
      <PlaylistHeader>
        <h2>
          <FiMusic />
          Playlist
        </h2>
        <div className="playlist-controls">
          <span className="track-count">
            {playlist.length} track{playlist.length !== 1 ? 's' : ''}
          </span>
          {playlist.length > 0 && (
            <ClearAllButton onClick={onClearPlaylist}>
              Clear All
            </ClearAllButton>
          )}
        </div>
      </PlaylistHeader>

      <TrackList>
        {playlist.map((track, index) => (
          <TrackItem 
            key={track.id}
            isPlaying={currentTrack && currentTrack.id === track.id}
            onClick={() => onTrackSelect(track)}
          >
            <TrackInfo isPlaying={currentTrack && currentTrack.id === track.id}>
              <div className="track-name">{track.name}</div>
              <div className="track-meta">
                <span>{formatFileSize(track.size)}</span>
                <span>{formatDuration(track.duration)}</span>
                {track.artist && <span>{track.artist}</span>}
              </div>
            </TrackInfo>

            <TrackActions>
              <ActionButton 
                className="play"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackSelect(track);
                }}
                title="Play track"
              >
                <FiPlay />
              </ActionButton>
              
              <ActionButton 
                className="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrackRemove(track.id);
                }}
                title="Remove from playlist"
              >
                <FiTrash2 />
              </ActionButton>
            </TrackActions>
          </TrackItem>
        ))}
      </TrackList>
    </PlaylistContainer>
  );
};

export default PlaylistManager;