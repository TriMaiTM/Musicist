import { useState, useEffect, useCallback } from 'react';
import audioStorage from '../utils/audioStorage';

const usePlaylist = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load playlist from IndexedDB on mount
  useEffect(() => {
    loadPlaylist();
  }, []);

  const loadPlaylist = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tracks = await audioStorage.getAllTracks();
      
      // Create proper URLs for each track
      const tracksWithUrls = await Promise.all(
        tracks.map(async (track) => {
          const url = await audioStorage.getTrackUrl(track.id);
          return { ...track, url };
        })
      );
      
      setPlaylist(tracksWithUrls);
    } catch (err) {
      console.error('Error loading playlist:', err);
      setError('Failed to load playlist');
    } finally {
      setIsLoading(false);
    }
  };

  const addTracks = async (files) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const newTracks = [];
      
      for (const file of files) {
        try {
          const trackData = await audioStorage.storeTrack(file);
          const url = await audioStorage.getTrackUrl(trackData.id);
          newTracks.push({ ...trackData, url });
          
          // Cache for offline use
          await audioStorage.cacheAudioForOffline(trackData.id);
        } catch (fileError) {
          console.error(`Error processing file ${file.name}:`, fileError);
        }
      }
      
      if (newTracks.length > 0) {
        setPlaylist(prevPlaylist => [...prevPlaylist, ...newTracks]);
        
        // Set first track as current if no track is selected
        if (!currentTrack && newTracks.length > 0) {
          setCurrentTrack(newTracks[0]);
        }
      }
      
    } catch (err) {
      console.error('Error adding tracks:', err);
      setError('Failed to add tracks');
    } finally {
      setIsLoading(false);
    }
  };

  const removeTrack = async (trackId) => {
    try {
      await audioStorage.removeTrack(trackId);
      
      setPlaylist(prevPlaylist => {
        const updatedPlaylist = prevPlaylist.filter(track => track.id !== trackId);
        
        // If removed track was current, select next track or clear
        if (currentTrack && currentTrack.id === trackId) {
          const currentIndex = prevPlaylist.findIndex(track => track.id === trackId);
          const nextTrack = updatedPlaylist[currentIndex] || updatedPlaylist[0] || null;
          setCurrentTrack(nextTrack);
        }
        
        return updatedPlaylist;
      });
      
    } catch (err) {
      console.error('Error removing track:', err);
      setError('Failed to remove track');
    }
  };

  const clearPlaylist = async () => {
    try {
      await audioStorage.clearAllTracks();
      setPlaylist([]);
      setCurrentTrack(null);
    } catch (err) {
      console.error('Error clearing playlist:', err);
      setError('Failed to clear playlist');
    }
  };

  const selectTrack = useCallback((track) => {
    setCurrentTrack(track);
  }, []);

  const getNextTrack = (shuffle = false) => {
    if (!currentTrack || playlist.length === 0) return null;
    
    if (shuffle) {
      const availableTracks = playlist.filter(track => track.id !== currentTrack.id);
      if (availableTracks.length === 0) return playlist[0];
      const randomIndex = Math.floor(Math.random() * availableTracks.length);
      return availableTracks[randomIndex];
    }
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    return playlist[nextIndex];
  };

  const getPreviousTrack = (shuffle = false) => {
    if (!currentTrack || playlist.length === 0) return null;
    
    if (shuffle) {
      const availableTracks = playlist.filter(track => track.id !== currentTrack.id);
      if (availableTracks.length === 0) return playlist[0];
      const randomIndex = Math.floor(Math.random() * availableTracks.length);
      return availableTracks[randomIndex];
    }
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const previousIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    return playlist[previousIndex];
  };

  const getStorageInfo = async () => {
    try {
      return await audioStorage.getStorageInfo();
    } catch (err) {
      console.error('Error getting storage info:', err);
      return { trackCount: 0, totalSize: 0, formattedSize: '0 Bytes' };
    }
  };

  return {
    playlist,
    currentTrack,
    isLoading,
    error,
    addTracks,
    removeTrack,
    clearPlaylist,
    selectTrack,
    getNextTrack,
    getPreviousTrack,
    getStorageInfo,
    refreshPlaylist: loadPlaylist
  };
};

export default usePlaylist;