// ============================================
// AUDIO AND VIDEO PLAYER - MAIN JAVASCRIPT
// This file contains all the interactive functionality
// ============================================

// ============================================
// HELPER FUNCTIONS
// Reusable functions used throughout the app
// ============================================

// Format seconds into MM:SS time display
// For example: 125 seconds becomes "2:05"
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// Save a value to browser memory (localStorage)
// This helps remember settings even after closing the page
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Could not save to browser memory:', error);
    }
}

// Get a value from browser memory (localStorage)
function getFromStorage(key, defaultValue) {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
        console.error('Could not read from browser memory:', error);
        return defaultValue;
    }
}

// ============================================
// VIDEO PLAYER SETUP
// Get all the video player elements we need to control
// ============================================

const video = document.getElementById('video-player');
const videoPlayPauseBtn = document.getElementById('video-play-pause');
const videoProgress = document.getElementById('video-progress');
const videoProgressFilled = document.getElementById('video-progress-filled');
const videoCurrentTime = document.getElementById('video-current-time');
const videoDuration = document.getElementById('video-duration');
const videoMuteBtn = document.getElementById('video-mute');
const videoVolumeSlider = document.getElementById('video-volume');
const videoSpeedSelector = document.getElementById('video-speed');
const videoFullscreenBtn = document.getElementById('video-fullscreen');
const videoLoading = document.getElementById('video-loading');

// ============================================
// VIDEO PLAYER: PLAY/PAUSE FUNCTIONALITY
// Controls whether the video is playing or paused
// ============================================

// When the play/pause button is clicked
videoPlayPauseBtn.addEventListener('click', () => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
});

// Update button icon when video starts playing
video.addEventListener('play', () => {
    videoPlayPauseBtn.querySelector('span').textContent = '⏸';
});

// Update button icon when video is paused
video.addEventListener('pause', () => {
    videoPlayPauseBtn.querySelector('span').textContent = '▶';
});

// ============================================
// VIDEO PLAYER: PROGRESS BAR
// Shows how much of the video has played
// ============================================

// Update progress bar as video plays
video.addEventListener('timeupdate', () => {
    const percentage = (video.currentTime / video.duration) * 100;
    videoProgressFilled.style.width = `${percentage}%`;
    videoCurrentTime.textContent = formatTime(video.currentTime);
});

// When user clicks on progress bar, jump to that point in the video
videoProgress.addEventListener('click', (e) => {
    const rect = videoProgress.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    video.currentTime = percentage * video.duration;
});

// Allow dragging on progress bar to scrub through video
let videoScrubbing = false;

videoProgress.addEventListener('mousedown', () => {
    videoScrubbing = true;
});

document.addEventListener('mousemove', (e) => {
    if (videoScrubbing) {
        const rect = videoProgress.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        // Keep within bounds
        clickX = Math.max(0, Math.min(clickX, rect.width));
        const percentage = clickX / rect.width;
        video.currentTime = percentage * video.duration;
    }
});

document.addEventListener('mouseup', () => {
    videoScrubbing = false;
});

// ============================================
// VIDEO PLAYER: TIME DISPLAY
// Shows current time and total duration
// ============================================

// When video metadata loads, show the total duration
video.addEventListener('loadedmetadata', () => {
    videoDuration.textContent = formatTime(video.duration);
});

// ============================================
// VIDEO PLAYER: VOLUME CONTROLS
// Controls how loud the video plays
// ============================================

// Load saved volume from browser memory, or use 100 as default
const savedVolume = getFromStorage('videoVolume', 100);
video.volume = savedVolume / 100;
videoVolumeSlider.value = savedVolume;

// When user changes volume slider
videoVolumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value;
    video.volume = volume / 100;
    saveToStorage('videoVolume', volume);

    // Update mute button icon based on volume level
    updateVolumeIcon(volume);
});

// Mute/unmute button
videoMuteBtn.addEventListener('click', () => {
    if (video.volume > 0) {
        video.dataset.previousVolume = video.volume;
        video.volume = 0;
        videoVolumeSlider.value = 0;
        updateVolumeIcon(0);
    } else {
        const previousVolume = video.dataset.previousVolume || 1;
        video.volume = previousVolume;
        videoVolumeSlider.value = previousVolume * 100;
        updateVolumeIcon(previousVolume * 100);
    }
});

// Helper function to update volume icon
function updateVolumeIcon(volume) {
    const icon = videoMuteBtn.querySelector('span');
    if (volume == 0) {
        icon.textContent = '🔇';
    } else if (volume < 50) {
        icon.textContent = '🔉';
    } else {
        icon.textContent = '🔊';
    }
}

// ============================================
// VIDEO PLAYER: PLAYBACK SPEED
// Controls how fast the video plays
// ============================================

