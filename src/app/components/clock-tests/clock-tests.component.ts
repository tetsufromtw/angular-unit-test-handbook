import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeHighlightComponent } from '../shared/code-highlight.component';

interface ClockTestCase {
  name: string;
  description: string;
  codeExample: {
    implementation: string;
    test: string;
  };
  isRunning: boolean;
  completed: boolean;
  result?: string;
}

@Component({
  selector: 'app-clock-tests',
  standalone: true,
  imports: [CommonModule, CodeHighlightComponent],
  templateUrl: './clock-tests.component.html',
  styleUrl: './clock-tests.component.scss'
})
export class ClockTestsComponent {
  protected executionLog: string[] = [];

  protected clockTestCases: ClockTestCase[] = [
    {
      name: 'jasmine.clock() の基本用法',
      description: '時間の流れを制御し、時間依存の機能をテスト',
      codeExample: {
        implementation: `// カウントダウンタイマー
class CountdownTimer {
  private timeLeft: number = 0;
  private intervalId: number | null = null;
  private callbacks: (() => void)[] = [];

  start(seconds: number): void {
    this.timeLeft = seconds;
    this.intervalId = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) {
        this.stop();
        this.callbacks.forEach(callback => callback());
      }
    }, 1000);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getTimeLeft(): number {
    return this.timeLeft;
  }

  onComplete(callback: () => void): void {
    this.callbacks.push(callback);
  }

  reset(): void {
    this.stop();
    this.timeLeft = 0;
    this.callbacks = [];
  }
}`,
        test: `describe('CountdownTimer with jasmine.clock', () => {
  let timer: CountdownTimer;

  beforeEach(() => {
    timer = new CountdownTimer();
    jasmine.clock().install();
  });

  afterEach(() => {
    timer.reset();
    jasmine.clock().uninstall();
  });

  it('should countdown from 5 seconds', () => {
    timer.start(5);
    
    expect(timer.getTimeLeft()).toBe(5);
    
    jasmine.clock().tick(1000); // 1秒推進
    expect(timer.getTimeLeft()).toBe(4);
    
    jasmine.clock().tick(2000); // 推進 2 秒
    expect(timer.getTimeLeft()).toBe(2);
    
    jasmine.clock().tick(2000); // 推進 2 秒
    expect(timer.getTimeLeft()).toBe(0);
  });

  it('should trigger callback when countdown finishes', () => {
    const completionSpy = jasmine.createSpy('onComplete');
    timer.onComplete(completionSpy);
    
    timer.start(3);
    
    jasmine.clock().tick(2999); // 幾乎到時間
    expect(completionSpy).not.toHaveBeenCalled();
    
    jasmine.clock().tick(1); // ちょうど到時間
    expect(completionSpy).toHaveBeenCalled();
  });
});`
      },
      isRunning: false,
      completed: false
    },
    {
      name: 'setTimeout と setInterval のテスト',
      description: 'タイマーベースの非同期動作をテスト',
      codeExample: {
        implementation: `// バッチプロセッサー
class BatchProcessor {
  private queue: any[] = [];
  private isProcessing = false;
  private batchSize = 3;
  private processDelay = 1000;

  addItem(item: any): void {
    this.queue.push(item);
    if (!this.isProcessing) {
      this.scheduleProcessing();
    }
  }

  private scheduleProcessing(): void {
    this.isProcessing = true;
    setTimeout(() => {
      this.processBatch();
    }, this.processDelay);
  }

  private processBatch(): void {
    const batch = this.queue.splice(0, this.batchSize);
    console.log(\`Processing batch of \${batch.length} items\`);
    
    if (this.queue.length > 0) {
      this.scheduleProcessing();
    } else {
      this.isProcessing = false;
    }
  }

  getQueueLength(): number {
    return this.queue.length;
  }

  isCurrentlyProcessing(): boolean {
    return this.isProcessing;
  }
}

// 重試機制
class RetryManager {
  async executeWithRetry<T>(
    operation: () => Promise<T>, 
    maxRetries = 3, 
    delay = 1000
  ): Promise<T> {
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        return await operation();
      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Max retries exceeded');
  }
}`,
        test: `describe('Timer-based functionality', () => {
  let processor: BatchProcessor;
  let retryManager: RetryManager;

  beforeEach(() => {
    processor = new BatchProcessor();
    retryManager = new RetryManager();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should process items in batches with delay', () => {
    spyOn(console, 'log');
    
    // 5項目を追加
    for (let i = 1; i <= 5; i++) {
      processor.addItem(\`item\${i}\`);
    }
    
    expect(processor.getQueueLength()).toBe(5);
    expect(processor.isCurrentlyProcessing()).toBe(true);
    
    // 最初のバッチ処理前
    jasmine.clock().tick(999);
    expect(console.log).not.toHaveBeenCalled();
    
    // 最初のバッチ処理（3項目）
    jasmine.clock().tick(1);
    expect(console.log).toHaveBeenCalledWith('Processing batch of 3 items');
    expect(processor.getQueueLength()).toBe(2);
    
    // 第二バッチ処理前
    jasmine.clock().tick(999);
    expect(console.log).toHaveBeenCalledTimes(1);
    
    // 第二バッチ処理（2項目）
    jasmine.clock().tick(1);
    expect(console.log).toHaveBeenCalledWith('Processing batch of 2 items');
    expect(processor.getQueueLength()).toBe(0);
    expect(processor.isCurrentlyProcessing()).toBe(false);
  });

  it('should handle retry mechanism with delays', async () => {
    let attemptCount = 0;
    const mockOperation = jasmine.createSpy('operation').and.callFake(() => {
      attemptCount++;
      if (attemptCount < 3) {
        return Promise.reject(new Error('Temporary failure'));
      }
      return Promise.resolve('success');
    });

    const promise = retryManager.executeWithRetry(mockOperation, 3, 500);
    
    // 時間推移をシミュレート
    jasmine.clock().tick(500);
    jasmine.clock().tick(500);
    
    const result = await promise;
    
    expect(result).toBe('success');
    expect(mockOperation).toHaveBeenCalledTimes(3);
  });
});`
      },
      isRunning: false,
      completed: false
    },
    {
      name: 'Date と時間関連のテスト',
      description: '特定の日付と時刻をシミュレートしてテスト',
      codeExample: {
        implementation: `// イベントスケジューラー
class EventScheduler {
  private events: ScheduledEvent[] = [];

  scheduleEvent(name: string, executeAt: Date): void {
    this.events.push({
      name,
      executeAt,
      executed: false
    });
  }

  checkAndExecuteEvents(): ScheduledEvent[] {
    const now = new Date();
    const executedEvents: ScheduledEvent[] = [];

    this.events.forEach(event => {
      if (!event.executed && event.executeAt <= now) {
        event.executed = true;
        executedEvents.push(event);
      }
    });

    return executedEvents;
  }

  getUpcomingEvents(): ScheduledEvent[] {
    const now = new Date();
    return this.events.filter(event => !event.executed && event.executeAt > now);
  }

  getPendingEventCount(): number {
    return this.getUpcomingEvents().length;
  }
}

interface ScheduledEvent {
  name: string;
  executeAt: Date;
  executed: boolean;
}

// 業務時間チェック器
class BusinessHoursChecker {
  isBusinessHours(date: Date = new Date()): boolean {
    const hour = date.getHours();
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    
    // 月曜日から金曜日、午前9時から午後6時まで
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
  }

  getNextBusinessDay(from: Date = new Date()): Date {
    const next = new Date(from);
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);
    
    while (next.getDay() === 0 || next.getDay() === 6) {
      next.setDate(next.getDate() + 1);
    }
    
    return next;
  }

  getBusinessDaysUntil(targetDate: Date, from: Date = new Date()): number {
    let count = 0;
    const current = new Date(from);
    
    while (current < targetDate) {
      if (this.isBusinessHours(current)) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return count;
  }
}`,
        test: `describe('Date and Time functionality', () => {
  let scheduler: EventScheduler;
  let businessChecker: BusinessHoursChecker;
  let mockDate: Date;

  beforeEach(() => {
    scheduler = new EventScheduler();
    businessChecker = new BusinessHoursChecker();
    
    jasmine.clock().install();
    
    // シミュレーション時間を 2024年1月15日 (月曜日) 14:00 に設定
    mockDate = new Date(2024, 0, 15, 14, 0, 0);
    jasmine.clock().mockDate(mockDate);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should execute events at scheduled time', () => {
    const futureTime = new Date(mockDate.getTime() + 3600000); // 1時間後
    
    scheduler.scheduleEvent('Meeting', futureTime);
    scheduler.scheduleEvent('Reminder', new Date(mockDate.getTime() + 1800000)); // 30分後
    
    expect(scheduler.getPendingEventCount()).toBe(2);
    
    // 30分推進
    jasmine.clock().tick(1800000);
    
    const executed = scheduler.checkAndExecuteEvents();
    expect(executed).toHaveSize(1);
    expect(executed[0].name).toBe('Reminder');
    expect(scheduler.getPendingEventCount()).toBe(1);
    
    // さらに30分推進
    jasmine.clock().tick(1800000);
    
    const executed2 = scheduler.checkAndExecuteEvents();
    expect(executed2).toHaveSize(1);
    expect(executed2[0].name).toBe('Meeting');
    expect(scheduler.getPendingEventCount()).toBe(0);
  });

  it('should check business hours correctly', () => {
    // 現在の時刻：月曜日午後2時
    expect(businessChecker.isBusinessHours()).toBe(true);
    
    // 週末をシミュレート
    const weekend = new Date(2024, 0, 13, 14, 0, 0); // 土曜日
    jasmine.clock().mockDate(weekend);
    expect(businessChecker.isBusinessHours()).toBe(false);
    
    // 退勤時間をシミュレート
    const afterHours = new Date(2024, 0, 15, 19, 0, 0); // 月曜日午後7時
    jasmine.clock().mockDate(afterHours);
    expect(businessChecker.isBusinessHours()).toBe(false);
    
    // 出勤前をシミュレート
    const beforeHours = new Date(2024, 0, 15, 8, 0, 0); // 月曜日午前8時
    jasmine.clock().mockDate(beforeHours);
    expect(businessChecker.isBusinessHours()).toBe(false);
  });

  it('should calculate next business day correctly', () => {
    // 金曜日午後から開始
    const friday = new Date(2024, 0, 19, 15, 0, 0);
    jasmine.clock().mockDate(friday);
    
    const nextBusinessDay = businessChecker.getNextBusinessDay();
    
    // 次の月曜日午前9時になるべき
    expect(nextBusinessDay.getDay()).toBe(1); // Monday
    expect(nextBusinessDay.getHours()).toBe(9);
    expect(nextBusinessDay.getDate()).toBe(22); // 1月22日
  });
});`
      },
      isRunning: false,
      completed: false
    },
    {
      name: 'アニメーションと遅延のテスト',
      description: 'アニメーション効果と時間ベースのUI変化をテスト',
      codeExample: {
        implementation: `// プログレスバーアニメーション
class ProgressBar {
  private progress = 0;
  private animationId: number | null = null;
  private onCompleteCallback?: () => void;

  animateTo(targetProgress: number, duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      const startProgress = this.progress;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progressRatio = Math.min(elapsed / duration, 1);
        
        this.progress = startProgress + (targetProgress - startProgress) * progressRatio;
        
        if (progressRatio < 1) {
          this.animationId = requestAnimationFrame(animate);
        } else {
          this.progress = targetProgress;
          this.animationId = null;
          if (targetProgress >= 100 && this.onCompleteCallback) {
            this.onCompleteCallback();
          }
          resolve();
        }
      };
      
      animate();
    });
  }

  getProgress(): number {
    return Math.round(this.progress * 100) / 100;
  }

  onComplete(callback: () => void): void {
    this.onCompleteCallback = callback;
  }

  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  reset(): void {
    this.stop();
    this.progress = 0;
  }
}

// 通知システム
class NotificationManager {
  private notifications: Notification[] = [];
  private autoHideDelay = 5000;

  show(message: string, type: 'info' | 'success' | 'error' = 'info'): string {
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now(),
      visible: true
    };

    this.notifications.push(notification);

    setTimeout(() => {
      this.hide(notification.id);
    }, this.autoHideDelay);

    return notification.id;
  }

  hide(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.visible = false;
    }
  }

  getVisibleNotifications(): Notification[] {
    return this.notifications.filter(n => n.visible);
  }

  clear(): void {
    this.notifications = [];
  }
}

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
  timestamp: number;
  visible: boolean;
}`,
        test: `describe('Animation and UI timing tests', () => {
  let progressBar: ProgressBar;
  let notificationManager: NotificationManager;

  beforeEach(() => {
    progressBar = new ProgressBar();
    notificationManager = new NotificationManager();
    jasmine.clock().install();
    
    // Mock requestAnimationFrame
    spyOn(window, 'requestAnimationFrame').and.callFake((callback: FrameRequestCallback) => {
      return setTimeout(callback, 16); // 60fps ≈ 16ms
    });
    spyOn(window, 'cancelAnimationFrame').and.callFake(clearTimeout);
  });

  afterEach(() => {
    progressBar.reset();
    notificationManager.clear();
    jasmine.clock().uninstall();
  });

  it('should animate progress bar over time', () => {
    const completionSpy = jasmine.createSpy('onComplete');
    progressBar.onComplete(completionSpy);
    
    progressBar.animateTo(50, 1000);
    
    // 初始状態
    expect(progressBar.getProgress()).toBe(0);
    
    // 250ms後は約 12.5% になるべき
    jasmine.clock().tick(250);
    expect(progressBar.getProgress()).toBeCloseTo(12.5, 1);
    
    // 500ms後は約 25% になるべき
    jasmine.clock().tick(250);
    expect(progressBar.getProgress()).toBeCloseTo(25, 1);
    
    // アニメーション完了
    jasmine.clock().tick(500);
    expect(progressBar.getProgress()).toBe(50);
    
    // 100%に達していないため、完了コールバックは呼び出されない
    expect(completionSpy).not.toHaveBeenCalled();
  });

  it('should trigger completion callback at 100%', () => {
    const completionSpy = jasmine.createSpy('onComplete');
    progressBar.onComplete(completionSpy);
    
    progressBar.animateTo(100, 500);
    
    jasmine.clock().tick(500);
    
    expect(progressBar.getProgress()).toBe(100);
    expect(completionSpy).toHaveBeenCalled();
  });

  it('should auto-hide notifications after delay', () => {
    const id1 = notificationManager.show('Info message', 'info');
    const id2 = notificationManager.show('Success message', 'success');
    
    expect(notificationManager.getVisibleNotifications()).toHaveSize(2);
    
    // 4.9秒後まだ表示されている
    jasmine.clock().tick(4900);
    expect(notificationManager.getVisibleNotifications()).toHaveSize(2);
    
    // 5秒後最初の通知が非表示
    jasmine.clock().tick(100);
    expect(notificationManager.getVisibleNotifications()).toHaveSize(1);
    expect(notificationManager.getVisibleNotifications()[0].id).toBe(id2);
    
    // 再過5秒，所有通知都隱藏
    jasmine.clock().tick(5000);
    expect(notificationManager.getVisibleNotifications()).toHaveSize(0);
  });

  it('should handle multiple simultaneous animations', () => {
    const progressBar2 = new ProgressBar();
    
    progressBar.animateTo(80, 1000);
    progressBar2.animateTo(60, 800);
    
    // 400ms後
    jasmine.clock().tick(400);
    expect(progressBar.getProgress()).toBeCloseTo(32, 1); // 80 * 0.4
    expect(progressBar2.getProgress()).toBeCloseTo(30, 1); // 60 * 0.5
    
    // 800ms後、第二プログレスバー完了
    jasmine.clock().tick(400);
    expect(progressBar.getProgress()).toBeCloseTo(64, 1); // 80 * 0.8
    expect(progressBar2.getProgress()).toBe(60);
    
    // 1000ms後、最初のプログレスバー完了
    jasmine.clock().tick(200);
    expect(progressBar.getProgress()).toBe(80);
    
    progressBar2.reset();
  });
});`
      },
      isRunning: false,
      completed: false
    }
  ];

