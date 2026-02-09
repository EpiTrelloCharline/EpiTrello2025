import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

// ============ Payload Interfaces ============

export interface JoinBoardPayload {
  boardId: string;
}

export interface JoinUserPayload {
  userId: string;
}

export interface EditingPayload {
  boardId: string;
  cardId: string;
  userId: string;
  userName: string;
}

// ============ Event Data Interfaces ============

export interface CardMoveEventData {
  cardId: string;
  sourceListId: string;
  targetListId: string;
  newPosition: number;
  card: any;
  userId: string;
  timestamp: Date;
}

export interface CommentAddEventData {
  commentId: string;
  cardId: string;
  boardId: string;
  content: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: Date;
}

export interface NotificationNewEventData {
  id: string;
  type: string;
  message: string;
  boardId: string;
  entityId?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface CardEventData {
  cardId: string;
  card?: any;
  listId?: string;
  boardId: string;
  userId?: string;
  timestamp?: Date;
}

export interface ListEventData {
  listId: string;
  list?: any;
  boardId: string;
  userId?: string;
  timestamp?: Date;
}

export interface BoardEventData {
  boardId: string;
  board?: any;
  userId?: string;
  timestamp?: Date;
}

// ============ WebSocket Events Enum ============

export enum WebSocketEvents {
  // Connection events
  JOIN_BOARD = 'joinBoard',
  LEAVE_BOARD = 'leaveBoard',
  JOIN_USER_ROOM = 'joinUserRoom',
  LEAVE_USER_ROOM = 'leaveUserRoom',

  // Card events
  CARD_MOVE = 'card_move',
  CARD_CREATED = 'card_created',
  CARD_UPDATED = 'card_updated',
  CARD_DELETED = 'card_deleted',

  // Legacy card events (for backward compatibility)
  CARD_MOVED_LEGACY = 'cardMoved',
  CARD_CREATED_LEGACY = 'cardCreated',
  CARD_UPDATED_LEGACY = 'cardUpdated',
  CARD_DELETED_LEGACY = 'cardDeleted',

  // Comment events
  COMMENT_ADD = 'comment_add',
  COMMENT_UPDATED = 'comment_updated',
  COMMENT_DELETED = 'comment_deleted',

  // Legacy comment event
  COMMENT_ADDED_LEGACY = 'commentAdded',

  // Notification events
  NOTIFICATION_NEW = 'notification_new',

  // List events
  LIST_CREATED = 'list_created',
  LIST_UPDATED = 'list_updated',
  LIST_DELETED = 'list_deleted',

  // Legacy list events
  LIST_CREATED_LEGACY = 'listCreated',
  LIST_UPDATED_LEGACY = 'listUpdated',
  LIST_DELETED_LEGACY = 'listDeleted',

  // Board events
  BOARD_UPDATED = 'board_updated',
  BOARD_UPDATED_LEGACY = 'boardUpdated',

  // Activity events
  ACTIVITY_CREATED = 'activity_created',
  ACTIVITY_CREATED_LEGACY = 'activityCreated',

