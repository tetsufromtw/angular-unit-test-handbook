import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeHighlightComponent } from '../shared/code-highlight.component';

interface SpyTestCase {
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
  selector: 'app-spy-tests',
  standalone: true,
  imports: [CommonModule, CodeHighlightComponent],
  templateUrl: './spy-tests.component.html',
  styleUrl: './spy-tests.component.scss'
})
export class SpyTestsComponent {
  protected executionLog: string[] = [];

  protected spyTestCases: SpyTestCase[] = [
    {
      name: 'spyOn() の基本的な使い方',
      description: 'オブジェクトのメソッド呼び出しを監視し、呼び出しパラメータと回数を追跡可能',
      codeExample: {
        implementation: `// 計算機サービス
class Calculator {
  add(a: number, b: number): number {
    return a + b;
  }

  multiply(a: number, b: number): number {
    return a * b;
  }

  log(message: string): void {
    console.log(message);
  }
}

// ユーザーサービス、計算機に依存
class UserService {
  constructor(private calculator: Calculator) {}

  calculateTotal(values: number[]): number {
    this.calculator.log('合計計算を開始');
    return values.reduce((sum, val) => this.calculator.add(sum, val), 0);
  }
}`,
        test: `describe('Calculator Spy Tests', () => {
  let calculator: Calculator;
  let userService: UserService;

  beforeEach(() => {
    calculator = new Calculator();
    userService = new UserService(calculator);
  });

  it('should spy on calculator.add method', () => {
    spyOn(calculator, 'add').and.returnValue(10);
    
    const result = userService.calculateTotal([1, 2, 3]);
    
    expect(calculator.add).toHaveBeenCalled();
    expect(calculator.add).toHaveBeenCalledTimes(3);
    expect(result).toBe(10); // spy が固定値を返すため
  });

  it('should spy on log method', () => {
    spyOn(calculator, 'log');
    
    userService.calculateTotal([1, 2]);
    
    expect(calculator.log).toHaveBeenCalledWith('合計計算を開始');
  });
});`
      },
      isRunning: false,
      completed: false
    },
    {
      name: 'createSpy() 独立Spyを作成',
      description: '独立したspy関数を作成し、任意のオブジェクトに依存しない',
      codeExample: {
        implementation: `// イベントハンドラー
class EventManager {
  private handlers: Map<string, Function[]> = new Map();

  addEventListener(event: string, handler: Function): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  dispatchEvent(event: string, data?: any): void {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }

  removeEventListener(event: string, handler: Function): void {
    const handlers = this.handlers.get(event) || [];
    const index = handlers.indexOf(handler);
    if (index > -1) {
      handlers.splice(index, 1);
    }
  }
}`,
        test: `describe('EventManager with createSpy', () => {
  let eventManager: EventManager;
  let mockHandler: jasmine.Spy;

  beforeEach(() => {
    eventManager = new EventManager();
    mockHandler = jasmine.createSpy('mockHandler');
  });

  it('should call event handler when event is dispatched', () => {
    eventManager.addEventListener('test', mockHandler);
    eventManager.dispatchEvent('test', { message: 'Hello' });

    expect(mockHandler).toHaveBeenCalled();
    expect(mockHandler).toHaveBeenCalledWith({ message: 'Hello' });
    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('should handle multiple handlers', () => {
    const anotherHandler = jasmine.createSpy('anotherHandler');
    
    eventManager.addEventListener('test', mockHandler);
    eventManager.addEventListener('test', anotherHandler);
    eventManager.dispatchEvent('test');

    expect(mockHandler).toHaveBeenCalled();
    expect(anotherHandler).toHaveBeenCalled();
  });
});`
      },
      isRunning: false,
      completed: false
    },
    {
      name: 'createSpyObj() Spyオブジェクトを作成',
      description: '複数のspyメソッドを持つオブジェクトを作成、サービスのモック化によく使用',
      codeExample: {
        implementation: `// データサービスインターフェース
interface DataService {
  getData(id: string): Promise<any>;
  saveData(data: any): Promise<void>;
  deleteData(id: string): Promise<boolean>;
  validateData(data: any): boolean;
}

// ユーザーマネージャー、データサービスに依存
class UserManager {
  constructor(private dataService: DataService) {}

  async loadUser(id: string): Promise<any> {
    try {
      const userData = await this.dataService.getData(id);
      
      if (!this.dataService.validateData(userData)) {
        throw new Error('Invalid user data');
      }
      
      return userData;
    } catch (error) {
      console.error('Failed to load user:', error);
      throw error;
    }
  }

  async createUser(userData: any): Promise<void> {
    if (!this.dataService.validateData(userData)) {
      throw new Error('Invalid user data');
    }
    
    await this.dataService.saveData(userData);
  }
}`,
        test: `describe('UserManager with createSpyObj', () => {
  let userManager: UserManager;
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(() => {
    // 複数のspyメソッドを含むオブジェクトを作成
    mockDataService = jasmine.createSpyObj('DataService', [
      'getData',
      'saveData', 
      'deleteData',
      'validateData'
    ]);
    
    userManager = new UserManager(mockDataService);
  });

  it('should load user successfully', async () => {
    const mockUser = { id: '1', name: 'John' };
    
    mockDataService.getData.and.returnValue(Promise.resolve(mockUser));
    mockDataService.validateData.and.returnValue(true);

    const result = await userManager.loadUser('1');

    expect(mockDataService.getData).toHaveBeenCalledWith('1');
    expect(mockDataService.validateData).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should handle validation failure', async () => {
    mockDataService.getData.and.returnValue(Promise.resolve({}));
    mockDataService.validateData.and.returnValue(false);

    await expectAsync(userManager.loadUser('1')).toBeRejected();
    expect(mockDataService.validateData).toHaveBeenCalled();
  });
});`
      },
      isRunning: false,
      completed: false
    },
    {
      name: 'Spy 高度な使い方',
      description: 'callThrough、callFake、returnValues などの高度な機能を使用',
      codeExample: {
        implementation: `// HTTP クライアント
class HttpClient {
  private baseUrl = 'https://api.example.com';

  async get(endpoint: string): Promise<any> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`);
    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
    }
    return response.json();
  }

