import React, { useState, useEffect, useRef } from "react";
import "./AudioPlayer.css";

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef(null);

  useEffect(() => {
    const storedPlaylist = JSON.parse(localStorage.getItem("playlist")) || [];
    setPlaylist(storedPlaylist);

    const lastAudio = localStorage.getItem("lastAudio");
    if (lastAudio) {
      setCurrentAudio(lastAudio);
      const lastTime = parseFloat(localStorage.getItem("lastTime")) || 0;
      setCurrentTime(lastTime);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("playlist", JSON.stringify(playlist));
    if (playlist.length == 1) {
      setCurrentAudio(playlist[0].blob);
    }
  }, [playlist]);

  useEffect(() => {
    if (currentAudio) {
      localStorage.setItem("lastAudio", currentAudio);
      localStorage.setItem("lastTime", currentTime.toString());
    }
  }, [currentAudio, currentTime]);

  const handleAudioChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setPlaylist([
        ...playlist,
        {
          blob: URL.createObjectURL(file),
          name: file.name,
        },
      ]);
    }
  };

  const handleAudioPlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleAudioEnded = () => {

    const currentIndex = playlist.findIndex(
      (item) => item.blob == currentAudio.toString()
    );
    
    // const currentIndex = playlist.indexOf(currentAudio);
    const nextIndex = (currentIndex + 1) % playlist.length;    

    setCurrentAudio(playlist[nextIndex].blob);
    setCurrentTime(0);
  };


  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  

  return (
    <div className="audio-player-container">
      <h1>React Audio Player</h1>
      <input type="file" accept="audio/*" onChange={handleAudioChange} />
      <br />

      {playlist.length > 0 && (
        <div className="playlist-container">
          <h2>Playlist</h2>
          <ul className="playlist">
            {playlist.map((audio, index) => (
              <li key={index}>
                <button
                  className={audio.blob === currentAudio ? "active" : ""}
                  onClick={() => setCurrentAudio(audio.blob)}
                >
                  {audio.blob === currentAudio ? "Now Playing: " : ""}
                  {audio.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentAudio && (
        <div className="now-playing-container">
          <h2>Now Playing</h2>
          <audio
            ref={audioRef}
            controls
            autoPlay
            src={currentAudio}
            onPlay={handleAudioPlay}
            onEnded={handleAudioEnded}
            onTimeUpdate={handleTimeUpdate}
          />
          <p>Current Time: {currentTime.toFixed(2)} seconds</p>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
