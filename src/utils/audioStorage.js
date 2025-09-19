// IndexedDB utility for storing audio files and metadata
class AudioStorage {
  constructor() {
    this.dbName = 'MusicistDB';
    this.version = 1;
    this.db = null;
    this.isSupported = this.checkSupport();
  }

  // Check if IndexedDB is supported
  checkSupport() {
    if (typeof window === 'undefined') return false;
    
    try {
      return !!(window.indexedDB || 
                window.webkitIndexedDB || 
                window.mozIndexedDB || 
                window.msIndexedDB);
    } catch (e) {
      console.warn('IndexedDB not supported:', e);
      return false;
    }
  }

  // Initialize IndexedDB
  async init() {
    if (!this.isSupported) {
      throw new Error('IndexedDB is not supported in this browser');
    }

    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open(this.dbName, this.version);
        
        request.onerror = () => reject(new Error(`IndexedDB error: ${request.error}`));
        request.onsuccess = () => {
          this.db = request.result;
          resolve(this.db);
        };
        
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          
          // Create object stores
          if (!db.objectStoreNames.contains('tracks')) {
            const trackStore = db.createObjectStore('tracks', { keyPath: 'id' });
            trackStore.createIndex('name', 'name', { unique: false });
            trackStore.createIndex('artist', 'artist', { unique: false });
            trackStore.createIndex('dateAdded', 'dateAdded', { unique: false });
          }
          
          if (!db.objectStoreNames.contains('audioFiles')) {
            db.createObjectStore('audioFiles', { keyPath: 'id' });
          }
        };
      } catch (error) {
        reject(new Error(`Failed to open IndexedDB: ${error.message}`));
      }
    });
  }

  // Store audio file and metadata
  async storeTrack(file) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      try {
        const id = this.generateId();
        const reader = new FileReader();
        
        reader.onload = async (e) => {
          const audioBlob = e.target.result;
          const url = URL.createObjectURL(new Blob([audioBlob]));
          
          // Extract metadata
          const metadata = await this.extractMetadata(file, url);
          
          const trackData = {
            id,
            name: this.getTrackName(file.name),
            originalName: file.name,
            size: file.size,
            type: file.type,
            dateAdded: new Date().toISOString(),
            url,
            ...metadata
          };
          
          const transaction = this.db.transaction(['tracks', 'audioFiles'], 'readwrite');
          
          // Store metadata
          const trackStore = transaction.objectStore('tracks');
          trackStore.add(trackData);
          
          // Store audio file
          const fileStore = transaction.objectStore('audioFiles');
          fileStore.add({ id, data: audioBlob });
          
          transaction.oncomplete = () => resolve(trackData);
          transaction.onerror = () => reject(transaction.error);
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
        
      } catch (error) {
        reject(error);
      }
    });
  }

  // Extract audio metadata
  async extractMetadata(file, url) {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      
      const metadata = {
        duration: 0,
        artist: '',
        album: '',
        title: ''
      };
      
      audio.onloadedmetadata = () => {
        metadata.duration = audio.duration;
        resolve(metadata);
      };
      
      audio.onerror = () => resolve(metadata);
      
      // Timeout fallback
      setTimeout(() => resolve(metadata), 3000);
    });
  }

  // Get all tracks
  async getAllTracks() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tracks'], 'readonly');
      const store = transaction.objectStore('tracks');
      const request = store.getAll();
      
      request.onsuccess = () => {
        const tracks = request.result.map(track => ({
          ...track,
          url: this.getTrackUrl(track.id)
        }));
        resolve(tracks);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Get track URL from stored data
  getTrackUrl(trackId) {
    if (!this.db) return null;
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['audioFiles'], 'readonly');
      const store = transaction.objectStore('audioFiles');
      const request = store.get(trackId);
      
      request.onsuccess = () => {
        if (request.result) {
          const blob = new Blob([request.result.data]);
          const url = URL.createObjectURL(blob);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Remove track
  async removeTrack(trackId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tracks', 'audioFiles'], 'readwrite');
      
      const trackStore = transaction.objectStore('tracks');
      trackStore.delete(trackId);
      
      const fileStore = transaction.objectStore('audioFiles');
      fileStore.delete(trackId);
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Clear all tracks
  async clearAllTracks() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['tracks', 'audioFiles'], 'readwrite');
      
      const trackStore = transaction.objectStore('tracks');
      trackStore.clear();
      
      const fileStore = transaction.objectStore('audioFiles');
      fileStore.clear();
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Get storage info
  async getStorageInfo() {
    if (!this.db) await this.init();
    
    const tracks = await this.getAllTracks();
    const totalSize = tracks.reduce((sum, track) => sum + track.size, 0);
    
    return {
      trackCount: tracks.length,
      totalSize,
      formattedSize: this.formatBytes(totalSize)
    };
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getTrackName(filename) {
    return filename.replace(/\.[^/.]+$/, ''); // Remove extension
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Cache audio for service worker
  async cacheAudioForOffline(trackId) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        const audioData = await this.getAudioData(trackId);
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_AUDIO',
          audioData,
          filename: trackId
        });
      } catch (error) {
        console.error('Failed to cache audio for offline:', error);
      }
    }
  }

  async getAudioData(trackId) {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['audioFiles'], 'readonly');
      const store = transaction.objectStore('audioFiles');
      const request = store.get(trackId);
      
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.data);
        } else {
          reject(new Error('Track not found'));
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
}

// Create singleton instance
const audioStorage = new AudioStorage();

export default audioStorage;