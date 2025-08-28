import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestResult, TestSuite } from '../../models/test-result.model';
import { CodeHighlightComponent } from '../shared/code-highlight.component';

@Component({
  selector: 'app-basic-suite',
  standalone: true,
  imports: [CommonModule, CodeHighlightComponent],
  templateUrl: './basic-suite.component.html',
  styleUrl: './basic-suite.component.scss'
})
export class BasicSuiteComponent {
  protected testSuites: TestSuite[] = [
    {
      suiteName: 'A suite',
      description: 'テストスイートは関連するテストを整理するためのコンテナです',
      tests: [
        {
          testName: 'contains a spec with an expectation',
          description: '基本的な expectation テスト',
          expected: true,
          actual: true,
          passed: true
        }
      ]
    },
    {
      suiteName: 'A suite is just a function',
      description: 'テストスイートは本質的に関数である',
      tests: [
        {
          testName: 'and so is a spec',
          description: 'テスト仕様も関数である',
          expected: true,
          actual: true,
          passed: true
        }
      ]
    },
    {
      suiteName: "The 'toBe' matcher compares with ===",
      description: 'toBe マッチャーは厳密等価比較 (===) を使用',
      tests: [
        {
          testName: 'and has a positive case',
          description: 'ポジティブテストケース',
          expected: true,
          actual: true,
          passed: true
        },
        {
          testName: 'and can have a negative case',
          description: '負面テストケース - 使用 .not',
          expected: 'not true',
          actual: false,
          passed: true
        }
      ]
    }
  ];

  protected codeExamples = {
    basicSuite: {
      implementation: `// 基礎機能実装
class BasicValidator {
    validateInput(value: any): boolean {
        return value !== null && value !== undefined;
    }
    
    isTrue(value: any): boolean {
        return value === true;
    }
}`,
      test: `// 対応するテストコード
describe("A suite", function() {
    it("contains a spec with an expectation", function() {
        const validator = new BasicValidator();
        const result = validator.isTrue(true);
        expect(result).toBe(true);
    });
});`
    },
    suiteFunction: {
      implementation: `// 状態マネージャー実装
class StateManager {
    private state: any = null;
    
    setState(value: any): void {
        this.state = value;
    }
    
    getState(): any {
        return this.state;
    }
    
    isStateValid(): boolean {
        return this.state !== null;
    }
}`,
      test: `// 状態マネージャーテスト
describe("A suite is just a function", function() {
    let stateManager;

    it("and so is a spec", function() {
        stateManager = new StateManager();
        stateManager.setState(true);
        
        expect(stateManager.getState()).toBe(true);
        expect(stateManager.isStateValid()).toBe(true);
    });
});`
    },
    toBeComparison: {
      implementation: `// 比較器工具実装
class ComparisonUtils {
    strictEqual(a: any, b: any): boolean {
        return a === b;
    }
    
    isBoolean(value: any): boolean {
        return typeof value === 'boolean';
    }
    
    negate(value: boolean): boolean {
        return !value;
    }
}`,
      test: `// toBe マッチャー比較テスト
describe("The 'toBe' matcher compares with ===", function() {
    const utils = new ComparisonUtils();
    
    it("and has a positive case", function() {
        expect(utils.strictEqual(true, true)).toBe(true);
        expect(utils.isBoolean(true)).toBe(true);
    });

    it("and can have a negative case", function() {
        expect(utils.negate(true)).not.toBe(true);
        expect(false).not.toBe(true);
    });
});`
    }
  };

  protected executeDemoTest(suiteIndex: number, testIndex: number): void {
    const test = this.testSuites[suiteIndex].tests[testIndex];
    
    // テスト実行のシミュレーション
    setTimeout(() => {
      console.log(`実行テスト: ${test.testName}`);
      console.log(`期待値: ${test.expected}`);
      console.log(`実際値: ${test.actual}`);
      console.log(`結果: ${test.passed ? '合格' : '失敗'}`);
    }, 100);
  }

  protected runAllTests(): void {
    console.log('すべての基本テストを実行中...');
    this.testSuites.forEach((suite, suiteIndex) => {
      console.log(`\nテストスイート: ${suite.suiteName}`);
      suite.tests.forEach((test, testIndex) => {
        this.executeDemoTest(suiteIndex, testIndex);
      });
    });
  }
}