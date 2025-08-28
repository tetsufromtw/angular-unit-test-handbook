import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeHighlightComponent } from '../shared/code-highlight.component';

interface MatcherCategory {
  categoryName: string;
  description: string;
  matchers: MatcherExample[];
}

interface MatcherExample {
  name: string;
  description: string;
  codeExample: {
    implementation: string;
    test: string;
  };
  isRunning: boolean;
  result?: string;
}

@Component({
  selector: 'app-matcher-tests',
  standalone: true,
  imports: [CommonModule, CodeHighlightComponent],
  templateUrl: './matcher-tests.component.html',
  styleUrl: './matcher-tests.component.scss'
})
export class MatcherTestsComponent {
  protected executionLog: string[] = [];

  protected matcherCategories: MatcherCategory[] = [
    {
      categoryName: 'デフォルト基本マッチャー',
      description: 'Jasmine に組み込まれている基本的な比較マッチャー',
      matchers: [
        {
          name: 'toBe() vs toEqual() - デフォルトマッチャー',
          description: 'toBe は === で比較、toEqual は深い比較を実行（組み込みマッチャー）',
          codeExample: {
            implementation: `// 【デフォルトマッチャー使用例】
class User {
  constructor(
    public id: number, 
    public name: string,
    public profile: { age: number; email: string }
  ) {}

  getProfile() {
    return this.profile;
  }
}

// テスト対象のデータ
const user1 = new User(1, 'John', { age: 25, email: 'john@test.com' });
const user2 = user1;  // 同じ参照
const user3 = new User(1, 'John', { age: 25, email: 'john@test.com' }); // 異なる参照、同じ内容

// ✅ デフォルトマッチャーの使用
expect(user1).toBe(user2);        // 参照比較 ✓
expect(user1).not.toBe(user3);    // 異なる参照 ✓
expect(user1).toEqual(user3);     // 深い内容比較 ✓
expect(user1.name).toBe('John');  // プリミティブ値比較 ✓`,
            test: `describe('Default Matchers - toBe vs toEqual', () => {
  let user1: User;
  let user2: User;
  let user3: User;

  beforeEach(() => {
    user1 = new User(1, 'John', { age: 25, email: 'john@test.com' });
    user2 = user1;  // 同じ参照
    user3 = new User(1, 'John', { age: 25, email: 'john@test.com' }); // 異なる参照
  });

  it('toBe() - デフォルトマッチャーで参照比較', () => {
    // ✅ toBe は === で比較（参照比較）
    expect(user1).toBe(user2);        // 同じオブジェクト参照
    expect(user1).not.toBe(user3);    // 異なるオブジェクト参照
    
    // プリミティブ値の場合
    expect(user1.id).toBe(1);         // 数値比較
    expect(user1.name).toBe('John');  // 文字列比較
  });

  it('toEqual() - デフォルトマッチャーで深い比較', () => {
    // ✅ toEqual は深い内容比較
    expect(user1).toEqual(user3);           // 内容が同じ
    expect(user1.profile).toEqual(user3.profile); // ネストしたオブジェクトも比較
    
    // 配列の場合
    const arr1 = [1, 2, 3];
    const arr2 = [1, 2, 3];
    expect(arr1).toEqual(arr2);             // 配列の内容比較
    expect(arr1).not.toBe(arr2);            // でも参照は異なる
  });
});`
          },
          isRunning: false
        },
        {
          name: 'toBeNull, toBeUndefined, toBeDefined',
          description: 'null、undefined、定義済み状態をチェック',
          codeExample: {
            implementation: `// 設定管理器
class ConfigManager {
  private config: Record<string, any> = {};

  setConfig(key: string, value: any): void {
    this.config[key] = value;
  }

  getConfig(key: string): any {
    return this.config[key];
  }

  removeConfig(key: string): void {
    this.config[key] = null;
  }

  deleteConfig(key: string): void {
    delete this.config[key];
  }

  hasConfig(key: string): boolean {
    return key in this.config;
  }

  getConfigOrDefault(key: string, defaultValue: any): any {
    const value = this.config[key];
    return value !== undefined ? value : defaultValue;
  }
}`,
            test: `describe('Null/Undefined Matchers', () => {
  let configManager: ConfigManager;

  beforeEach(() => {
    configManager = new ConfigManager();
  });

  it('should handle null values', () => {
    configManager.setConfig('theme', 'dark');
    configManager.removeConfig('theme');

    expect(configManager.getConfig('theme')).toBeNull();
    expect(configManager.getConfig('theme')).not.toBeUndefined();
    expect(configManager.getConfig('theme')).toBeDefined();
  });

  it('should handle undefined values', () => {
    const nonExistent = configManager.getConfig('nonExistent');

    expect(nonExistent).toBeUndefined();
    expect(nonExistent).not.toBeNull();
    expect(nonExistent).not.toBeDefined();
  });

  it('should handle defined values', () => {
    configManager.setConfig('apiUrl', 'https://api.example.com');

    expect(configManager.getConfig('apiUrl')).toBeDefined();
    expect(configManager.getConfig('apiUrl')).not.toBeNull();
    expect(configManager.getConfig('apiUrl')).not.toBeUndefined();
  });

  it('should work with default values', () => {
    const defaultUrl = 'https://default.com';
    const result = configManager.getConfigOrDefault('apiUrl', defaultUrl);

    expect(result).toBeDefined();
    expect(result).toBe(defaultUrl);
  });
});`
          },
          isRunning: false
        }
      ]
    },
    {
      categoryName: 'デフォルト数値マッチャー',
      description: 'Jasmine 組み込みの数値比較と範囲チェックマッチャー',
      matchers: [
        {
          name: 'toBeGreaterThan, toBeLessThan',
          description: '数値サイズ比較マッチャー',
          codeExample: {
            implementation: `// スコア計算機
class ScoreCalculator {
  private scores: number[] = [];

  addScore(score: number): void {
    if (score < 0 || score > 100) {
      throw new Error('スコアは 0-100 の間');
    }
    this.scores.push(score);
  }

  getAverage(): number {
    if (this.scores.length === 0) return 0;
    const sum = this.scores.reduce((acc, score) => acc + score, 0);
    return Math.round((sum / this.scores.length) * 100) / 100;
  }

  getGrade(): string {
    const avg = this.getAverage();
    if (avg >= 90) return 'A';
    if (avg >= 80) return 'B';
    if (avg >= 70) return 'C';
    if (avg >= 60) return 'D';
    return 'F';
  }

  getPassingRate(): number {
    if (this.scores.length === 0) return 0;
    const passingScores = this.scores.filter(score => score >= 60);
    return Math.round((passingScores.length / this.scores.length) * 10000) / 100;
  }
}`,
            test: `describe('Number Comparison Matchers', () => {
  let calculator: ScoreCalculator;

  beforeEach(() => {
    calculator = new ScoreCalculator();
  });

  it('should compare scores correctly', () => {
    calculator.addScore(85);
    calculator.addScore(92);
    calculator.addScore(78);

    const average = calculator.getAverage();

    expect(average).toBeGreaterThan(80);
    expect(average).toBeLessThan(90);
    expect(average).toBeGreaterThanOrEqual(85);
    expect(average).toBeLessThanOrEqual(85);
  });

  it('should validate passing rate', () => {
    calculator.addScore(90);
    calculator.addScore(75);
    calculator.addScore(45);
    calculator.addScore(88);

    const passingRate = calculator.getPassingRate();

    expect(passingRate).toBeGreaterThan(50);
    expect(passingRate).toBeLessThan(100);
    expect(passingRate).toEqual(75); // 3/4 = 75%
  });

  it('should handle edge cases', () => {
    expect(() => calculator.addScore(-5)).toThrow();
    expect(() => calculator.addScore(105)).toThrow();
    expect(calculator.getAverage()).toBe(0);
  });
});`
          },
          isRunning: false
        },
        {
          name: 'toBeCloseTo',
          description: '浮動小数点数の精度比較、精度問題を回避',
          codeExample: {
            implementation: `// 金融計算機
class FinanceCalculator {
  calculateInterest(principal: number, rate: number, time: number): number {
    return principal * rate * time;
  }

  calculateCompoundInterest(principal: number, rate: number, time: number, n: number = 1): number {
    return principal * Math.pow(1 + rate / n, n * time);
  }

  calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
    const monthlyRate = annualRate / 12;
    const totalPayments = years * 12;
    
    if (monthlyRate === 0) return principal / totalPayments;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
           (Math.pow(1 + monthlyRate, totalPayments) - 1);
  }

  calculateTax(amount: number, taxRate: number): number {
    return amount * taxRate;
  }
}`,
            test: `describe('Floating Point Precision Matchers', () => {
  let financeCalc: FinanceCalculator;

  beforeEach(() => {
    financeCalc = new FinanceCalculator();
  });

  it('should handle floating point precision', () => {
    const result = 0.1 + 0.2; // JavaScript 精度問題

    expect(result).not.toBe(0.3);           // 厳密等価は失敗する
    expect(result).toBeCloseTo(0.3, 1);     // 精度比較成功
    expect(result).toBeCloseTo(0.3, 5);     // より高い精度も可能
  });

  it('should calculate interest with precision', () => {
    const principal = 1000;
    const rate = 0.05;
    const time = 1;

    const interest = financeCalc.calculateInterest(principal, rate, time);
    
    expect(interest).toBeCloseTo(50, 2);
    expect(interest).toBe(50); // このケースではちょうど整数
  });

  it('should handle compound interest calculations', () => {
    const principal = 1000;
    const rate = 0.05;
    const time = 2;
    const n = 12; // 月複利

    const amount = financeCalc.calculateCompoundInterest(principal, rate, time, n);
    const expected = 1105.15; // 期待値

    expect(amount).toBeCloseTo(expected, 1);
    expect(amount).toBeGreaterThan(1100);
  });

  it('should calculate monthly payments accurately', () => {
    const payment = financeCalc.calculateMonthlyPayment(200000, 0.04, 30);
    
    expect(payment).toBeCloseTo(954.83, 1);
    expect(payment).toBeGreaterThan(900);
    expect(payment).toBeLessThan(1000);
  });
});`
          },
          isRunning: false
        }
      ]
    },
    {
      categoryName: 'デフォルト文字列マッチャー',
      description: 'Jasmine 組み込みの文字列チェックとパターンマッチング',
      matchers: [
        {
          name: 'toContain, toMatch',
          description: 'テキスト列の含有確認と正規表現マッチング',
          codeExample: {
            implementation: `// テキストプロセッサー
class TextProcessor {
  private text: string = '';

  setText(text: string): void {
    this.text = text;
  }

  getText(): string {
    return this.text;
  }

  extractEmails(): string[] {
    const emailRegex = /\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b/g;
    return this.text.match(emailRegex) || [];
  }

  extractUrls(): string[] {
    const urlRegex = /https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/g;
    return this.text.match(urlRegex) || [];
  }

  getWordCount(): number {
    return this.text.trim().split(/\\s+/).filter(word => word.length > 0).length;
  }

  highlightKeyword(keyword: string): string {
    const regex = new RegExp(keyword, 'gi');
    return this.text.replace(regex, \`<mark>\$&</mark>\`);
  }

  removeHtmlTags(): string {
    return this.text.replace(/<[^>]*>/g, '');
  }
}`,
            test: `describe('String Matchers', () => {
  let processor: TextProcessor;

  beforeEach(() => {
    processor = new TextProcessor();
  });

  it('should check string containment', () => {
    const text = 'Hello, this is a test message with important content.';
    processor.setText(text);

    expect(processor.getText()).toContain('test');
    expect(processor.getText()).toContain('important');
    expect(processor.getText()).not.toContain('missing');
    
    // 大文字小文字に敏感
    expect(processor.getText()).toContain('Hello');
    expect(processor.getText()).not.toContain('hello');
  });

  it('should match with regular expressions', () => {
    const emailText = 'Contact us at support@example.com or admin@test.org';
    processor.setText(emailText);

    expect(processor.getText()).toMatch(/@\\w+\\./);  // メールパターンを含む
    expect(processor.getText()).toMatch(/support@example\\.com/);
    expect(processor.getText()).not.toMatch(/\\d{4}-\\d{2}-\\d{2}/); // 日付フォーマットを含まない
  });

  it('should extract emails correctly', () => {
    const text = 'Send reports to john@company.com and mary@business.org';
    processor.setText(text);

    const emails = processor.extractEmails();

    expect(emails).toContain('john@company.com');
    expect(emails).toContain('mary@business.org');
    expect(emails).toHaveSize(2);
  });

  it('should process HTML content', () => {
    const htmlText = '<p>This is <strong>important</strong> content.</p>';
    processor.setText(htmlText);

    const highlighted = processor.highlightKeyword('important');
    const cleaned = processor.removeHtmlTags();

    expect(highlighted).toContain('<mark>important</mark>');
    expect(cleaned).not.toContain('<');
    expect(cleaned).toEqual('This is important content.');
  });
});`
          },
          isRunning: false
        }
      ]
    },
    {
      categoryName: 'デフォルト配列・オブジェクトマッチャー',
      description: 'Jasmine 組み込みの配列とオブジェクトの検証マッチャー',
      matchers: [
        {
          name: 'toContain, toHaveSize, toBeInstanceOf',
          description: '配列の内容チェックとオブジェクトの型検証',
          codeExample: {
            implementation: `// ショッピングカート管理
class ShoppingCart {
  private items: CartItem[] = [];

  addItem(product: Product, quantity: number = 1): void {
    const existingItem = this.items.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push(new CartItem(product, quantity));
    }
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(item => item.product.id !== productId);
  }

  getItems(): CartItem[] {
    return [...this.items];
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + item.getTotalPrice(), 0);
  }

  getItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  findItemsInCategory(category: string): CartItem[] {
    return this.items.filter(item => item.product.category === category);
  }
}

class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public category: string
  ) {}
}

class CartItem {
  constructor(public product: Product, public quantity: number) {}

  getTotalPrice(): number {
    return this.product.price * this.quantity;
  }
}`,
            test: `describe('Array and Object Matchers', () => {
  let cart: ShoppingCart;
  let laptop: Product;
  let mouse: Product;
  let keyboard: Product;

  beforeEach(() => {
    cart = new ShoppingCart();
    laptop = new Product('1', 'Laptop', 999.99, 'Electronics');
    mouse = new Product('2', 'Mouse', 29.99, 'Electronics');
    keyboard = new Product('3', 'Keyboard', 79.99, 'Electronics');
  });

  it('should check array contents', () => {
    cart.addItem(laptop);
    cart.addItem(mouse);

    const items = cart.getItems();

    expect(items).toHaveSize(2);
    expect(items).toContain(jasmine.objectContaining({
      product: jasmine.objectContaining({ name: 'Laptop' })
    }));
    
    const productNames = items.map(item => item.product.name);
    expect(productNames).toContain('Laptop');
    expect(productNames).toContain('Mouse');
    expect(productNames).not.toContain('Keyboard');
  });

  it('should validate object instances', () => {
    cart.addItem(laptop);
    const items = cart.getItems();
    const firstItem = items[0];

    expect(cart).toBeInstanceOf(ShoppingCart);
    expect(firstItem).toBeInstanceOf(CartItem);
    expect(firstItem.product).toBeInstanceOf(Product);
    expect(items).toBeInstanceOf(Array);
  });

  it('should check object properties', () => {
    cart.addItem(laptop, 2);
    cart.addItem(mouse);

    const electronicsItems = cart.findItemsInCategory('Electronics');

    expect(electronicsItems).toHaveSize(2);
    expect(cart.getTotalPrice()).toBeCloseTo(2029.97, 2);
    expect(cart.getItemCount()).toBe(3);

    // オブジェクトが特定のプロパティを含むかチェック
    expect(laptop).toEqual(jasmine.objectContaining({
      name: 'Laptop',
      category: 'Electronics'
    }));
  });

  it('should handle empty and filtered arrays', () => {
    expect(cart.getItems()).toHaveSize(0);
    expect(cart.getItems()).toEqual([]);

    cart.addItem(laptop);
    cart.addItem(mouse);

    const booksItems = cart.findItemsInCategory('Books');
    expect(booksItems).toHaveSize(0);
    expect(booksItems).toEqual([]);
  });
});`
          },
          isRunning: false
        }
      ]
    },
    {
      categoryName: 'カスタムマッチャー',
      description: '独自に作成したカスタムマッチャーの使用例',
      matchers: [
        {
          name: 'Custom Matcher の作成と使用',
          description: 'jasmine.addMatchers() でカスタムマッチャーを作成し、デフォルトマッチャーと比較',
          codeExample: {
            implementation: `// 【カスタムマッチャー使用例】
class Product {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public category: string
  ) {}

  isInPriceRange(min: number, max: number): boolean {
    return this.price >= min && this.price <= max;
  }
}

// ✅ デフォルトマッチャーでの複雑な検証
const product = new Product(1, 'Laptop', 999, 'Electronics');

// デフォルトマッチャーを使った複雑な検証（冗長）
expect(product.price).toBeGreaterThanOrEqual(500);
expect(product.price).toBeLessThanOrEqual(1500);
expect(product.category).toBe('Electronics');

// ❌ このような複雑な検証は読みにくい
expect(product.isInPriceRange(500, 1500) && product.category === 'Electronics').toBe(true);`,
            test: `describe('Custom vs Default Matchers', () => {
  let product: Product;

  beforeEach(() => {
    // 🔧 カスタムマッチャーを追加
    jasmine.addMatchers({
      toBeInPriceRange: () => ({
        compare: (actual: Product, min: number, max: number) => ({
          pass: actual.price >= min && actual.price <= max,
          message: \`Expected \${actual.name} price \${actual.price} to be between \${min} and \${max}\`
        })
      }),
      
      toBeElectronicsProduct: () => ({
        compare: (actual: Product) => ({
          pass: actual.category === 'Electronics' && actual.price > 0,
          message: \`Expected \${actual.name} to be a valid Electronics product\`
        })
      })
    });

    product = new Product(1, 'Laptop', 999, 'Electronics');
  });

  it('デフォルトマッチャーでの検証（冗長）', () => {
    // ❌ 複数のデフォルトマッチャーが必要
    expect(product.price).toBeGreaterThanOrEqual(500);
    expect(product.price).toBeLessThanOrEqual(1500);
    expect(product.category).toBe('Electronics');
    expect(product.price).toBeGreaterThan(0);
  });

  it('カスタムマッチャーでの検証（簡潔）', () => {
    // ✅ カスタムマッチャーで簡潔に
    expect(product).toBeInPriceRange(500, 1500);
    expect(product).toBeElectronicsProduct();
  });

  it('複合条件もカスタムマッチャーで簡単に', () => {
    const products = [
      new Product(1, 'Mouse', 25, 'Electronics'),
      new Product(2, 'Keyboard', 75, 'Electronics'),
      new Product(3, 'Monitor', 300, 'Electronics')
    ];

    // ✅ 各製品が条件を満たすか簡潔にチェック
    products.forEach(p => {
      expect(p).toBeElectronicsProduct();
      expect(p).toBeInPriceRange(20, 500);
    });
  });
});`
          },
          isRunning: false
        }
      ]
    }
  ];

