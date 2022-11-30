import {
  ConversationArea,
  CrosswordPuzzleArea,
  Interactable,
  ViewingArea,
} from './CoveyTownSocket';

/**
 * Test to see if an interactable is a conversation area
 */
export function isConversationArea(interactable: Interactable): interactable is ConversationArea {
  return 'occupantsByID' in interactable && !('isGameOver' in interactable);
}

/**
 * Test to see if an interactable is a viewing area
 */
export function isViewingArea(interactable: Interactable): interactable is ViewingArea {
  return 'isPlaying' in interactable;
}

export function isCrosswordPuzzleArea(
  interactable: Interactable,
): interactable is CrosswordPuzzleArea {
  return 'isGameOver' in interactable;
}
