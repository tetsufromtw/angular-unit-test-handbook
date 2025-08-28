import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeHighlightComponent } from '../shared/code-highlight.component';

interface AsyncTestCase {
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
  selector: 'app-async-tests',
  standalone: true,
  imports: [CommonModule, CodeHighlightComponent],
  templateUrl: './async-tests.component.html',
  styleUrl: './async-tests.component.scss'
})
export class AsyncTestsComponent {
  protected asyncTestCases: AsyncTestCase[] = [
    {
      name: 'async/await 基本テスト',
      description: 'async/await を使用して Promise を処理する非同期テスト',
      codeExample: {
        implementation: `// 非同期データサービス
class DataService {
    private value: number = 0;
    
    async initialize(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.value = 0;
                resolve();
            }, 10);
        });
    }
    
    async fetchData(): Promise<number> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.value++;
                resolve(this.value);
            }, 50);
        });
    }
    
    getValue(): number {
        return this.value;
    }
    
    async processData(data: number): Promise<boolean> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data > 0);
            }, 20);
        });
    }
}`,
        test: `// async/await テスト
describe("Using async/await", function () {
    let dataService;

    beforeEach(async function () {
        dataService = new DataService();
        await dataService.initialize();  // 初期化を待つ
    });

    it("supports async execution", async function () {
        const data = await dataService.fetchData();
        const isValid = await dataService.processData(data);
        
        expect(data).toBeGreaterThan(0);
        expect(isValid).toBe(true);
    });

    it("handles multiple async operations", async function () {
        await dataService.fetchData();
        await dataService.fetchData();
        
        expect(dataService.getValue()).toBe(2);
    });
});`
      },
      isRunning: false,
      completed: false
    },
    {
      name: '長時間非同期テスト',
      description: '実行に時間がかかる非同期操作を処理する',
      codeExample: {
        implementation: `// 大規模データ処理サービス
class BigDataProcessor {
    private data: number[] = [];
    
    async loadLargeDataset(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.data = Array.from({ length: 1000 }, (_, i) => i);
                resolve();
            }, 800);  // 大規模データの読み込みをシミュレート
        });
    }
    
    async processLargeDataset(): Promise<number> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const sum = this.data.reduce((acc, val) => acc + val, 0);
                resolve(sum);
            }, 2000);  // 複雑な計算をシミュレート
        });
    }
    
    async cleanupResources(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.data = [];
                resolve();
            }, 500);  // リソースのクリーンアップ
        });
    }
    
    getDataSize(): number {
        return this.data.length;
    }
}`,
        test: `// 長時間非同期テスト
describe("long asynchronous specs", function() {
    let processor;
    
    beforeEach(async function() {
        processor = new BigDataProcessor();
        await processor.loadLargeDataset();
    }, 1500);  // 1.5秒のタイムアウト

    it("processes large dataset", async function() {
        const result = await processor.processLargeDataset();
        
        expect(processor.getDataSize()).toBe(1000);
        expect(result).toBe(499500);  // 0+1+2+...+999
    }, 3000);  // 3秒のタイムアウト

    afterEach(async function() {
        await processor.cleanupResources();
        expect(processor.getDataSize()).toBe(0);
    }, 1000);
});`
      },
      isRunning: false,
      completed: false
    }
  ];

  protected executionLog: string[] = [];

  protected async runAsyncTest(testIndex: number): Promise<void> {
    const testCase = this.asyncTestCases[testIndex];
    testCase.isRunning = true;
    testCase.completed = false;
    this.executionLog = [];

    try {
      if (testIndex === 0) {
        await this.simulateBasicAsyncTest();
        testCase.result = '✓ 異步テスト成功完了';
      } else if (testIndex === 1) {
        await this.simulateLongAsyncTest();
        testCase.result = '✓ 長時間異步テスト成功完了';
      }
      
      testCase.completed = true;
    } catch (error) {
      testCase.result = `✗ テスト失敗: ${error}`;
    } finally {
      testCase.isRunning = false;
    }
  }

  private async simulateBasicAsyncTest(): Promise<void> {
    this.executionLog.push('開始実行 beforeEach...');
    
    // soon() 関数をシミュレート
    await this.soon();
    this.executionLog.push('beforeEach: soon() 完了、value = 0 に設定');
    
    this.executionLog.push('開始実行テスト...');
    await this.soon();
    this.executionLog.push('テスト中: soon() を再度呼び出し');
    
    const value = 1; // value++ をシミュレート
    this.executionLog.push(`テスト中: value = ${value}`);
    
    if (value > 0) {
      this.executionLog.push('✓ expect(value).toBeGreaterThan(0) 通過');
    } else {
      throw new Error('expect(value).toBeGreaterThan(0) 失敗');
    }
  }

  private async simulateLongAsyncTest(): Promise<void> {
    this.executionLog.push('開始実行長時間異步テスト...');
    
    this.executionLog.push('実行 beforeEach (超時: 1000ms)');
    await this.somethingSlow();
    this.executionLog.push('beforeEach 完了');
    
    this.executionLog.push('実行主要テスト (超時: 10000ms)');
    await this.somethingReallySlow();
    this.executionLog.push('主要テスト完了');
    
    this.executionLog.push('実行 afterEach (超時: 1000ms)');
    await this.somethingSlow();
    this.executionLog.push('afterEach 完了');
  }

  private soon(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }

  private somethingSlow(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  private somethingReallySlow(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }

  protected async runAllAsyncTests(): Promise<void> {
    for (let i = 0; i < this.asyncTestCases.length; i++) {
      await this.runAsyncTest(i);
      // 在テストの間添加短暫延遲
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  protected createTimeoutExample(): string {
    return `// テストのタイムアウト時間を設定
describe("テストタイムアウト設定", function() {
    it("短時間タイムアウトテスト", async function() {
        await fastOperation();
    }, 500);  // 500ms 超時

    it("長時間タイムアウトテスト", async function() {
        await slowOperation();
    }, 5000);  // 5秒超時
});`;
  }

  protected createPromiseExample(): string {
    return `// Promise チェーン呼び出しテスト
describe("Promise テスト", function() {
    it("should handle promise chains", function() {
        return getData()
            .then(function(data) {
                expect(data).toBeDefined();
                return processData(data);
            })
            .then(function(result) {
                expect(result).toEqual(expectedResult);
            });
    });
    
    it("should handle promise rejections", function() {
        return failingOperation()
            .then(function() {
                fail("Promise should have been rejected");
            })
            .catch(function(error) {
                expect(error.message).toContain("expected error");
            });
    });
});`;
  }
}