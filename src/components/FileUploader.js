import React, { useRef } from 'react';
import styled from 'styled-components';
import { FiUpload } from 'react-icons/fi';

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border: 2px dashed #1DB954;
  border-radius: 12px;
  background: rgba(29, 185, 84, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(29, 185, 84, 0.2);
    border-color: #1ed760;
  }

  &.dragover {
    background: rgba(29, 185, 84, 0.3);
    border-color: #1ed760;
    transform: scale(1.02);
  }
`;

const UploadIcon = styled(FiUpload)`
  font-size: 3rem;
  color: #1DB954;
  margin-bottom: 0.5rem;
`;

const UploadText = styled.div`
  text-align: center;
  color: #ffffff;

  h3 {
    margin: 0 0 0.5rem 0;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #b3b3b3;
    font-size: 0.9rem;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  background: #1DB954;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1ed760;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const FileUploader = ({ onFilesUpload, accept = "audio/*" }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const audioFiles = Array.from(files).filter(file => 
      file.type.startsWith('audio/') || 
      file.name.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/i)
    );
    
    if (audioFiles.length > 0) {
      onFilesUpload(audioFiles);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = e.currentTarget;
    container.classList.remove('dragover');
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('dragover');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <UploadContainer
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      <UploadIcon />
      <UploadText>
        <h3>Upload Your Music</h3>
        <p>Drag & drop audio files here or click to browse</p>
        <p>Supports MP3, WAV, OGG, M4A, FLAC</p>
      </UploadText>
      
      <UploadButton type="button">
        Choose Files
      </UploadButton>
      
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={handleInputChange}
      />
    </UploadContainer>
  );
};

export default FileUploader;