videoSpeedSelector.addEventListener('change', (e) => {
    video.playbackRate = parseFloat(e.target.value);
});

// ============================================
// VIDEO PLAYER: FULLSCREEN
// Makes the video take up the whole screen
// ============================================

videoFullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        // Enter fullscreen mode
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        }
    } else {
        // Exit fullscreen mode
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

// ============================================
// VIDEO PLAYER: LOADING STATE
// Shows a spinner while video is loading
// ============================================

video.addEventListener('waiting', () => {
    videoLoading.classList.add('active');
});

video.addEventListener('canplay', () => {
    videoLoading.classList.remove('active');
});

// ============================================
// AUDIO PLAYER SETUP
// Get all the audio player elements
// ============================================

const audio = document.getElementById('audio-player');
const audioPlayPauseBtn = document.getElementById('audio-play-pause');
const audioProgress = document.getElementById('audio-progress');
const audioProgressFilled = document.getElementById('audio-progress-filled');
const audioCurrentTime = document.getElementById('audio-current-time');
const audioDuration = document.getElementById('audio-duration');
const audioPreviousBtn = document.getElementById('audio-previous');
const audioNextBtn = document.getElementById('audio-next');
const audioShuffleBtn = document.getElementById('audio-shuffle');
const audioRepeatBtn = document.getElementById('audio-repeat');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const albumArtImg = document.getElementById('album-art-img');
const playlistEl = document.getElementById('playlist');

// ============================================
// AUDIO PLAYER: PLAYLIST DATA
// All the songs available to play
// ============================================

const playlist = [
    {
        title: 'Sailing Away',
        artist: 'Orchestral',
        src: 'https://cdn.freecodecamp.org/curriculum/js-music-player/sailing-away.mp3',
        duration: '3:45'
    },
    {
        title: 'We Are Going to Make It',
        artist: 'Uplifting',
        src: 'https://cdn.freecodecamp.org/curriculum/js-music-player/we-are-going-to-make-it.mp3',
        duration: '3:12'
    },
    {
        title: 'Still Learning',
        artist: 'Quincy Larson',
        src: 'https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3',
        duration: '3:51'
    }
];

// ============================================
// AUDIO PLAYER: STATE MANAGEMENT
// Track current song, shuffle mode, and repeat mode
// ============================================

let currentTrackIndex = getFromStorage('currentTrackIndex', 0);
let isShuffleOn = false;
let repeatMode = 'off'; // Can be: 'off', 'all', or 'one'

// ============================================
// AUDIO PLAYER: INITIALIZE PLAYLIST
// Build the visual playlist from our data
// ============================================

function renderPlaylist() {
    playlistEl.innerHTML = '';

    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.className = 'playlist-item';
        if (index === currentTrackIndex) {
            li.classList.add('active');
        }

        li.innerHTML = `
            <div class="playlist-item-info">
                <div class="playlist-item-title">${track.title}</div>
                <div class="playlist-item-artist">${track.artist}</div>
            </div>
            <div class="playlist-item-duration">${track.duration}</div>
        `;

        // When user clicks a playlist item, play that track
        li.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            audio.play();
        });

        playlistEl.appendChild(li);
    });
}

// ============================================
// AUDIO PLAYER: LOAD A TRACK
// Set up the audio player with a specific song
// ============================================

function loadTrack(index) {
    const track = playlist[index];

    // Update the audio source
    audio.src = track.src;

    // Update track information display
    trackTitle.textContent = track.title;
    trackArtist.textContent = track.artist;

    // Update active state in playlist
    document.querySelectorAll('.playlist-item').forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Save current track to browser memory
    saveToStorage('currentTrackIndex', index);
}

// ============================================
// AUDIO PLAYER: PLAY/PAUSE FUNCTIONALITY
// ============================================

audioPlayPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

// Update button icon when audio starts playing
audio.addEventListener('play', () => {
    audioPlayPauseBtn.querySelector('span').textContent = '⏸';
});

// Update button icon when audio is paused
audio.addEventListener('pause', () => {
    audioPlayPauseBtn.querySelector('span').textContent = '▶';
});

// ============================================
// AUDIO PLAYER: PROGRESS BAR
// ============================================

// Update progress bar as audio plays
audio.addEventListener('timeupdate', () => {
    const percentage = (audio.currentTime / audio.duration) * 100;
    audioProgressFilled.style.width = `${percentage}%`;
    audioCurrentTime.textContent = formatTime(audio.currentTime);
});

// Click on progress bar to jump to that point
audioProgress.addEventListener('click', (e) => {
    const rect = audioProgress.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    audio.currentTime = percentage * audio.duration;
});

// Allow dragging on progress bar
let audioScrubbing = false;

