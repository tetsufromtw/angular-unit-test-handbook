import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeHighlightComponent } from '../shared/code-highlight.component';

interface LifecycleStep {
  step: string;
  description: string;
  fooValue?: number;
  thisValue?: any;
  executed: boolean;
}

interface TestScenario {
  name: string;
  description: string;
  steps: LifecycleStep[];
  codeExample: {
    implementation: string;
    test: string;
  };
}

@Component({
  selector: 'app-shared-setup',
  standalone: true,
  imports: [CommonModule, CodeHighlightComponent],
  templateUrl: './shared-setup.component.html',
  styleUrl: './shared-setup.component.scss'
})
export class SharedSetupComponent {
  protected currentFoo = 0;
  protected currentThis: any = {};
  protected executionLog: string[] = [];

  protected testScenarios: TestScenario[] = [
    {
      name: 'ライフサイクルフック実行順序',
      description: 'beforeAll, beforeEach, afterEach, afterAll の実行順序のデモンストレーション',
      steps: [
        { step: 'beforeAll', description: 'すべてのテスト開始前に1回実行', fooValue: 1, executed: false },
        { step: 'beforeEach (test 1)', description: '各テスト前に実行', fooValue: 2, executed: false },
        { step: 'test 1 execution', description: '最初のテストを実行', fooValue: 2, executed: false },
        { step: 'afterEach (test 1)', description: '各テスト後に実行', fooValue: 0, executed: false },
        { step: 'beforeEach (test 2)', description: '2番目のテスト前に実行', fooValue: 1, executed: false },
        { step: 'test 2 execution', description: '2番目のテストを実行', fooValue: 1, executed: false },
        { step: 'afterEach (test 2)', description: '2番目のテスト後に実行', fooValue: 0, executed: false },
        { step: 'afterAll', description: 'すべてのテスト完了後に1回実行', fooValue: 0, executed: false }
      ],
      codeExample: {
        implementation: `// 計數器服務実装
class CounterService {
    private count: number = 0;
    
    initialize(): void {
        this.count = 1;
    }
    
    increment(): void {
        this.count += 1;
    }
    
    reset(): void {
        this.count = 0;
    }
    
    getCount(): number {
        return this.count;
    }
    
    cleanup(): void {
        this.count = 0;
    }
}`,
        test: `// 生命週期鉤子テスト
describe("A suite with some shared setup", () => {
    let counterService: CounterService;
    
    beforeAll(() => {
        counterService = new CounterService();
        counterService.initialize();  // 初期値を設定
    });
    
    beforeEach(() => {
        counterService.increment();  // テスト前に毎回増加
    });
    
    afterEach(() => {
        counterService.reset();   // テスト後に毎回リセット
    });
    
    afterAll(() => {
        counterService.cleanup();   // 最終クリーンアップ
    });
    
    it("test 1", () => {
        expect(counterService.getCount()).toEqual(2);
    });
    
    it("test 2", () => {
        expect(counterService.getCount()).toEqual(2);
    });
});`
      }
    },
    {
      name: 'this コンテキストの分離',
      description: '各テストの this コンテキストは独立しており、テスト間の汚染を防止する',
      steps: [
        { step: 'beforeEach (test 1)', description: 'this.foo = 0 を設定', thisValue: { foo: 0 }, executed: false },
        { step: 'test 1 sets this.bar', description: 'テスト 1 で this.bar = "test pollution?" を設定', thisValue: { foo: 0, bar: 'test pollution?' }, executed: false },
        { step: 'beforeEach (test 2)', description: 'テスト 2 のために this.foo = 0 を再設定', thisValue: { foo: 0 }, executed: false },
        { step: 'test 2 checks isolation', description: 'テスト 2 で this.bar が undefined であることを検証', thisValue: { foo: 0, bar: undefined }, executed: false }
      ],
      codeExample: {
        implementation: `// テストコンテキストマネージャー
class TestContext {
    public data: any = {};
    
    setProperty(key: string, value: any): void {
        this.data[key] = value;
    }
    
    getProperty(key: string): any {
        return this.data[key];
    }
    
    hasProperty(key: string): boolean {
        return key in this.data;
    }
    
    clear(): void {
        this.data = {};
    }
}`,
        test: `// this コンテキストの分離テスト
describe("A spec", () => {
    let testContext: TestContext;
    
    beforeEach(() => {
        testContext = new TestContext();
        testContext.setProperty('foo', 0);
    });

    it("can use shared state", () => {
        expect(testContext.getProperty('foo')).toEqual(0);
        testContext.setProperty('bar', "test pollution?");
        expect(testContext.hasProperty('bar')).toBe(true);
    });

    it("prevents test pollution by having clean state", () => {
        expect(testContext.getProperty('foo')).toEqual(0);
        expect(testContext.hasProperty('bar')).toBe(false);  // 隔離成功
    });
});`
      }
    },
    {
      name: 'fail() 関数使用',
      description: 'fail() 関数を使用してテストを明確に失敗としてマークする',
      steps: [
        { step: 'condition check', description: 'x の値をチェック', executed: false },
        { step: 'callback decision', description: '条件に基づいてコールバックを実行するかどうかを決定', executed: false },
        { step: 'result', description: 'テスト結果：実行されるべきでないコールバック', executed: false }
      ],
      codeExample: {
        implementation: `// 条件実行サービス
class ConditionalExecutor {
    execute(condition: boolean, callback: () => void): void {
        if (condition) {
            callback();
        }
    }
    
    executeAsync(condition: boolean, callback: () => void, delay: number = 0): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (condition) {
                    callback();
                }
                resolve();
            }, delay);
        });
    }
    
    validateCondition(value: any): boolean {
        return Boolean(value);
    }
}`,
        test: `// fail() 関数使用テスト
describe("A spec using the fail function", () => {
    const executor = new ConditionalExecutor();

    it("should not call the callback when condition is false", () => {
        executor.execute(false, () => {
            fail("Callback should not have been called");
        });
        
        // テスト成功、コールバックが実行されなかったため
        expect(executor.validateCondition(false)).toBe(false);
    });
    
    it("should call the callback when condition is true", () => {
        let callbackExecuted = false;
        
        executor.execute(true, () => {
            callbackExecuted = true;
        });
        
        expect(callbackExecuted).toBe(true);
    });
});`
      }
    }
  ];

