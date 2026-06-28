import * as Haptics from 'expo-haptics';

export const haptic = {
  // Light tap — use for normal button presses
  tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

  // Medium tap — use for important actions (hire, build, accept funding)
  action: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

  // Success buzz — use when something good happens (feature completed, win)
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

  // Warning buzz — use for bad events or warnings
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),

  // Error buzz — use for game over / bankruptcy
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};