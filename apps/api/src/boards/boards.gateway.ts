import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface JoinBoardPayload {
  boardId: string;
}

interface EditingPayload {
  boardId: string;
  cardId: string;
  userId: string;
  userName: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class BoardsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('BoardsGateway');
  
  // Track which users are editing which cards
  private editingSessions = new Map<string, { userId: string; userName: string; timestamp: number }>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    
    // Clean up editing sessions for this client
    const sessionsToRemove: string[] = [];
    this.editingSessions.forEach((session, cardId) => {
      if (session.userId === client.data.userId) {
        sessionsToRemove.push(cardId);
      }
    });
    
    sessionsToRemove.forEach(cardId => {
      this.editingSessions.delete(cardId);
      const boardId = client.data.boardId;
      if (boardId) {
        this.server.to(`board:${boardId}`).emit('cardEditingEnded', { cardId });
      }
    });
  }

  @SubscribeMessage('joinBoard')
  handleJoinBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinBoardPayload,
  ) {
    const { boardId } = data;
    const room = `board:${boardId}`;
    
    client.join(room);
    client.data.boardId = boardId;
    
    this.logger.log(`Client ${client.id} joined board ${boardId}`);
    
    return { success: true, room };
  }

  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: JoinBoardPayload,
  ) {
    const { boardId } = data;
    const room = `board:${boardId}`;
    
    client.leave(room);
    
    this.logger.log(`Client ${client.id} left board ${boardId}`);
    
    return { success: true };
  }

  @SubscribeMessage('startEditingCard')
  handleStartEditing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: EditingPayload,
  ) {
    const { boardId, cardId, userId, userName } = data;
    
    // Check if someone is already editing
    const existingSession = this.editingSessions.get(cardId);
    
    if (existingSession && existingSession.userId !== userId) {
      // Someone else is editing, send conflict warning
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
    client.to(`board:${boardId}`).emit('cardEditingStarted', {
      cardId,
      userId,
      userName,
    });
    
    return { success: true };
  }

  @SubscribeMessage('endEditingCard')
  handleEndEditing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: EditingPayload,
  ) {
    const { boardId, cardId, userId } = data;
    
    const session = this.editingSessions.get(cardId);
    
    if (session && session.userId === userId) {
      this.editingSessions.delete(cardId);
      
      // Notify others
      client.to(`board:${boardId}`).emit('cardEditingEnded', { cardId });
      
      return { success: true };
    }
    
    return { success: false };
  }

  // Methods to emit events from services
  emitCardMoved(boardId: string, data: any) {
    this.server.to(`board:${boardId}`).emit('cardMoved', data);
  }

  emitCardUpdated(boardId: string, data: any) {
    this.server.to(`board:${boardId}`).emit('cardUpdated', data);
  }

  emitCardCreated(boardId: string, data: any) {
    this.server.to(`board:${boardId}`).emit('cardCreated', data);
  }

  emitCardDeleted(boardId: string, data: any) {
    this.server.to(`board:${boardId}`).emit('cardDeleted', data);
  }

  emitListCreated(boardId: string, data: any) {
    this.server.to(`board:${boardId}`).emit('listCreated', data);
  }

  emitListUpdated(boardId: string, data: any) {
    this.server.to(`board:${boardId}`).emit('listUpdated', data);
  }

  emitListDeleted(boardId: string, data: any) {
    this.server.to(`board:${boardId}`).emit('listDeleted', data);
  }

  emitCommentAdded(boardId: string, data: any) {
    this.server.to(`board:${boardId}`).emit('commentAdded', data);
  }

  emitActivityCreated(boardId: string, data: any) {
    this.server.to(`board:${boardId}`).emit('activityCreated', data);
  }

  emitBoardUpdated(boardId: string, data: any) {
    this.server.to(`board:${boardId}`).emit('boardUpdated', data);
  }
}
