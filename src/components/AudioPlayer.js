import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiVolume2,
  FiVolumeX,
  FiShuffle,
  FiRepeat
} from 'react-icons/fi';

const PlayerContainer = styled.div`
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const TrackInfo = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #b3b3b3;
    font-size: 0.9rem;
  }
`;

const ProgressContainer = styled.div`
  margin: 1.5rem 0;
`;

const ProgressBar = styled.div`
  position: relative;
  height: 6px;
  background: #404040;
  border-radius: 3px;
  cursor: pointer;
  margin: 0.5rem 0;
`;

const Progress = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #1DB954 0%, #1ed760 100%);
  border-radius: 3px;
  width: ${props => props.progress || 0}%;
  transition: width 0.1s ease;
`;

const TimeDisplay = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #b3b3b3;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? '#1DB954' : '#ffffff'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #1DB954;
    background: rgba(29, 185, 84, 0.1);
  }

  &.play-pause {
    background: #1DB954;
    color: white;
    padding: 1rem;
    font-size: 1.5rem;

    &:hover {
      background: #1ed760;
      transform: scale(1.05);
    }
  }

  svg {
    font-size: ${props => props.size || '1.2rem'};
  }
`;

const VolumeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;

  input[type="range"] {
    flex: 1;
    height: 4px;
    background: #404040;
    border-radius: 2px;
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 12px;
      height: 12px;
      background: #1DB954;
      border-radius: 50%;
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 12px;
      height: 12px;
      background: #1DB954;
      border-radius: 50%;
      cursor: pointer;
      border: none;
    }
  }
`;

const AudioPlayer = ({ 
  currentTrack, 
  playlist = [], 
  onTrackChange,
  onPlaylistEnd 
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // 'none', 'one', 'all'

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
      let nextIndex;

      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play();
        return;
      }

      if (isShuffled) {
        nextIndex = Math.floor(Math.random() * playlist.length);
      } else {
        nextIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
      }

      if (repeatMode === 'none' && currentIndex === playlist.length - 1) {
        setIsPlaying(false);
        if (onPlaylistEnd) onPlaylistEnd();
        return;
      }

      if (onTrackChange && playlist[nextIndex]) {
        onTrackChange(playlist[nextIndex]);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, playlist, repeatMode, isShuffled, onTrackChange, onPlaylistEnd]);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentTime > 3) {
      // If more than 3 seconds played, restart current track
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      // Go to previous track
      const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
      let prevIndex;
      
      if (isShuffled) {
        prevIndex = Math.floor(Math.random() * playlist.length);
      } else {
        prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
      }
      
      if (onTrackChange && playlist[prevIndex]) {
        onTrackChange(playlist[prevIndex]);
      }
    }
  };

  const handleNext = () => {
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    let nextIndex;

    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
    }

    if (repeatMode === 'none' && currentIndex === playlist.length - 1) {
      setIsPlaying(false);
      if (onPlaylistEnd) onPlaylistEnd();
      return;
    }

    if (onTrackChange && playlist[nextIndex]) {
      onTrackChange(playlist[nextIndex]);
    }
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    const modes = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  if (!currentTrack) {
    return (
      <PlayerContainer>
        <TrackInfo>
          <h3>No track selected</h3>
          <p>Upload some music to get started</p>
        </TrackInfo>
      </PlayerContainer>
    );
  }

  return (
    <PlayerContainer>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        volume={volume}
        preload="metadata"
      />

      <TrackInfo>
        <h3>{currentTrack.name}</h3>
        <p>{currentTrack.artist || 'Unknown Artist'}</p>
      </TrackInfo>

      <ProgressContainer>
        <ProgressBar onClick={handleProgressClick}>
          <Progress progress={(currentTime / duration) * 100} />
        </ProgressBar>
        <TimeDisplay>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </TimeDisplay>
      </ProgressContainer>

      <Controls>
        <ControlButton onClick={toggleShuffle} active={isShuffled}>
          <FiShuffle />
        </ControlButton>
        
        <ControlButton onClick={handlePrevious}>
          <FiSkipBack />
        </ControlButton>
        
        <ControlButton onClick={togglePlayPause} className="play-pause">
          {isPlaying ? <FiPause /> : <FiPlay />}
        </ControlButton>
        
        <ControlButton onClick={handleNext}>
          <FiSkipForward />
        </ControlButton>
        
        <ControlButton 
          onClick={toggleRepeat} 
          active={repeatMode !== 'none'}
          title={`Repeat: ${repeatMode}`}
        >
          <FiRepeat />
        </ControlButton>
      </Controls>

      <VolumeContainer>
        <ControlButton onClick={toggleMute}>
          {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
        </ControlButton>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
        />
      </VolumeContainer>
    </PlayerContainer>
  );
};

export default AudioPlayer;