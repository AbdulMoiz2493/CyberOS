import { useState, useRef, useEffect } from "react";
import Icon from "../Icons";

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(80);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none");
  const [currentTrack, setCurrentTrack] = useState(0);

  const playlist = [
    { title: "Midnight Dreams", artist: "Luna Wave", duration: 234, cover: "🌙" },
    { title: "Electric Sunrise", artist: "Neon Pulse", duration: 198, cover: "⚡" },
    { title: "Ocean Breeze", artist: "Coastal Vibes", duration: 267, cover: "🌊" },
    { title: "Mountain High", artist: "Peak Sound", duration: 312, cover: "🏔️" },
    { title: "City Lights", artist: "Urban Beat", duration: 189, cover: "🌃" },
    { title: "Forest Walk", artist: "Nature Sound", duration: 245, cover: "🌲" },
  ];

  const track = playlist[currentTrack];

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= track.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, track.duration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handlePrev = () => {
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      setCurrentTrack((prev) => (prev > 0 ? prev - 1 : playlist.length - 1));
      setCurrentTime(0);
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      let next;
      do {
        next = Math.floor(Math.random() * playlist.length);
      } while (next === currentTrack && playlist.length > 1);
      setCurrentTrack(next);
    } else {
      setCurrentTrack((prev) => (prev < playlist.length - 1 ? prev + 1 : 0));
    }
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(percent * track.duration);
  };

  const handleVolumeChange = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(Math.round(percent * 100));
  };

  const toggleRepeat = () => {
    const modes = ["none", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-os-surface to-os-bg">
      {/* Now Playing */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-os-primary/20 to-purple-600/20 flex items-center justify-center text-8xl mb-6 shadow-2xl">
          {track.cover}
        </div>
        <h2 className="text-2xl font-semibold text-white mb-1">{track.title}</h2>
        <p className="text-white/60">{track.artist}</p>
      </div>

      {/* Progress */}
      <div className="px-8 mb-4">
        <div
          className="h-1 bg-white/10 rounded-full cursor-pointer group"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-os-primary rounded-full relative"
            style={{ width: `${(currentTime / track.duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex justify-between mt-1 text-xs text-white/40">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(track.duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <button
          className={`p-2 rounded-full transition-colors ${
            isShuffle ? "text-os-primary" : "text-white/60 hover:text-white"
          }`}
          onClick={() => setIsShuffle(!isShuffle)}
        >
          <Icon name="Shuffle" size={20} />
        </button>
        <button
          className="p-2 rounded-full text-white/60 hover:text-white transition-colors"
          onClick={handlePrev}
        >
          <Icon name="SkipBack" size={24} />
        </button>
        <button
          className="p-4 rounded-full bg-white text-os-bg hover:scale-105 transition-transform"
          onClick={handlePlayPause}
        >
          <Icon name={isPlaying ? "Pause" : "Play"} size={28} />
        </button>
        <button
          className="p-2 rounded-full text-white/60 hover:text-white transition-colors"
          onClick={handleNext}
        >
          <Icon name="SkipForward" size={24} />
        </button>
        <button
          className={`p-2 rounded-full transition-colors ${
            repeatMode !== "none" ? "text-os-primary" : "text-white/60 hover:text-white"
          }`}
          onClick={toggleRepeat}
        >
          <Icon name="Repeat" size={20} />
          {repeatMode === "one" && (
            <span className="absolute text-[10px] font-bold">1</span>
          )}
        </button>
      </div>

      {/* Volume */}
      <div className="flex items-center justify-center gap-3 mb-6 px-8">
        <Icon
          name={volume === 0 ? "VolumeX" : "Volume2"}
          size={18}
          className="text-white/60"
        />
        <div
          className="w-32 h-1 bg-white/10 rounded-full cursor-pointer"
          onClick={handleVolumeChange}
        >
          <div
            className="h-full bg-white/60 rounded-full"
            style={{ width: `${volume}%` }}
          />
        </div>
        <span className="text-xs text-white/40 w-8">{volume}%</span>
      </div>

      {/* Playlist */}
      <div className="border-t border-white/10 max-h-48 overflow-y-auto">
        {playlist.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors ${
              index === currentTrack ? "bg-white/10" : ""
            }`}
            onClick={() => {
              setCurrentTrack(index);
              setCurrentTime(0);
              setIsPlaying(true);
            }}
          >
            <span className="text-2xl">{item.cover}</span>
            <div className="flex-1 text-left">
              <div className={`text-sm ${index === currentTrack ? "text-os-primary" : "text-white/80"}`}>
                {item.title}
              </div>
              <div className="text-xs text-white/40">{item.artist}</div>
            </div>
            <span className="text-xs text-white/40">{formatTime(item.duration)}</span>
            {index === currentTrack && isPlaying && (
              <div className="flex items-end gap-0.5 h-4">
                <div className="w-1 bg-os-primary animate-pulse" style={{ height: "60%" }} />
                <div className="w-1 bg-os-primary animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                <div className="w-1 bg-os-primary animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MusicPlayer;