  async post(endpoint: string, data: any): Promise<any> {
    const response = await fetch(\`\${this.baseUrl}\${endpoint}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

// API サービス
class ApiService {
  constructor(private http: HttpClient) {}

  async getUsers(): Promise<any[]> {
    try {
      return await this.http.get('/users');
    } catch (error) {
      console.error('ユーザー取得に失敗:', error);
      return [];
    }
  }

  async retryRequest(endpoint: string, maxRetries = 3): Promise<any> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await this.http.get(endpoint);
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }
}`,
        test: `describe('Advanced Spy Usage', () => {
  let apiService: ApiService;
  let httpClient: HttpClient;

  beforeEach(() => {
    httpClient = new HttpClient();
    apiService = new ApiService(httpClient);
  });

  it('should use callThrough to call original method', async () => {
    spyOn(httpClient, 'get').and.callThrough();
    
    // 実際に元のメソッドを呼び出す（ただしテスト環境では失敗する）
    try {
      await apiService.getUsers();
    } catch (error) {
      // 失敗が予期される、実際のAPIがないため
    }
    
    expect(httpClient.get).toHaveBeenCalledWith('/users');
  });

  it('should use callFake to provide custom implementation', async () => {
    spyOn(httpClient, 'get').and.callFake((endpoint: string) => {
      if (endpoint === '/users') {
        return Promise.resolve([{ id: 1, name: 'Test User' }]);
      }
      return Promise.reject(new Error('Not found'));
    });

    const users = await apiService.getUsers();
    
    expect(users).toEqual([{ id: 1, name: 'Test User' }]);
    expect(httpClient.get).toHaveBeenCalledWith('/users');
  });

  it('should use returnValues for multiple calls', async () => {
    spyOn(httpClient, 'get').and.returnValues(
      Promise.reject(new Error('Server error')),
      Promise.reject(new Error('Still failing')),
      Promise.resolve({ success: true })
    );

    const result = await apiService.retryRequest('/test');
    
    expect(result).toEqual({ success: true });
    expect(httpClient.get).toHaveBeenCalledTimes(3);
  });

  it('should track call arguments and this context', () => {
    spyOn(httpClient, 'get').and.returnValue(Promise.resolve([]));
    
    apiService.getUsers();
    
    const spy = httpClient.get as jasmine.Spy;
    expect(spy.calls.count()).toBe(1);
    expect(spy.calls.argsFor(0)).toEqual(['/users']);
    expect(spy.calls.first().args).toEqual(['/users']);
  });
});`
      },
      isRunning: false,
      completed: false
    }
  ];

  protected runSpyTest(index: number): void {
    const testCase = this.spyTestCases[index];
    testCase.isRunning = true;
    testCase.completed = false;
    this.executionLog = [];

    this.executionLog.push(`実行開始: ${testCase.name}`);

    setTimeout(() => {
      this.executionLog.push('spy設定をモック...');
      
      setTimeout(() => {
        this.executionLog.push('テストロジックを実行...');
        
        setTimeout(() => {
          this.executionLog.push('spy呼び出しを検証...');
          
          setTimeout(() => {
            testCase.isRunning = false;
            testCase.completed = true;
            testCase.result = '✓ テスト合格 - Spy機能が正常に動作';
            this.executionLog.push('✓ テスト完了');
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  }

  protected runAllSpyTests(): void {
    this.executionLog = ['すべてのSpyテストの実行を開始...'];
    
    this.spyTestCases.forEach((testCase, index) => {
      testCase.isRunning = false;
      testCase.completed = false;
      testCase.result = undefined;
      
      setTimeout(() => {
        this.runSpyTest(index);
      }, index * 2000);
    });
  }

  protected createPropertySpyExample(): string {
    return `describe('Property Spy Example', () => {
  let obj: any;

  beforeEach(() => {
    obj = { 
      property: 'original value',
      getValue() { return this.property; }
    };
  });

  it('should spy on property getter', () => {
    spyOnProperty(obj, 'property', 'get').and.returnValue('spy value');
    
    expect(obj.property).toBe('spy value');
    expect(obj.getValue()).toBe('spy value');
  });

  it('should spy on property setter', () => {
    spyOnProperty(obj, 'property', 'set');
    
    obj.property = 'new value';
    
    expect(obj.property).not.toBe('new value'); // spyによってインターセプトされる
  });
});`;
  }

  protected createSpyTrackingExample(): string {
    return `describe('Spy Tracking Example', () => {
  let service: any;
  let spy: jasmine.Spy;

  beforeEach(() => {
    service = {
      method: (a: number, b: string) => \`\${a}: \${b}\`
    };
    spy = spyOn(service, 'method').and.callThrough();
  });

  it('should track spy calls in detail', () => {
    service.method(1, 'first');
    service.method(2, 'second');

    // 基本的な追跡
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(2);

    // 詳細な呼び出し情報
    expect(spy.calls.count()).toBe(2);
    expect(spy.calls.argsFor(0)).toEqual([1, 'first']);
    expect(spy.calls.argsFor(1)).toEqual([2, 'second']);
    
    // 最初と最後の呼び出し
    expect(spy.calls.first().args).toEqual([1, 'first']);
    expect(spy.calls.mostRecent().args).toEqual([2, 'second']);
    
    // すべての呼び出しのパラメータ
    expect(spy.calls.allArgs()).toEqual([
      [1, 'first'],
      [2, 'second']
    ]);
  });
});`;
  }
}