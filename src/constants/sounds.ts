import { Audio } from 'expo-av';

const soundFiles: Record<string, any> = {
  click: require('../../assets/sounds/click.mp3'),
  success: require('../../assets/sounds/success.mp3'),
  notification: require('../../assets/sounds/notification.mp3'),
  cash: require('../../assets/sounds/cash.mp3'),
};

const loadedSounds: Record<string, Audio.Sound> = {};
let soundEnabled = true;

// Call this once when the app starts
export async function preloadSounds() {
  for (const key of Object.keys(soundFiles)) {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFiles[key]);
      loadedSounds[key] = sound;
    } catch (e) {
      console.log(`Failed to load sound: ${key}`);
    }
  }
}

// Play a sound by name — e.g. playSound('click')
export async function playSound(name: keyof typeof soundFiles) {
  if (!soundEnabled) return;
  try {
    const sound = loadedSounds[name];
    if (sound) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    }
  } catch (e) {
    // fail silently — sound is non-critical
  }
}

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}