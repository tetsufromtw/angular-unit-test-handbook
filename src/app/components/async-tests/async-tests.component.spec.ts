import { TestBed } from '@angular/core/testing';
import { AsyncTestsComponent } from './async-tests.component';

describe('AsyncTestsComponent', () => {
  let component: AsyncTestsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsyncTestsComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AsyncTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // SPEC.md の非同期テストに対応
  describe('Using async/await', () => {
    let value: number;

    beforeEach(async () => {
      await soon();
      value = 0;
    });

    it('supports async execution of test preparation and expectations', async () => {
      await soon();
      value++;
      expect(value).toBeGreaterThan(0);
    });

    function soon(): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1);
      });
    }
  });

  describe('long asynchronous specs', () => {
    beforeEach(async () => {
      await somethingSlow();
    }, 1000);

    it('takes a long time', async () => {
      await somethingReallySlow();
    }, 10000);

    afterEach(async () => {
      await somethingSlow();
    }, 1000);

    async function somethingSlow(): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100); // テスト時間を短縮
      });
    }

    async function somethingReallySlow(): Promise<void> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 200); // テスト時間を短縮
      });
    }
  });

  describe('AsyncTestsComponent functionality', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have async test cases defined', () => {
      expect(component['asyncTestCases']).toBeDefined();
      expect(component['asyncTestCases'].length).toBe(2);
    });

    it('should run async test', async () => {
      await component['runAsyncTest'](0);
      expect(component['asyncTestCases'][0].completed).toBe(true);
    });

    it('should create timeout example', () => {
      const example = component['createTimeoutExample']();
      expect(example).toContain('describe');
      expect(example).toContain('500');
      expect(example).toContain('5000');
    });

    it('should create promise example', () => {
      const example = component['createPromiseExample']();
      expect(example).toContain('.then');
      expect(example).toContain('.catch');
    });
  });
});