  protected runMatcherTest(categoryIndex: number, matcherIndex: number): void {
    const matcher = this.matcherCategories[categoryIndex].matchers[matcherIndex];
    matcher.isRunning = true;
    this.executionLog = [];

    this.executionLog.push(`実行開始: ${matcher.name}`);

    setTimeout(() => {
      this.executionLog.push('テストデータを設定中...');
      
      setTimeout(() => {
        this.executionLog.push('実行マッチャーテスト...');
        
        setTimeout(() => {
          this.executionLog.push('検証マッチング結果...');
          
          setTimeout(() => {
            matcher.isRunning = false;
            matcher.result = '✓ テスト通過 - マッチャーが正常動作';
            this.executionLog.push('✓ テスト完了');
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }

  protected runAllMatcherTests(): void {
    this.executionLog = ['すべてのマッチャーテストの実行を開始...'];
    
    this.matcherCategories.forEach(category => {
      category.matchers.forEach(matcher => {
        matcher.isRunning = false;
        matcher.result = undefined;
      });
    });
    
    let delay = 0;
    this.matcherCategories.forEach((category, categoryIndex) => {
      category.matchers.forEach((matcher, matcherIndex) => {
        setTimeout(() => {
          this.runMatcherTest(categoryIndex, matcherIndex);
        }, delay);
        delay += 2000;
      });
    });
  }

  protected createTruthyFalsyExample(): string {
    return `describe('Truthy/Falsy Matchers', () => {
  it('should check truthy values', () => {
    expect(true).toBeTruthy();
    expect('hello').toBeTruthy();
    expect(1).toBeTruthy();
    expect([]).toBeTruthy();
    expect({}).toBeTruthy();
  });

  it('should check falsy values', () => {
    expect(false).toBeFalsy();
    expect('').toBeFalsy();
    expect(0).toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
    expect(NaN).toBeFalsy();
  });

  it('should distinguish between falsy and false', () => {
    expect(0).toBeFalsy();
    expect(0).not.toBe(false);  // 0 は falsy だが false ではない
    
    expect('').toBeFalsy();
    expect('').not.toBe(false); // 空文字列は falsy だが false ではない
  });
});`;
  }

  protected createCustomMatcherExample(): string {
    return `// カスタムマッチャーの例
beforeEach(() => {
  jasmine.addMatchers({
    toBeValidEmail: () => {
      return {
        compare: (actual: string) => {
          const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
          const result = {
            pass: emailRegex.test(actual),
            message: ''
          };
          
          if (result.pass) {
            result.message = 'Expected \\'' + actual + '\\' not to be a valid email';
          } else {
            result.message = 'Expected \\'' + actual + '\\' to be a valid email';
          }
          
          return result;
        }
      };
    },
    
    toBeInRange: () => {
      return {
        compare: (actual: number, min: number, max: number) => {
          const result = {
            pass: actual >= min && actual <= max,
            message: ''
          };
          
          if (result.pass) {
            result.message = 'Expected ' + actual + ' not to be between ' + min + ' and ' + max;
          } else {
            result.message = 'Expected ' + actual + ' to be between ' + min + ' and ' + max;
          }
          
          return result;
        }
      };
    }
  });
});

describe('Custom Matchers', () => {
  it('should validate emails', () => {
    expect('user@example.com').toBeValidEmail();
    expect('invalid-email').not.toBeValidEmail();
  });

  it('should check number ranges', () => {
    expect(5).toBeInRange(1, 10);
    expect(15).not.toBeInRange(1, 10);
  });
});`;
  }
}