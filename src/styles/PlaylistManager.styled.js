import styled from 'styled-components';

export const PlaylistContainer = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
`;

export const PlaylistHeader = styled.div`
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

export const TrackList = styled.div`
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

export const TrackItem = styled.div`
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

export const TrackInfo = styled.div`
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

export const TrackActions = styled.div`
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${TrackItem}:hover & {
    opacity: 1;
  }
`;

export const ActionButton = styled.button`
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

export const EmptyPlaylist = styled.div`
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

export const ClearAllButton = styled.button`
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