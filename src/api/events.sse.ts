import { Response } from 'express';
import { stateMachine } from '../orchestrator/state-machine.js';
import { SystemEvent } from '../types/index.js';

class SSEManager {
  private clients: Response[] = [];

  constructor() {
    stateMachine.subscribe((event: SystemEvent) => {
      this.broadcast(event);
    });
  }

  public addClient(res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    this.clients.push(res);

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ eventType: 'CONNECTED', message: 'SSE Event Stream Active' })}\n\n`);

    res.on('close', () => {
      this.clients = this.clients.filter(client => client !== res);
    });
  }

  public broadcast(event: SystemEvent) {
    const data = `data: ${JSON.stringify(event)}\n\n`;
    this.clients.forEach(res => res.write(data));
  }
}

export const sseManager = new SSEManager();
