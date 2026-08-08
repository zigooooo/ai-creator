import { WorkflowState, SystemEvent } from '../types/index.js';
import { db } from '../db/database.js';

export type EventCallback = (event: SystemEvent) => void;

export class AutonomyStateMachine {
  private currentState: WorkflowState = 'DISCOVERED';
  private missionId: string = `mission-${Date.now()}`;
  private listeners: EventCallback[] = [];

  public getState(): WorkflowState {
    return this.currentState;
  }

  public getMissionId(): string {
    return this.missionId;
  }

  public subscribe(callback: EventCallback) {
    this.listeners.push(callback);
  }

  public transition(nextState: WorkflowState, agentName?: string, payload: Record<string, any> = {}) {
    const previousState = this.currentState;
    this.currentState = nextState;

    const event: SystemEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      eventType: `STATE_TRANSITION:${nextState}`,
      agentName,
      workflowState: nextState,
      missionId: this.missionId,
      payload: { previousState, nextState, ...payload },
      timestamp: new Date().toISOString()
    };

    db.systemEvents.push(event);
    this.listeners.forEach(fn => fn(event));
    return event;
  }

  public resetMission(newQuestion?: string) {
    this.missionId = `mission-${Date.now()}`;
    this.currentState = 'DISCOVERED';
    this.transition('DISCOVERED', 'Curiosity Agent', { newQuestion });
  }
}

export const stateMachine = new AutonomyStateMachine();
