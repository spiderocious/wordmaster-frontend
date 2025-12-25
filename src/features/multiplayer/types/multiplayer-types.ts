/**
 * Multiplayer Types
 *
 * Type definitions for multiplayer game functionality
 */

export const GamePhase = {
  WAITING: 'waiting',
  STARTING: 'starting',
  PLAYING: 'playing',
  ROUND_END: 'round_end',
  FINISHED: 'finished',
} as const;

export type GamePhaseType = typeof GamePhase[keyof typeof GamePhase];

export const PlayerRole = {
  HOST: 'host',
  PLAYER: 'player',
} as const;

export type PlayerRoleType = typeof PlayerRole[keyof typeof PlayerRole];

export const PlayerStatus = {
  ACTIVE: 'active',
  DISCONNECTED: 'disconnected',
  LEFT: 'left',
} as const;

export type PlayerStatusType = typeof PlayerStatus[keyof typeof PlayerStatus];

export const WSMessageType = {
  // Room events
  ROOM_CREATE: 'room:create',
  ROOM_CREATED: 'room:created',
  ROOM_JOIN: 'room:join',
  ROOM_JOINED: 'room:joined',
  ROOM_LEAVE: 'room:leave',
  ROOM_LEFT: 'room:left',
  PLAYER_JOINED: 'player:joined',
  PLAYER_LEFT: 'player:left',

  // Game events
  GAME_START: 'game:start',
  GAME_START_SUCCESS: 'game:start:success',
  GAME_STARTED: 'game:started',

  // Round events
  ROUND_RESULTS: 'round:results',
  ROUND_RESULTS_SUCCESS: 'round:results:success',
  ROUND_NEXT: 'round:next',
  ROUND_NEXT_SUCCESS: 'round:next:success',
  ROUND_STARTED: 'round:started',
  ROUND_ENDED: 'round:ended',

  // Answer events
  ANSWER_SUBMIT: 'answer:submit',
  ANSWER_SUBMIT_SUCCESS: 'answer:submit:success',
  ANSWER_SUBMITTED: 'answer:submitted',

  // Summary events
  GAME_SUMMARY: 'game:summary',
  GAME_SUMMARY_SUCCESS: 'game:summary:success',

  // Chat events
  CHAT_MESSAGE: 'chat:message',
  MESSAGE_SENT: 'message:sent',

  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',

  // Error event
  ERROR: 'error',
} as const;

export type WSMessageTypeValue = typeof WSMessageType[keyof typeof WSMessageType];

export interface Player {
  userId: string | null;
  username: string;
  avatar: string;
  role: PlayerRoleType;
  status: PlayerStatusType;
  currentScore: number;
  isGuest: boolean;
}

export interface GameConfig {
  roundsCount: number;
  supportedCategories: string[];
  excludedLetters: string[];
}

export interface ChatMessage {
  messageId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

export interface Room {
  roomId: string;
  joinCode: string;
  hostId: string;
  phase: GamePhaseType;
  players: Player[];
  config: GameConfig;
  chatMessages: ChatMessage[];
  currentRound?: number;
  totalRounds?: number;
}

export interface RoomCreatePayload {
  username: string;
  avatar: string;
  config: GameConfig;
}

export interface RoomJoinPayload {
  joinCode: string;
  username: string;
  avatar: string;
}

export interface RoomLeavePayload {
  roomId: string;
  username: string;
}

export interface GameStartPayload {
  roomId: string;
  username: string;
}

export interface AnswerSubmitPayload {
  roomId: string;
  username: string;
  answers: {
    category: string;
    word: string;
    timeLeft: number;
  }[];
}

export interface RoundResultsPayload {
  roomId: string;
  username: string;
}

export interface RoundNextPayload {
  roomId: string;
  username: string;
}

export interface GameSummaryPayload {
  roomId: string;
  username: string;
}

export interface ChatMessagePayload {
  roomId: string;
  username: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
}

export interface RoomCreatedResponse {
  success: true;
  data: Room;
}

export interface RoomJoinedResponse {
  success: true;
  data: Room;
}

export interface PlayerJoinedBroadcast {
  username: string;
  avatar: string;
  role: PlayerRoleType;
}

export interface PlayerLeftBroadcast {
  username: string;
  newHostId?: string;
}

export interface GameStartedBroadcast {
  phase: GamePhaseType;
  currentRound: number;
  totalRounds: number;
  letter: string;
  categories: string[];
  timeLimit: number;
}

export interface AnswerSubmittedBroadcast {
  username: string;
  submittedCount: number;
  totalPlayers: number;
}

export interface RoundEndedBroadcast {
  phase: GamePhaseType;
}

export interface RoundStartedBroadcast {
  phase: GamePhaseType;
  currentRound: number;
  totalRounds: number;
  letter: string;
  categories: string[];
  timeLimit: number;
}