  protected runClockTest(index: number): void {
    const testCase = this.clockTestCases[index];
    testCase.isRunning = true;
    testCase.completed = false;
    this.executionLog = [];

    this.executionLog.push(`開始実行: ${testCase.name}`);

    setTimeout(() => {
      this.executionLog.push('安裝 jasmine.clock()...');
      
      setTimeout(() => {
        this.executionLog.push('時間推移をシミュレート中...');
        
        setTimeout(() => {
          this.executionLog.push('時間関連の動作を検証中...');
          
          setTimeout(() => {
            testCase.isRunning = false;
            testCase.completed = true;
            testCase.result = '✓ テスト通過 - 時間制御が正常動作';
            this.executionLog.push('✓ テスト完了、clock をクリーンアップ');
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }

  protected runAllClockTests(): void {
    this.executionLog = ['開始実行所有時間控制テスト...'];
    
    this.clockTestCases.forEach((testCase, index) => {
      testCase.isRunning = false;
      testCase.completed = false;
      testCase.result = undefined;
      
      setTimeout(() => {
        this.runClockTest(index);
      }, index * 2500);
    });
  }

  protected createAdvancedClockExample(): string {
    return `describe('Advanced Clock Usage', () => {
  beforeEach(() => {
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should handle nested timers', () => {
    let outerExecuted = false;
    let innerExecuted = false;

    setTimeout(() => {
      outerExecuted = true;
      setTimeout(() => {
        innerExecuted = true;
      }, 500);
    }, 1000);

    jasmine.clock().tick(1000);
    expect(outerExecuted).toBe(true);
    expect(innerExecuted).toBe(false);

    jasmine.clock().tick(500);
    expect(innerExecuted).toBe(true);
  });

  it('should handle intervals with cleanup', () => {
    let count = 0;
    const intervalId = setInterval(() => {
      count++;
      if (count >= 3) {
        clearInterval(intervalId);
      }
    }, 100);

    jasmine.clock().tick(99);
    expect(count).toBe(0);

    jasmine.clock().tick(1);
    expect(count).toBe(1);

    jasmine.clock().tick(200);
    expect(count).toBe(3);

    // 確認 interval 已停止
    jasmine.clock().tick(1000);
    expect(count).toBe(3);
  });
});`;
  }

  protected createPerformanceTestExample(): string {
    return `describe('Performance Testing with Clock', () => {
  beforeEach(() => {
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should measure execution time', () => {
    const startTime = Date.now();
    
    // 時間のかかる操作をシミュレート
    for (let i = 0; i < 1000; i++) {
      // 計算処理
    }
    
    jasmine.clock().tick(100); // 100msをシミュレート
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    expect(duration).toBe(100);
  });

  it('should test debounce functionality', () => {
    let callCount = 0;
    
    const debouncedFunction = debounce(() => {
      callCount++;
    }, 300);

    // 高速連続呼び出し
    debouncedFunction();
    debouncedFunction();
    debouncedFunction();

    jasmine.clock().tick(299);
    expect(callCount).toBe(0);

    jasmine.clock().tick(1);
    expect(callCount).toBe(1);
  });

  // Debounce 実装（示例）
  function debounce(func: Function, delay: number) {
    let timeoutId: number;
    return function(...args: any[]) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }
});`;
  }
}