audioProgress.addEventListener('mousedown', () => {
    audioScrubbing = true;
});

document.addEventListener('mousemove', (e) => {
    if (audioScrubbing) {
        const rect = audioProgress.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        clickX = Math.max(0, Math.min(clickX, rect.width));
        const percentage = clickX / rect.width;
        audio.currentTime = percentage * audio.duration;
    }
});

document.addEventListener('mouseup', () => {
    audioScrubbing = false;
});

// ============================================
// AUDIO PLAYER: TIME DISPLAY
// ============================================

audio.addEventListener('loadedmetadata', () => {
    audioDuration.textContent = formatTime(audio.duration);
});

// ============================================
// AUDIO PLAYER: NEXT/PREVIOUS TRACK
// Navigate through the playlist
// ============================================

// Play next track
function playNextTrack() {
    if (isShuffleOn) {
        // Pick a random track (not the current one)
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * playlist.length);
        } while (randomIndex === currentTrackIndex && playlist.length > 1);
        currentTrackIndex = randomIndex;
    } else {
        // Play next track in order
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }

    loadTrack(currentTrackIndex);
    audio.play();
}

// Play previous track
function playPreviousTrack() {
    if (audio.currentTime > 3) {
        // If more than 3 seconds into the song, restart it
        audio.currentTime = 0;
    } else {
        // Otherwise, go to actual previous track
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        audio.play();
    }
}

audioNextBtn.addEventListener('click', playNextTrack);
audioPreviousBtn.addEventListener('click', playPreviousTrack);

// ============================================
// AUDIO PLAYER: SHUFFLE MODE
// Play songs in random order
// ============================================

audioShuffleBtn.addEventListener('click', () => {
    isShuffleOn = !isShuffleOn;

    if (isShuffleOn) {
        audioShuffleBtn.classList.add('active');
    } else {
        audioShuffleBtn.classList.remove('active');
    }
});

// ============================================
// AUDIO PLAYER: REPEAT MODE
// Repeat one song or the whole playlist
// ============================================

audioRepeatBtn.addEventListener('click', () => {
    // Cycle through: off → all → one → off
    if (repeatMode === 'off') {
        repeatMode = 'all';
        audioRepeatBtn.classList.add('active');
        audioRepeatBtn.querySelector('span').textContent = '🔁';
    } else if (repeatMode === 'all') {
        repeatMode = 'one';
        audioRepeatBtn.querySelector('span').textContent = '🔂';
    } else {
        repeatMode = 'off';
        audioRepeatBtn.classList.remove('active');
        audioRepeatBtn.querySelector('span').textContent = '🔁';
    }
});

// ============================================
// AUDIO PLAYER: AUTO-PLAY NEXT TRACK
// When a song ends, play the next one (based on repeat mode)
// ============================================

audio.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        // Repeat the same song
        audio.currentTime = 0;
        audio.play();
    } else if (repeatMode === 'all' || currentTrackIndex < playlist.length - 1 || isShuffleOn) {
        // Play next track
        playNextTrack();
    }
    // If repeatMode is 'off' and we're at the last track, just stop
});

// ============================================
// KEYBOARD SHORTCUTS
// Control players with keyboard keys
// ============================================

document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
    }

    switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
            // Space or K: Play/pause the currently focused player
            e.preventDefault();
            if (!audio.paused) {
                audio.pause();
            } else if (!video.paused) {
                video.pause();
            } else {
                // If both paused, play audio
                audio.play();
            }
            break;

        case 'arrowleft':
            // Left arrow: Rewind 5 seconds
            e.preventDefault();
            if (!audio.paused) {
                audio.currentTime = Math.max(0, audio.currentTime - 5);
            } else if (!video.paused) {
                video.currentTime = Math.max(0, video.currentTime - 5);
            }
            break;

        case 'arrowright':
            // Right arrow: Fast forward 5 seconds
            e.preventDefault();
            if (!audio.paused) {
                audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
            } else if (!video.paused) {
                video.currentTime = Math.min(video.duration, video.currentTime + 5);
            }
            break;

        case 'm':
            // M: Mute/unmute video
            e.preventDefault();
            videoMuteBtn.click();
            break;

        case 'n':
            // N: Next audio track
            e.preventDefault();
            playNextTrack();
            break;

        case 'p':
            // P: Previous audio track
            e.preventDefault();
            playPreviousTrack();
            break;
    }
});

// ============================================
// INITIALIZATION
// Set everything up when the page loads
// ============================================

// Build the playlist display
renderPlaylist();

// Load the previously played track (or first track)
loadTrack(currentTrackIndex);

// Initialize volume icon
updateVolumeIcon(savedVolume);

// Log success message
console.log('Audio and Video Player initialized successfully!');
