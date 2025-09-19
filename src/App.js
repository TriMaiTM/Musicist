import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import AudioPlayer from './components/AudioPlayer';
import PlaylistManager from './components/PlaylistManager';
import FileUploader from './components/FileUploader';
import ConnectionIndicator from './components/ConnectionIndicator';
import usePlaylist from './hooks/usePlaylist';
import useOnlineStatus from './hooks/useOnlineStatus';
import { FiMusic, FiMoon, FiSun } from 'react-icons/fi';

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme === 'dark' ? 
      'linear-gradient(135deg, #121212 0%, #1a1a1a 50%, #0a0a0a 100%)' : 
      'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #d1d1d1 100%)'};
    color: ${props => props.theme === 'dark' ? '#ffffff' : '#333333'};
    min-height: 100vh;
    transition: all 0.3s ease;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme === 'dark' ? '#333' : '#f1f1f1'};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme === 'dark' ? '#555' : '#c1c1c1'};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme === 'dark' ? '#666' : '#a8a8a8'};
  }
`;

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid rgba(29, 185, 84, 0.2);
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  h1 {
    background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  
  svg {
    font-size: 2.5rem;
    color: #1DB954;
  }
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ThemeToggle = styled.button`
  background: none;
  border: 2px solid #1DB954;
  color: #1DB954;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #1DB954;
    color: white;
    transform: rotate(180deg);
  }

  svg {
    font-size: 1.2rem;
  }
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const PlayerSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const PlaylistSection = styled.section`
  min-height: 500px;
`;

const Footer = styled.footer`
  text-align: center;
  padding-top: 2rem;
  margin-top: 3rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  background: #ff4444;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
`;

function App() {
  const [theme, setTheme] = useState('dark');
  const { isOnline, wasOffline } = useOnlineStatus();
  const {
    playlist,
    currentTrack,
    isLoading,
    error,
    addTracks,
    removeTrack,
    clearPlaylist,
    selectTrack
  } = usePlaylist();

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleFilesUpload = async (files) => {
    await addTracks(files);
  };

  const handleTrackChange = (track) => {
    selectTrack(track);
  };

  return (
    <>
      <GlobalStyle theme={theme} />
      <ConnectionIndicator isOnline={isOnline} wasOffline={wasOffline} />
      <AppContainer>
        {isLoading && (
          <LoadingOverlay>
            Processing audio files...
          </LoadingOverlay>
        )}

        <Header>
          <Logo>
            <FiMusic />
            <h1>Musicist</h1>
          </Logo>
          <HeaderControls>
            <ThemeToggle onClick={toggleTheme}>
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </ThemeToggle>
          </HeaderControls>
        </Header>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <MainContent>
          <PlayerSection>
            {playlist.length === 0 ? (
              <FileUploader onFilesUpload={handleFilesUpload} />
            ) : (
              <>
                <AudioPlayer
                  currentTrack={currentTrack}
                  playlist={playlist}
                  onTrackChange={handleTrackChange}
                />
                <FileUploader onFilesUpload={handleFilesUpload} />
              </>
            )}
          </PlayerSection>

          <PlaylistSection>
            <PlaylistManager
              playlist={playlist}
              currentTrack={currentTrack}
              onTrackSelect={selectTrack}
              onTrackRemove={removeTrack}
              onClearPlaylist={clearPlaylist}
            />
          </PlaylistSection>
        </MainContent>

        <Footer>
          <p>Musicist - Progressive Web App Music Player</p>
          <p>Built with React • Works offline • Stores music locally</p>
        </Footer>
      </AppContainer>
    </>
  );
}

export default App;