  // Editing events
  START_EDITING_CARD = 'startEditingCard',
  END_EDITING_CARD = 'endEditingCard',
  CARD_EDITING_STARTED = 'cardEditingStarted',
  CARD_EDITING_ENDED = 'cardEditingEnded',
}

// ============ Gateway Implementation ============

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
  transports: ['websocket', 'polling'],
})
export class WebSocketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('WebSocketsGateway');

  // Track connected clients by userId
  private userConnections = new Map<string, Set<string>>(); // userId -> Set of socketIds

  // Track which users are editing which cards
  private editingSessions = new Map<
    string,
    { userId: string; userName: string; timestamp: number }
  >();

  // Track board subscriptions
  private boardSubscriptions = new Map<string, Set<string>>(); // boardId -> Set of socketIds

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Clean up user connections
    const userId = client.data.userId;
    if (userId) {
      const userSockets = this.userConnections.get(userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.userConnections.delete(userId);
        }
      }
    }

    // Clean up board subscriptions
    const boardId = client.data.boardId;
    if (boardId) {
      const boardSockets = this.boardSubscriptions.get(boardId);
      if (boardSockets) {
        boardSockets.delete(client.id);
        if (boardSockets.size === 0) {
          this.boardSubscriptions.delete(boardId);
        }
      }
    }

    // Clean up editing sessions for this client
    this.cleanupEditingSessions(client);
  }

  private cleanupEditingSessions(client: Socket) {
    const sessionsToRemove: string[] = [];
    this.editingSessions.forEach((session, cardId) => {
      if (session.userId === client.data.userId) {
        sessionsToRemove.push(cardId);
      }
    });

    sessionsToRemove.forEach((cardId) => {
      this.editingSessions.delete(cardId);
      const boardId = client.data.boardId;
      if (boardId) {
        this.server.to(`board:${boardId}`).emit(WebSocketEvents.CARD_EDITING_ENDED, { cardId });
      }
    });
  }

  // ============ Room Management ============

  @SubscribeMessage(WebSocketEvents.JOIN_BOARD)
  handleJoinBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinBoardPayload,
  ) {
    const { boardId } = data;
    const room = `board:${boardId}`;

    client.join(room);
    client.data.boardId = boardId;

    // Track subscription
    if (!this.boardSubscriptions.has(boardId)) {
      this.boardSubscriptions.set(boardId, new Set());
    }
    this.boardSubscriptions.get(boardId)!.add(client.id);

    this.logger.log(`Client ${client.id} joined board room: ${room}`);

    return { success: true, room, event: WebSocketEvents.JOIN_BOARD };
  }

  @SubscribeMessage(WebSocketEvents.LEAVE_BOARD)
  handleLeaveBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinBoardPayload,
  ) {
    const { boardId } = data;
    const room = `board:${boardId}`;

    client.leave(room);

    // Clean up subscription
    const boardSockets = this.boardSubscriptions.get(boardId);
    if (boardSockets) {
      boardSockets.delete(client.id);
      if (boardSockets.size === 0) {
        this.boardSubscriptions.delete(boardId);
      }
    }

    this.logger.log(`Client ${client.id} left board room: ${room}`);

    return { success: true, event: WebSocketEvents.LEAVE_BOARD };
  }

  @SubscribeMessage(WebSocketEvents.JOIN_USER_ROOM)
  handleJoinUserRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinUserPayload,
  ) {
    const { userId } = data;
    const room = `user:${userId}`;

    client.join(room);
    client.data.userId = userId;

    // Track user connection
    if (!this.userConnections.has(userId)) {
      this.userConnections.set(userId, new Set());
    }
    this.userConnections.get(userId)!.add(client.id);

    this.logger.log(`Client ${client.id} joined user room: ${room}`);

    return { success: true, room, event: WebSocketEvents.JOIN_USER_ROOM };
  }

  @SubscribeMessage(WebSocketEvents.LEAVE_USER_ROOM)
  handleLeaveUserRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinUserPayload,
  ) {
    const { userId } = data;
    const room = `user:${userId}`;

    client.leave(room);

    // Clean up user connection
    const userSockets = this.userConnections.get(userId);
    if (userSockets) {
      userSockets.delete(client.id);
      if (userSockets.size === 0) {
        this.userConnections.delete(userId);
      }
    }

    this.logger.log(`Client ${client.id} left user room: ${room}`);

    return { success: true, event: WebSocketEvents.LEAVE_USER_ROOM };
  }

  // ============ Editing Management ============

  @SubscribeMessage(WebSocketEvents.START_EDITING_CARD)
  handleStartEditing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: EditingPayload,
  ) {
    const { boardId, cardId, userId, userName } = data;

    // Check if someone is already editing
    const existingSession = this.editingSessions.get(cardId);

    if (existingSession && existingSession.userId !== userId) {
      return {
        success: false,
        conflict: true,
        editor: existingSession,
      };
    }

    // Set editing session
    this.editingSessions.set(cardId, { userId, userName, timestamp: Date.now() });
    client.data.userId = userId;

    // Notify others in the board
    client.to(`board:${boardId}`).emit(WebSocketEvents.CARD_EDITING_STARTED, {
      cardId,
      userId,
      userName,
    });

    return { success: true };
  }

  @SubscribeMessage(WebSocketEvents.END_EDITING_CARD)
  handleEndEditing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: EditingPayload,
  ) {
    const { boardId, cardId, userId } = data;

    const session = this.editingSessions.get(cardId);

    if (session && session.userId === userId) {
      this.editingSessions.delete(cardId);

      // Notify others
      client.to(`board:${boardId}`).emit(WebSocketEvents.CARD_EDITING_ENDED, { cardId });

      return { success: true };
    }

    return { success: false };
  }

  // ============ Card Events ============

  /**
   * Emit card_move event to all clients in the board room
   */
  emitCardMove(boardId: string, data: CardMoveEventData) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.CARD_MOVE, data);
    // Also emit legacy event for backward compatibility
    this.server.to(room).emit(WebSocketEvents.CARD_MOVED_LEGACY, data);
    this.logger.debug(`Emitted card_move for board ${boardId}`);
  }

  emitCardCreated(boardId: string, data: CardEventData) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.CARD_CREATED, data);
    this.server.to(room).emit(WebSocketEvents.CARD_CREATED_LEGACY, data);
    this.logger.debug(`Emitted card_created for board ${boardId}`);
  }

  emitCardUpdated(boardId: string, data: CardEventData) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.CARD_UPDATED, data);
    this.server.to(room).emit(WebSocketEvents.CARD_UPDATED_LEGACY, data);
    this.logger.debug(`Emitted card_updated for board ${boardId}`);
  }

  emitCardDeleted(boardId: string, data: CardEventData) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.CARD_DELETED, data);
    this.server.to(room).emit(WebSocketEvents.CARD_DELETED_LEGACY, data);
    this.logger.debug(`Emitted card_deleted for board ${boardId}`);
  }

  // ============ Comment Events ============

  /**
   * Emit comment_add event to all clients in the board room
   */
  emitCommentAdd(boardId: string, data: CommentAddEventData) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.COMMENT_ADD, data);
    // Also emit legacy event for backward compatibility
    this.server.to(room).emit(WebSocketEvents.COMMENT_ADDED_LEGACY, data);
    this.logger.debug(`Emitted comment_add for board ${boardId}`);
  }

  emitCommentUpdated(boardId: string, data: any) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.COMMENT_UPDATED, data);
    this.logger.debug(`Emitted comment_updated for board ${boardId}`);
  }

  emitCommentDeleted(boardId: string, data: any) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.COMMENT_DELETED, data);
    this.logger.debug(`Emitted comment_deleted for board ${boardId}`);
  }

  // ============ Notification Events ============

  /**
   * Emit notification_new event to a specific user
   */
  emitNotificationNew(userId: string, data: NotificationNewEventData) {
    const room = `user:${userId}`;
    this.server.to(room).emit(WebSocketEvents.NOTIFICATION_NEW, data);
    this.logger.debug(`Emitted notification_new to user ${userId}`);
  }

  /**
   * Emit notification_new event to multiple users
   */
  emitNotificationNewToUsers(userIds: string[], data: NotificationNewEventData) {
    userIds.forEach((userId) => {
      this.emitNotificationNew(userId, data);
    });
  }

  /**
   * Emit notification to all board members
   */
  emitNotificationToBoard(boardId: string, data: NotificationNewEventData) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.NOTIFICATION_NEW, data);
    this.logger.debug(`Emitted notification_new to board ${boardId}`);
  }

  // ============ List Events ============

  emitListCreated(boardId: string, data: ListEventData) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.LIST_CREATED, data);
    this.server.to(room).emit(WebSocketEvents.LIST_CREATED_LEGACY, data);
    this.logger.debug(`Emitted list_created for board ${boardId}`);
  }

  emitListUpdated(boardId: string, data: ListEventData) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.LIST_UPDATED, data);
    this.server.to(room).emit(WebSocketEvents.LIST_UPDATED_LEGACY, data);
    this.logger.debug(`Emitted list_updated for board ${boardId}`);
  }

  emitListDeleted(boardId: string, data: ListEventData) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.LIST_DELETED, data);
    this.server.to(room).emit(WebSocketEvents.LIST_DELETED_LEGACY, data);
    this.logger.debug(`Emitted list_deleted for board ${boardId}`);
  }

  // ============ Board Events ============

  emitBoardUpdated(boardId: string, data: BoardEventData) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.BOARD_UPDATED, data);
    this.server.to(room).emit(WebSocketEvents.BOARD_UPDATED_LEGACY, data);
    this.logger.debug(`Emitted board_updated for board ${boardId}`);
  }

  // ============ Activity Events ============

  emitActivityCreated(boardId: string, data: any) {
    const room = `board:${boardId}`;
    this.server.to(room).emit(WebSocketEvents.ACTIVITY_CREATED, data);
    this.server.to(room).emit(WebSocketEvents.ACTIVITY_CREATED_LEGACY, data);
    this.logger.debug(`Emitted activity_created for board ${boardId}`);
  }

  // ============ Utility Methods ============

  /**
   * Get connected users count for a board
   */
  getBoardConnectionsCount(boardId: string): number {
    return this.boardSubscriptions.get(boardId)?.size || 0;
  }

  /**
   * Check if a user is connected
   */
  isUserConnected(userId: string): boolean {
    const sockets = this.userConnections.get(userId);
    return sockets !== undefined && sockets.size > 0;
  }

  /**
   * Get all connected socket IDs for a user
   */
  getUserSocketIds(userId: string): string[] {
    return Array.from(this.userConnections.get(userId) || []);
  }
}