  protected simulateLifecycleExecution(): void {
    this.executionLog = [];
    this.currentFoo = 0;
    
    const scenario = this.testScenarios[0];
    scenario.steps.forEach(step => step.executed = false);

    let stepIndex = 0;
    const executeStep = () => {
      if (stepIndex < scenario.steps.length) {
        const step = scenario.steps[stepIndex];
        step.executed = true;
        
        // foo 値の変化をシミュレート
        if (step.fooValue !== undefined) {
          this.currentFoo = step.fooValue;
        }
        
        this.executionLog.push(`${stepIndex + 1}. ${step.step}: foo = ${this.currentFoo}`);
        
        stepIndex++;
        setTimeout(executeStep, 800);
      }
    };
    
    executeStep();
  }

  protected simulateThisIsolation(): void {
    this.executionLog = [];
    const scenario = this.testScenarios[1];
    scenario.steps.forEach(step => step.executed = false);

    let stepIndex = 0;
    const executeStep = () => {
      if (stepIndex < scenario.steps.length) {
        const step = scenario.steps[stepIndex];
        step.executed = true;
        
        if (step.thisValue) {
          this.currentThis = { ...step.thisValue };
        }
        
        this.executionLog.push(`${stepIndex + 1}. ${step.step}: this = ${JSON.stringify(this.currentThis)}`);
        
        stepIndex++;
        setTimeout(executeStep, 1000);
      }
    };
    
    executeStep();
  }

  protected simulateFailFunction(): void {
    this.executionLog = [];
    const scenario = this.testScenarios[2];
    scenario.steps.forEach(step => step.executed = false);

    // fail() 関数テストをシミュレート
    const mockFoo = (x: boolean, callback: () => void) => {
      if (x) {
        callback();
      }
    };

    let stepIndex = 0;
    const executeStep = () => {
      if (stepIndex < scenario.steps.length) {
        const step = scenario.steps[stepIndex];
        step.executed = true;
        
        switch (stepIndex) {
          case 0:
            this.executionLog.push('チェック x = false');
            break;
          case 1:
            this.executionLog.push('x が false、コールバック関数を実行しない');
            break;
          case 2:
            this.executionLog.push('✓ テスト合格：コールバック関数が実行されなかった');
            break;
        }
        
        stepIndex++;
        setTimeout(executeStep, 800);
      }
    };
    
    executeStep();
  }

  protected nestedDescribeExample = `describe("nested inside a second describe", () => {
    let bar: number;

    beforeEach(() => {
        bar = 1;
    });

    it("can reference both scopes as needed", () => {
        expect(foo).toEqual(bar);  // foo は外側のスコープから
    });
});`;

  protected skipExamples = {
    xdescribe: `xdescribe("This suite will be skipped", () => {
    it("will not run", () => {
        expect(true).toBe(false);
    });
});`,
    xit: `xit("can be declared 'xit'", () => {
    expect(true).toBe(false);  // 不會実行
});`,
    pending: `it("can be declared by calling 'pending'", () => {
    expect(true).toBe(false);
    pending('this is why it is pending');
});`
  };

  protected runNestedDescribeExample(): void {
    this.executionLog = [];
    this.executionLog.push('実行ネストした例を実行...');
    
    setTimeout(() => {
      this.executionLog.push('外層 describe: foo = 1');
      setTimeout(() => {
        this.executionLog.push('內層 describe: bar = 1');
        setTimeout(() => {
          this.executionLog.push('テスト: foo === bar (1 === 1) ✓');
        }, 500);
      }, 500);
    }, 500);
  }
}