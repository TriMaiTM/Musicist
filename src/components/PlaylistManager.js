import React from 'react';
import styled from 'styled-components';
import { FiMusic, FiTrash2, FiPlay } from 'react-icons/fi';

const PlaylistContainer = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
`;

const PlaylistHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #333;
  padding-bottom: 1rem;

  h2 {
    margin: 0;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .track-count {
    color: #b3b3b3;
    font-size: 0.9rem;
  }
`;

const TrackList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #333;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 3px;
  }
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isPlaying ? 'rgba(29, 185, 84, 0.2)' : 'transparent'};
  border-left: ${props => props.isPlaying ? '4px solid #1DB954' : '4px solid transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;

  .track-name {
    font-weight: 500;
    color: ${props => props.isPlaying ? '#1DB954' : '#ffffff'};
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .track-meta {
    font-size: 0.8rem;
    color: #b3b3b3;
    display: flex;
    gap: 1rem;
    
    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

const TrackActions = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${TrackItem}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  &.delete:hover {
    color: #ff4444;
  }

  &.play:hover {
    color: #1DB954;
  }
`;

const EmptyPlaylist = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #b3b3b3;

  svg {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  h3 {
    margin: 0 0 0.5rem 0;
    color: #ffffff;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const ClearAllButton = styled.button`
  background: none;
  border: 1px solid #ff4444;
  color: #ff4444;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ff4444;
    color: white;
  }
`;

const PlaylistManager = ({ 
  playlist = [], 
  currentTrack, 
  onTrackSelect, 
  onTrackRemove,
  onClearPlaylist 
}) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (duration) => {
    if (!duration || isNaN(duration)) return '--:--';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

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