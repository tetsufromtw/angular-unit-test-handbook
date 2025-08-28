# 🧪 Jasmine完全理解ガイド：初心者から実践まで

> **Angular開発者のためのテスティングフレームワーク完全攻略**

[![](https://img.shields.io/badge/Jasmine-v4.0+-green.svg)](https://jasmine.github.io/)
[![](https://img.shields.io/badge/Angular-v20+-red.svg)](https://angular.io/)
[![](https://img.shields.io/badge/TypeScript-v5.0+-blue.svg)](https://www.typescriptlang.org/)

## 📖 この記事について

Jasmineは JavaScript/TypeScript のテスティングフレームワークとして広く使われていますが、初心者にとって「どこから始めればいいか分からない」「実際の開発でどう活用するか」が見えにくいツールでもあります。

この記事では、**実践的な例を通じて Jasmine の全機能を体系的に学習**できるよう構成しています。

### 🎯 対象読者
- JavaScript/TypeScript の基本的な知識がある方
- Jasmine を初めて学ぶ方、または基礎から体系的に学び直したい方
- Angular プロジェクトでのテスト導入を検討している方
- より効果的なテスト戦略を構築したい方

### 💡 この記事で学べること
- Jasmine の基本概念から高度な機能まで
- 実際の開発で使える実践的なテストパターン
- Default Matcher vs Custom Matcher の使い分け
- 非同期処理のテスト手法
- spy機能を使ったモック・スタブの活用
- 時間に依存する処理のテスト方法

## 📋 目次

1. [基本的なテスト構造](#1-基本的なテスト構造)
2. [セットアップとライフサイクル](#2-セットアップとライフサイクル) 
3. [非同期処理のテスト](#3-非同期処理のテスト)
4. [Spy機能によるモック・テスト](#4-spy機能によるモック-テスト)
5. [Matcher完全攻略](#5-matcher完全攻略)
6. [時間制御とClock機能](#6-時間制御とclock機能)
7. [実践的なテストパターン](#7-実践的なテストパターン)

---

## 1. 基本的なテスト構造

Jasmineの最も基本的な概念は**テストスイート**（`describe`）と**テストケース**（`it`）です。

### 基本構文

```typescript
describe('テスト対象の説明', () => {
  it('具体的なテストケースの説明', () => {
    // テストの実装
    expect(actual).toBe(expected);
  });
});
```

### 実践例：計算機クラスのテスト

**実装コード**

```typescript
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  subtract(a: number, b: number): number {
    return a - b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('ゼロ除算はできません');
    }
    return a / b;
  }
}
```

**テストコード**

```typescript
describe('Calculator', () => {
  let calculator: Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  it('2つの数値を正しく加算する', () => {
    const result = calculator.add(2, 3);
    expect(result).toBe(5);
  });

  it('2つの数値を正しく減算する', () => {
    const result = calculator.subtract(5, 3);
    expect(result).toBe(2);
  });

  it('2つの数値を正しく乗算する', () => {
    const result = calculator.multiply(4, 3);
    expect(result).toBe(12);
  });

  it('2つの数値を正しく除算する', () => {
    const result = calculator.divide(10, 2);
    expect(result).toBe(5);
  });

  it('ゼロ除算の場合はエラーを投げる', () => {
    expect(() => calculator.divide(10, 0))
      .toThrow('ゼロ除算はできません');
  });
});
```

### ポイント解説

1. **`describe`**：関連するテストをグループ化
2. **`it`**：具体的なテストケースを定義
3. **`expect`**：実際の値と期待値を比較
4. **`toBe`**：厳密等価（===）での比較
5. **`toThrow`**：例外処理のテスト

---

## 2. セットアップとライフサイクル

テストを効率的に書くためには、**テストの前後で実行される処理**を理解することが重要です。Jasmineでは4つのライフサイクルフックが用意されています。

### ライフサイクルフック一覧

| フック | 実行タイミング | 使用場面 |
|--------|---------------|----------|
| `beforeAll` | テストスイート開始前に**1回** | データベース接続、重い初期化 |
| `beforeEach` | **各テストケース前**に毎回 | インスタンス作成、データリセット |
| `afterEach` | **各テストケース後**に毎回 | クリーンアップ、状態リセット |
| `afterAll` | テストスイート終了後に**1回** | リソース解放、接続切断 |

### 実践例：カウンターサービスのテスト

**実装コード**

```typescript
class CounterService {
  private count: number = 0;
  private history: number[] = [];

  initialize(): void {
    this.count = 0;
    this.history = [];
    console.log('Counter initialized');
  }

  increment(): number {
    this.count++;
    this.history.push(this.count);
    return this.count;
  }

  getCount(): number {
    return this.count;
  }

  getHistory(): number[] {
    return [...this.history];
  }

  reset(): void {
    this.count = 0;
  }

  cleanup(): void {
    this.history = [];
    console.log('Counter cleaned up');
  }
}
```

**テストコード**

```typescript
describe('CounterService ライフサイクル', () => {
  let counter: CounterService;

  // 🔧 スイート開始前に1回実行
  beforeAll(() => {
    console.log('テストスイート開始');
  });

  // 📋 各テスト前に実行
  beforeEach(() => {
    counter = new CounterService();
    counter.initialize();
  });

  // 🧹 各テスト後に実行  
  afterEach(() => {
    counter.reset();
  });

  // 🏁 スイート終了後に1回実行
  afterAll(() => {
    console.log('テストスイート完了');
  });

  it('increment should increase count', () => {
    // テスト実行時、カウントは0から開始
    expect(counter.getCount()).toBe(0);
    
    counter.increment();
    expect(counter.getCount()).toBe(1);
    
    counter.increment();
    expect(counter.getCount()).toBe(2);
  });

  it('should maintain history', () => {
    // 各テストは独立してクリーンな状態で開始
    expect(counter.getHistory()).toEqual([]);
    
    counter.increment();
    counter.increment();
    
    expect(counter.getHistory()).toEqual([1, 2]);
  });
});
```

### 実行順序の可視化

```
📊 テスト実行フロー

beforeAll()           ← スイート開始時に1回
├── beforeEach()      ← テスト1の前  
├── it('test 1')      ← 最初のテスト
├── afterEach()       ← テスト1の後
├── beforeEach()      ← テスト2の前
├── it('test 2')      ← 2番目のテスト  
├── afterEach()       ← テスト2の後
└── afterAll()        ← スイート終了時に1回
```

### ⚠️ よくある間違い

```typescript
// ❌ BAD: インスタンスを使い回す
describe('BadExample', () => {
  const service = new MyService(); // 全テストで共有される
  
  it('test 1', () => {
    service.setValue(10);
    expect(service.getValue()).toBe(10);
  });
  
  it('test 2', () => {
    // test 1の影響を受けてしまう！
    expect(service.getValue()).toBe(0); // ❌ 失敗する
  });
});

// ✅ GOOD: beforeEachで初期化
describe('GoodExample', () => {
  let service: MyService;
  
  beforeEach(() => {
    service = new MyService(); // 各テストで新しいインスタンス
  });
  
  it('test 1', () => {
    service.setValue(10);
    expect(service.getValue()).toBe(10);
  });
  
  it('test 2', () => {
    // クリーンな状態で開始
    expect(service.getValue()).toBe(0); // ✅ 成功する
  });
});
```

---

## 3. 非同期処理のテスト

モダンなJavaScript開発では非同期処理が不可欠です。Jasmineでは`async/await`とPromiseを使った非同期テストがサポートされています。

### 基本的な async/await テスト

**実装コード**

```typescript
class DataService {
  private cache: Map<string, any> = new Map();

  async fetchUser(id: string): Promise<User> {
    // キャッシュをチェック
    if (this.cache.has(id)) {
      return Promise.resolve(this.cache.get(id));
    }

    // API呼び出しをシミュレート
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (id === 'invalid') {
          reject(new Error('User not found'));
        } else {
          const user = { 
            id, 
            name: `User ${id}`,
            email: `user${id}@example.com`
          };
          this.cache.set(id, user);
          resolve(user);
        }
      }, 100);
    });
  }

  async processData(data: any[]): Promise<any[]> {
    // 大量データ処理をシミュレート
    return new Promise((resolve) => {
      setTimeout(() => {
        const processed = data.map(item => ({
          ...item,
          processed: true,
          timestamp: Date.now()
        }));
        resolve(processed);
      }, 500);
    });
  }
}

interface User {
  id: string;
  name: string;
  email: string;
}
```

**テストコード**

```typescript
describe('DataService async/await', () => {
  let service: DataService;

  beforeEach(() => {
    service = new DataService();
  });

  it('should fetch user successfully', async () => {
    // ✅ async/awaitを使った非同期テスト
    const user = await service.fetchUser('123');
    
    expect(user).toBeDefined();
    expect(user.id).toBe('123');
    expect(user.name).toBe('User 123');
    expect(user.email).toBe('user123@example.com');
  });

  it('should handle user not found error', async () => {
    // ✅ 例外の非同期テスト
    try {
      await service.fetchUser('invalid');
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error.message).toBe('User not found');
    }
  });

  it('should use cache for repeated calls', async () => {
    // ✅ 複数回の非同期呼び出し
    const user1 = await service.fetchUser('456');
    const user2 = await service.fetchUser('456');
    
    expect(user1).toBe(user2); // 同じオブジェクト参照
  });

  it('should process large datasets', async () => {
    const testData = [
      { id: 1, value: 'test1' },
      { id: 2, value: 'test2' },
      { id: 3, value: 'test3' }
    ];
    
    const result = await service.processData(testData);
    
    expect(result).toHaveSize(3);
    expect(result[0].processed).toBe(true);
    expect(result[0].timestamp).toBeDefined();
  });
});
```

### タイムアウト設定

```typescript
describe('Long running async tests', () => {
  // ⏱️ タイムアウトを延長（デフォルトは5秒）
  beforeEach(async () => {
    await initializeDatabase();
  }, 10000); // 10秒のタイムアウト

  it('should handle large file processing', async () => {
    const result = await processLargeFile('huge-file.csv');
    expect(result.success).toBe(true);
  }, 30000); // 30秒のタイムアウト
});
```

### Promise.all によるパラレルテスト

```typescript
it('should handle multiple concurrent requests', async () => {
  const userIds = ['1', '2', '3', '4', '5'];
  
  // ✅ 並列実行でテスト時間を短縮
  const users = await Promise.all(
    userIds.map(id => service.fetchUser(id))
  );
  
  expect(users).toHaveSize(5);
  users.forEach((user, index) => {
    expect(user.id).toBe(userIds[index]);
  });
});
```

### ⚠️ 非同期テストの注意点

```typescript
// ❌ BAD: awaitを忘れる
it('should fetch user', () => {
  service.fetchUser('123').then(user => {
    expect(user.id).toBe('123'); // テストが終了後に実行される
  });
});

// ✅ GOOD: 正しく待機
it('should fetch user', async () => {
  const user = await service.fetchUser('123');
  expect(user.id).toBe('123'); // 確実に実行される
});

// ❌ BAD: エラーハンドリングなし  
it('should handle errors', async () => {
  await service.fetchUser('invalid'); // 例外で止まる
});

// ✅ GOOD: 適切なエラーハンドリング
it('should handle errors', async () => {
  await expectAsync(service.fetchUser('invalid'))
    .toBeRejected();
});
```

---

## 4. Spy機能によるモック・テスト

実際の開発では、外部APIや複雑な依存関係を持つコードをテストする必要があります。Jasmineの**Spy機能**を使うことで、これらの依存関係を**モック**し、**独立したテスト**を作成できます。

### spyOn() の基本使用法

**実装コード**

```typescript
class EmailService {
  sendEmail(to: string, subject: string, body: string): boolean {
    // 実際のメール送信ロジック（外部API呼び出し）
    console.log(`Sending email to ${to}`);
    return true;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

class UserNotificationService {
  constructor(private emailService: EmailService) {}

  notifyUser(userId: string, message: string): boolean {
    // ユーザー情報の取得をシミュレート
    const user = this.getUserById(userId);
    if (!user || !this.emailService.validateEmail(user.email)) {
      return false;
    }

    const subject = 'Important Notification';
    const success = this.emailService.sendEmail(
      user.email, 
      subject, 
      message
    );

    if (success) {
      console.log(`通知を送信しました: ${userId}`);
      return true;
    }
    return false;
  }

  private getUserById(id: string) {
    // データベース呼び出しをシミュレート
    return {
      id,
      email: `user${id}@example.com`,
      name: `User ${id}`
    };
  }
}
```

**テストコード**

```typescript
describe('UserNotificationService with Spy', () => {
  let service: UserNotificationService;
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
    service = new UserNotificationService(emailService);
  });

  it('should call emailService methods correctly', () => {
    // 🕵️ emailService のメソッドを監視
    spyOn(emailService, 'validateEmail').and.returnValue(true);
    spyOn(emailService, 'sendEmail').and.returnValue(true);
    spyOn(console, 'log'); // ログ出力も監視

    const result = service.notifyUser('123', 'Test message');

    // ✅ メソッドが正しく呼び出されたかチェック
    expect(emailService.validateEmail)
      .toHaveBeenCalledWith('user123@example.com');
    
    expect(emailService.sendEmail).toHaveBeenCalledWith(
      'user123@example.com',
      'Important Notification', 
      'Test message'
    );

    expect(console.log)
      .toHaveBeenCalledWith('通知を送信しました: 123');

    expect(result).toBe(true);
  });

  it('should handle email validation failure', () => {
    // 🔍 バリデーション失敗をシミュレート
    spyOn(emailService, 'validateEmail').and.returnValue(false);
    spyOn(emailService, 'sendEmail');

    const result = service.notifyUser('456', 'Test message');

    expect(emailService.validateEmail).toHaveBeenCalled();
    expect(emailService.sendEmail).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should handle email sending failure', () => {
    spyOn(emailService, 'validateEmail').and.returnValue(true);
    spyOn(emailService, 'sendEmail').and.returnValue(false);

    const result = service.notifyUser('789', 'Test message');

    expect(emailService.sendEmail).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
```

### Spy の高度な機能

#### 1. callThrough - 元のメソッドも実行

```typescript
it('should track calls while executing original method', () => {
  spyOn(emailService, 'validateEmail').and.callThrough();
  
  const isValid = emailService.validateEmail('test@example.com');
  
  expect(emailService.validateEmail).toHaveBeenCalled();
  expect(isValid).toBe(true); // 実際の結果も返される
});
```

#### 2. callFake - カスタムの実装を提供

```typescript
it('should use custom implementation', () => {
  spyOn(emailService, 'sendEmail').and.callFake(
    (to: string, subject: string, body: string) => {
      console.log('Mock email sent');
      return to.includes('@example.com'); // カスタムロジック
    }
  );

  const result1 = service.notifyUser('user1', 'message');
  const result2 = service.notifyUser('invalid', 'message');

  expect(result1).toBe(true);  // @example.com なので成功
  expect(result2).toBe(false); // 条件に合わないので失敗
});
```

#### 3. throwError - エラーをシミュレート

```typescript
it('should handle service errors gracefully', () => {
  spyOn(emailService, 'sendEmail')
    .and.throwError('Network error');

  expect(() => {
    service.notifyUser('123', 'message');
  }).toThrowError('Network error');
});
```

### jasmine.createSpy() によるスパイオブジェクト

```typescript
describe('Standalone spy objects', () => {
  it('should create and use spy objects', () => {
    // 🆕 独立したスパイオブジェクトを作成
    const mockEmailService = jasmine.createSpyObj('EmailService', [
      'sendEmail',
      'validateEmail'
    ]);

    // スパイの戻り値を設定
    mockEmailService.validateEmail.and.returnValue(true);
    mockEmailService.sendEmail.and.returnValue(true);

    const service = new UserNotificationService(mockEmailService);
    const result = service.notifyUser('123', 'Test message');

    expect(mockEmailService.validateEmail).toHaveBeenCalled();
    expect(mockEmailService.sendEmail).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
```

### 呼び出し履歴の詳細確認

```typescript
it('should track detailed call information', () => {
  spyOn(emailService, 'sendEmail').and.returnValue(true);

  service.notifyUser('111', 'First message');
  service.notifyUser('222', 'Second message');

  const spy = emailService.sendEmail as jasmine.Spy;

  // 📊 呼び出し回数をチェック
  expect(spy).toHaveBeenCalledTimes(2);

  // 📝 各呼び出しの詳細をチェック  
  expect(spy.calls.argsFor(0)).toEqual([
    'user111@example.com',
    'Important Notification',
    'First message'
  ]);

  expect(spy.calls.argsFor(1)).toEqual([
    'user222@example.com', 
    'Important Notification',
    'Second message'
  ]);

  // 🔄 すべての呼び出し情報
  expect(spy.calls.allArgs()).toEqual([
    ['user111@example.com', 'Important Notification', 'First message'],
    ['user222@example.com', 'Important Notification', 'Second message']
  ]);
});
```

---

## 5. Matcher完全攻略：デフォルト vs カスタム

Jasmineの真の力は**Matcher**にあります。デフォルトMatcherでは表現しきれない複雑な検証を、**カスタムMatcher**で解決できます。

### デフォルトMatcher の限界

**実装コード**

```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
}

class ProductService {
  private products: Product[] = [];

  addProduct(product: Product): void {
    if (this.isValidProduct(product)) {
      this.products.push(product);
    } else {
      throw new Error('Invalid product');
    }
  }

  getElectronicsProducts(): Product[] {
    return this.products.filter(p => 
      p.category === 'Electronics' && 
      p.price > 0 && 
      p.inStock
    );
  }

  getPremiumProducts(): Product[] {
    return this.products.filter(p => 
      p.price >= 1000 && 
      p.tags.includes('premium') &&
      p.inStock
    );
  }

  private isValidProduct(product: Product): boolean {
    return product.name.length > 0 && 
           product.price > 0 &&
           product.category.length > 0;
  }
}
```

**問題のあるテストコード**

```typescript
describe('ProductService - デフォルトMatcherのみ', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
  });

  it('should validate electronics products', () => {
    const laptop = {
      id: '1', name: 'Laptop', price: 1500,
      category: 'Electronics', tags: ['tech'], inStock: true
    };
    
    service.addProduct(laptop);
    const electronics = service.getElectronicsProducts();

    // ❌ 冗長で読みにくい検証
    expect(electronics.length).toBe(1);
    expect(electronics[0].category).toBe('Electronics');
    expect(electronics[0].price).toBeGreaterThan(0);
    expect(electronics[0].inStock).toBe(true);
    
    // ❌ 複雑な条件は可読性が悪い
    const isValidElectronics = electronics[0].category === 'Electronics' &&
                               electronics[0].price > 0 &&
                               electronics[0].inStock;
    expect(isValidElectronics).toBe(true);
  });

  it('should validate premium products', () => {
    const watch = {
      id: '2', name: 'Smart Watch', price: 1200,
      category: 'Electronics', tags: ['premium', 'smart'], 
      inStock: true
    };
    
    service.addProduct(watch);
    const premium = service.getPremiumProducts();

    // ❌ さらに複雑な検証
    expect(premium.length).toBe(1);
    expect(premium[0].price).toBeGreaterThanOrEqual(1000);
    expect(premium[0].tags).toContain('premium');
    expect(premium[0].inStock).toBe(true);
  });
});
```

### カスタムMatcher による解決

**カスタムMatcherの定義**

```typescript
// カスタムMatcher の定義
const customMatchers = {
  toBeValidElectronicsProduct: () => ({
    compare: (actual: Product) => {
      const pass = actual.category === 'Electronics' &&
                   actual.price > 0 &&
                   actual.inStock &&
                   actual.name.length > 0;
      
      return {
        pass,
        message: pass 
          ? `Expected ${actual.name} not to be a valid electronics product`
          : `Expected ${actual.name} to be a valid electronics product`
      };
    }
  }),

  toBePremiumProduct: () => ({
    compare: (actual: Product) => {
      const pass = actual.price >= 1000 &&
                   actual.tags.includes('premium') &&
                   actual.inStock;

      return {
        pass,
        message: pass
          ? `Expected ${actual.name} not to be a premium product`
          : `Expected ${actual.name} to be a premium product`
      };
    }
  }),

  toBeInPriceRange: () => ({
    compare: (actual: Product, min: number, max: number) => {
      const pass = actual.price >= min && actual.price <= max;
      
      return {
        pass,
        message: pass
          ? `Expected ${actual.name} price ${actual.price} not to be between ${min} and ${max}`
          : `Expected ${actual.name} price ${actual.price} to be between ${min} and ${max}`
      };
    }
  })
};
```

**改善されたテストコード**

```typescript
describe('ProductService - カスタムMatcher使用', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
    
    // 🔧 カスタムMatcherを登録
    jasmine.addMatchers(customMatchers);
  });

  it('should validate electronics products elegantly', () => {
    const laptop = {
      id: '1', name: 'Laptop', price: 1500,
      category: 'Electronics', tags: ['tech'], inStock: true
    };
    
    service.addProduct(laptop);
    const electronics = service.getElectronicsProducts();

    // ✅ 簡潔で読みやすい検証
    expect(electronics).toHaveSize(1);
    expect(electronics[0]).toBeValidElectronicsProduct();
    expect(electronics[0]).toBeInPriceRange(1000, 2000);
  });

  it('should validate premium products elegantly', () => {
    const watch = {
      id: '2', name: 'Smart Watch', price: 1200,
      category: 'Electronics', tags: ['premium', 'smart'], 
      inStock: true
    };
    
    service.addProduct(watch);
    const premium = service.getPremiumProducts();

    // ✅ 意図が明確で保守性が高い
    expect(premium).toHaveSize(1);
    expect(premium[0]).toBePremiumProduct();
    expect(premium[0]).toBeValidElectronicsProduct();
  });

  it('should handle multiple products with custom matchers', () => {
    const products = [
      { id: '1', name: 'Laptop', price: 1500, category: 'Electronics', tags: ['premium'], inStock: true },
      { id: '2', name: 'Mouse', price: 50, category: 'Electronics', tags: ['basic'], inStock: true },
      { id: '3', name: 'Keyboard', price: 200, category: 'Electronics', tags: ['mechanical'], inStock: false }
    ];

    products.forEach(p => service.addProduct(p));
    const allProducts = service.getElectronicsProducts();

    // ✅ 配列の各要素をエレガントに検証
    allProducts.forEach(product => {
      expect(product).toBeValidElectronicsProduct();
    });

    const premiumProducts = allProducts.filter(p => p.price >= 1000);
    premiumProducts.forEach(product => {
      expect(product).toBePremiumProduct();
    });
  });
});
```

### カスタムMatcherの設計パターン

#### 1. 汎用的なバリデーション

```typescript
const generalMatchers = {
  toBeValidEmail: () => ({
    compare: (actual: string) => ({
      pass: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(actual),
      message: `Expected '${actual}' to be a valid email address`
    })
  }),

  toBeValidUrl: () => ({
    compare: (actual: string) => {
      try {
        new URL(actual);
        return { pass: true, message: '' };
      } catch {
        return { pass: false, message: `Expected '${actual}' to be a valid URL` };
      }
    }
  })
};
```

#### 2. ドメイン特有のバリデーション

```typescript
const domainMatchers = {
  toBeActiveUser: () => ({
    compare: (actual: User) => ({
      pass: actual.isActive && actual.lastLoginDate > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      message: `Expected user ${actual.name} to be active within last 30 days`
    })
  }),

  toHaveValidSubscription: () => ({
    compare: (actual: User) => ({
      pass: actual.subscription && actual.subscription.expiresAt > new Date(),
      message: `Expected user ${actual.name} to have valid subscription`
    })
  })
};
```

---

## 6. 時間制御とClock機能

時間に依存するコード（`setTimeout`、`setInterval`、現在時刻の取得など）のテストは困難ですが、JasmineのClock機能を使うことで効率的にテストできます。

### 6.1 Clock機能の基本

**実装コード**

```typescript
class TimerService {
  private callbacks: Map<string, Function> = new Map();

  scheduleCallback(id: string, callback: Function, delay: number): void {
    setTimeout(() => {
      callback();
      this.callbacks.delete(id);
    }, delay);
    this.callbacks.set(id, callback);
  }

  scheduleRepeating(id: string, callback: Function, interval: number): void {
    const repeatingCallback = () => {
      callback();
      setTimeout(repeatingCallback, interval);
    };
    setTimeout(repeatingCallback, interval);
    this.callbacks.set(id, callback);
  }

  getCurrentTime(): Date {
    return new Date();
  }

  isCallbackActive(id: string): boolean {
    return this.callbacks.has(id);
  }
}
```

**テストコード**

```typescript
describe('TimerService with Clock', () => {
  let timerService: TimerService;

  beforeEach(() => {
    timerService = new TimerService();
    jasmine.clock().install(); // Clock機能を有効化
  });

  afterEach(() => {
    jasmine.clock().uninstall(); // Clock機能を無効化
  });

  it('should execute callback after specified delay', () => {
    let callbackExecuted = false;
    
    timerService.scheduleCallback('test', () => {
      callbackExecuted = true;
    }, 1000);

    expect(callbackExecuted).toBe(false);
    
    jasmine.clock().tick(999);  // 999ms進める
    expect(callbackExecuted).toBe(false);
    
    jasmine.clock().tick(1);    // 1ms進める（計1000ms）
    expect(callbackExecuted).toBe(true);
  });
});
```

### 6.2 現在時刻をモックする

**実装コード**

```typescript
class DateTimeService {
  getCurrentDateTime(): Date {
    return new Date();
  }

  isBusinessHour(): boolean {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 9 && hour < 18;
  }

  getTimeUntilMidnight(): number {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - now.getTime();
  }

  formatCurrentTime(): string {
    const now = this.getCurrentDateTime();
    return now.toLocaleString('ja-JP');
  }
}
```

**テストコード**

```typescript
describe('DateTimeService', () => {
  let service: DateTimeService;
  const mockDate = new Date(2023, 5, 15, 10, 30, 0); // 2023年6月15日 10:30:00

  beforeEach(() => {
    service = new DateTimeService();
    jasmine.clock().install();
    jasmine.clock().mockDate(mockDate); // 現在時刻をモック
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should return mocked current time', () => {
    const currentTime = service.getCurrentDateTime();
    expect(currentTime.getTime()).toBe(mockDate.getTime());
  });

  it('should correctly identify business hours', () => {
    // 10:30は営業時間内
    expect(service.isBusinessHour()).toBe(true);
    
    // 時刻を変更してテスト
    jasmine.clock().mockDate(new Date(2023, 5, 15, 20, 0, 0)); // 20:00
    expect(service.isBusinessHour()).toBe(false);
  });
});
```

### 6.3 複雑なタイマー処理のテスト

**実装コード**

```typescript
class RetryService {
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        // 指数バックオフで再試行
        await this.delay(delay * Math.pow(2, attempt - 1));
      }
    }
    throw new Error('Should not reach here');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async batchProcess<T>(
    items: T[],
    processor: (item: T) => Promise<void>,
    batchSize: number = 5,
    delayBetweenBatches: number = 100
  ): Promise<void> {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await Promise.all(batch.map(processor));
      
      if (i + batchSize < items.length) {
        await this.delay(delayBetweenBatches);
      }
    }
  }
}
```

**テストコード**

```typescript
describe('RetryService with Clock', () => {
  let retryService: RetryService;

  beforeEach(() => {
    retryService = new RetryService();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should retry with exponential backoff', async () => {
    let attempts = 0;
    const mockOperation = jasmine.createSpy('operation').and.callFake(async () => {
      attempts++;
      if (attempts < 3) {
        throw new Error(`Attempt ${attempts} failed`);
      }
      return 'success';
    });

    const promise = retryService.executeWithRetry(mockOperation);
    
    // 最初の試行は即座に実行される
    expect(attempts).toBe(1);
    
    // 最初のリトライ（1秒後）
    jasmine.clock().tick(1000);
    await Promise.resolve(); // マイクロタスクを処理
    expect(attempts).toBe(2);
    
    // 二回目のリトライ（2秒後）
    jasmine.clock().tick(2000);
    await Promise.resolve();
    expect(attempts).toBe(3);
    
    const result = await promise;
    expect(result).toBe('success');
  });

  it('should process batches with delay', async () => {
    const items = Array.from({length: 12}, (_, i) => i);
    const processor = jasmine.createSpy('processor').and.returnValue(Promise.resolve());

    const promise = retryService.batchProcess(items, processor, 5, 100);

    // 最初のバッチ（5個）は即座に処理
    await Promise.resolve();
    expect(processor).toHaveBeenCalledTimes(5);

    // 100ms後に次のバッチ
    jasmine.clock().tick(100);
    await Promise.resolve();
    expect(processor).toHaveBeenCalledTimes(10);

    // さらに100ms後に最後のバッチ
    jasmine.clock().tick(100);
    await Promise.resolve();
    expect(processor).toHaveBeenCalledTimes(12);
  });
});
```

---

## 7. 実践的なテストパターン

実際の開発でよく遭遇する複雑なシナリオのテストパターンを紹介します。

### 7.1 エラーハンドリングのテスト

**実装コード**

```typescript
class ApiClient {
  constructor(private baseUrl: string) {}

  async fetchUser(id: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${id}`);
      
      if (!response.ok) {
        throw new ApiError(
          response.status,
          `Failed to fetch user: ${response.statusText}`
        );
      }
      
      const data = await response.json();
      return this.validateUser(data);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Network error occurred');
    }
  }

  private validateUser(data: any): User {
    if (!data.id || !data.name) {
      throw new ValidationError('Invalid user data');
    }
    return new User(data.id, data.name, data.email);
  }
}

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

**テストコード**

```typescript
describe('ApiClient Error Handling', () => {
  let apiClient: ApiClient;
  let mockFetch: jasmine.Spy;

  beforeEach(() => {
    apiClient = new ApiClient('https://api.example.com');
    mockFetch = jasmine.createSpy('fetch');
    (global as any).fetch = mockFetch;
  });

  it('should handle 404 error correctly', async () => {
    mockFetch.and.returnValue(Promise.resolve({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    }));

    try {
      await apiClient.fetchUser('nonexistent');
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).statusCode).toBe(404);
      expect(error.message).toContain('Failed to fetch user');
    }
  });

  it('should handle validation errors', async () => {
    mockFetch.and.returnValue(Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: null, name: '' })
    }));

    await expectAsync(apiClient.fetchUser('123'))
      .toBeRejectedWithError(ValidationError, 'Invalid user data');
  });

  it('should handle network errors', async () => {
    mockFetch.and.returnValue(Promise.reject(new Error('Network failure')));

    try {
      await apiClient.fetchUser('123');
      fail('Expected error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).statusCode).toBe(500);
      expect(error.message).toContain('Network error occurred');
    }
  });
});
```

### 7.2 状態管理のテスト

**実装コード**

```typescript
interface AppState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

class StateManager {
  private state: AppState = {
    user: null,
    loading: false,
    error: null
  };
  
  private subscribers: ((state: AppState) => void)[] = [];

  getState(): AppState {
    return { ...this.state };
  }

  setState(partialState: Partial<AppState>): void {
    this.state = { ...this.state, ...partialState };
    this.notifySubscribers();
  }

  subscribe(callback: (state: AppState) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this.getState());
      } catch (error) {
        console.error('Subscriber error:', error);
      }
    });
  }

  async loadUser(id: string, apiClient: ApiClient): Promise<void> {
    this.setState({ loading: true, error: null });
    
    try {
      const user = await apiClient.fetchUser(id);
      this.setState({ user, loading: false });
    } catch (error) {
      this.setState({ 
        loading: false, 
        error: error.message,
        user: null
      });
    }
  }
}
```

**テストコード**

```typescript
describe('StateManager', () => {
  let stateManager: StateManager;
  let mockApiClient: jasmine.SpyObj<ApiClient>;

  beforeEach(() => {
    stateManager = new StateManager();
    mockApiClient = jasmine.createSpyObj('ApiClient', ['fetchUser']);
  });

  it('should have initial state', () => {
    const state = stateManager.getState();
    expect(state.user).toBe(null);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should update state correctly', () => {
    const mockUser = new User('1', 'John Doe', 'john@example.com');
    
    stateManager.setState({ user: mockUser, loading: false });
    
    const state = stateManager.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
  });

  it('should notify subscribers on state changes', () => {
    const subscriber1 = jasmine.createSpy('subscriber1');
    const subscriber2 = jasmine.createSpy('subscriber2');
    
    stateManager.subscribe(subscriber1);
    stateManager.subscribe(subscriber2);
    
    stateManager.setState({ loading: true });
    
    expect(subscriber1).toHaveBeenCalledTimes(1);
    expect(subscriber2).toHaveBeenCalledTimes(1);
    expect(subscriber1).toHaveBeenCalledWith(jasmine.objectContaining({
      loading: true
    }));
  });

  it('should handle successful user loading', async () => {
    const mockUser = new User('1', 'John Doe', 'john@example.com');
    mockApiClient.fetchUser.and.returnValue(Promise.resolve(mockUser));
    
    await stateManager.loadUser('1', mockApiClient);
    
    const state = stateManager.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle user loading errors', async () => {
    const error = new Error('Failed to load user');
    mockApiClient.fetchUser.and.returnValue(Promise.reject(error));
    
    await stateManager.loadUser('1', mockApiClient);
    
    const state = stateManager.getState();
    expect(state.user).toBe(null);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to load user');
  });
});
```

### 7.3 統合テストパターン

**実装コード**

```typescript
class UserService {
  constructor(
    private apiClient: ApiClient,
    private stateManager: StateManager,
    private cacheService: CacheService
  ) {}

  async getUserProfile(id: string): Promise<User> {
    // キャッシュをチェック
    const cached = this.cacheService.get(`user:${id}`);
    if (cached) {
      return cached;
    }

    // 状態を更新してAPIからロード
    await this.stateManager.loadUser(id, this.apiClient);
    const state = this.stateManager.getState();
    
    if (state.error) {
      throw new Error(state.error);
    }
    
    if (!state.user) {
      throw new Error('User not found');
    }

    // キャッシュに保存
    this.cacheService.set(`user:${id}`, state.user, 300); // 5分間キャッシュ
    
    return state.user;
  }

  async refreshUserProfile(id: string): Promise<User> {
    this.cacheService.delete(`user:${id}`);
    return this.getUserProfile(id);
  }
}

class CacheService {
  private cache = new Map<string, { data: any; expires: number }>();

  get(key: string): any {
    const item = this.cache.get(key);
    if (!item || item.expires < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  set(key: string, data: any, ttlSeconds: number): void {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlSeconds * 1000
    });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}
```

**テストコード**

```typescript
describe('UserService Integration', () => {
  let userService: UserService;
  let mockApiClient: jasmine.SpyObj<ApiClient>;
  let stateManager: StateManager;
  let cacheService: CacheService;

  beforeEach(() => {
    mockApiClient = jasmine.createSpyObj('ApiClient', ['fetchUser']);
    stateManager = new StateManager();
    cacheService = new CacheService();
    userService = new UserService(mockApiClient, stateManager, cacheService);
    
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should load user and cache result', async () => {
    const mockUser = new User('1', 'John Doe', 'john@example.com');
    mockApiClient.fetchUser.and.returnValue(Promise.resolve(mockUser));

    const result = await userService.getUserProfile('1');
    
    expect(result).toEqual(mockUser);
    expect(mockApiClient.fetchUser).toHaveBeenCalledWith('1');
    
    // 二回目は キャッシュから取得
    const cachedResult = await userService.getUserProfile('1');
    expect(cachedResult).toEqual(mockUser);
    expect(mockApiClient.fetchUser).toHaveBeenCalledTimes(1); // API呼び出しは1回のみ
  });

  it('should refresh cache when requested', async () => {
    const originalUser = new User('1', 'John Doe', 'john@example.com');
    const updatedUser = new User('1', 'John Smith', 'johnsmith@example.com');
    
    mockApiClient.fetchUser.and.returnValues(
      Promise.resolve(originalUser),
      Promise.resolve(updatedUser)
    );

    // 最初の取得
    await userService.getUserProfile('1');
    
    // リフレッシュ
    const refreshedUser = await userService.refreshUserProfile('1');
    
    expect(refreshedUser).toEqual(updatedUser);
    expect(mockApiClient.fetchUser).toHaveBeenCalledTimes(2);
  });

  it('should handle cache expiration', async () => {
    const mockUser = new User('1', 'John Doe', 'john@example.com');
    mockApiClient.fetchUser.and.returnValue(Promise.resolve(mockUser));

    // 初回取得
    await userService.getUserProfile('1');
    expect(mockApiClient.fetchUser).toHaveBeenCalledTimes(1);

    // 5分経過（キャッシュ有効期限切れ）
    jasmine.clock().tick(301 * 1000);

    // 再取得（キャッシュ期限切れのため再度API呼び出し）
    await userService.getUserProfile('1');
    expect(mockApiClient.fetchUser).toHaveBeenCalledTimes(2);
  });
});
```

---

## 📝 まとめ

この記事では、Jasmineの基本的な機能から高度なテストパターンまでを網羅的に解説しました：

### ✅ 習得できた技術
- [x] **基本構文**: describe, it, expect の使い方
- [x] **セットアップ**: beforeEach, afterEach, beforeAll, afterAll
- [x] **非同期テスト**: async/await, Promise, timeout設定
- [x] **Spy機能**: spyOn, createSpy, createSpyObj による モック・スタブ
- [x] **Matcher**: デフォルトMatcherと カスタムMatcherの作成
- [x] **時間制御**: Clock機能による時間依存処理のテスト
- [x] **実践パターン**: エラーハンドリング、状態管理、統合テスト

### 🚀 次のステップ
- Angular での Component テスト
- TestBed を使ったDI テスト  
- E2E テスト との連携
- CI/CD パイプラインでのテスト自動化

### 💡 テスト作成のコツ
1. **テストケースは具体的で分かりやすい名前をつける**
2. **1つのテストは1つの機能のみをテストする**
3. **Given-When-Then パターンを意識する**
4. **エラーケースも積極的にテストする**
5. **モック・スタブを適切に活用して依存関係を分離する**

---

## 🤝 貢献とフィードバック

この記事に関するフィードバックや改善提案がございましたら、お気軽にコメントをお寄せください。

## 📚 参考資料

- [Jasmine公式ドキュメント](https://jasmine.github.io/)
- [Angular Testing Guide](https://angular.io/guide/testing)
- [TypeScript公式サイト](https://www.typescriptlang.org/)

---

*この記事は実際のプロジェクトでの経験を基に作成されています。より実践的な内容については、[GitHubリポジトリ](.) でサンプルコードをご確認ください。*