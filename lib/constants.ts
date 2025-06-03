export const POMODORO_CONSTANTS = {
  WORK_DURATION: 25 * 60,
  BREAK_DURATION: 5 * 60,
  FULLSCREEN_DELAY: 1000,
  CONTROLS_HIDE_DELAY: 3000,
  CLOCK_UPDATE_INTERVAL: 1000,
} as const;

export const ANIMATION_CONSTANTS = {
  PARTICLE_COUNT: 20,
  TIME_ANIMATION_DURATION: 25,
  DATE_ANIMATION_DURATION: 30,
  TIME_ANIMATION_DELAY_MULTIPLIER: 0.2,
  DATE_ANIMATION_DELAY_MULTIPLIER: 0.15,
  PARTICLE_BASE_DURATION: 20,
  PARTICLE_RANDOM_DURATION: 20,
  PARTICLE_DELAY_MULTIPLIER: 1.5,
} as const;

export const CORNER_INDICATORS = [
  { position: 'top-8 left-8', delay: '0s' },
  { position: 'top-8 right-8', delay: '1s' },
  { position: 'bottom-8 left-8', delay: '2s' },
  { position: 'bottom-8 right-8', delay: '3s' },
] as const;
