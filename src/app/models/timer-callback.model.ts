export interface TimerCallback {
  id: number;
  callback: () => void;
  delay: number;
  type: 'timeout' | 'interval';
  isActive: boolean;
  createdAt: Date;
  executedAt?: Date;
}

export interface ClockState {
  currentTime: number;
  baseTime: Date;
  isInstalled: boolean;
  callbacks: TimerCallback[];
  tickCount: number;
}

export interface AsyncTestOptions {
  timeout?: number;
  interval?: number;
  expectedCalls?: number;
}