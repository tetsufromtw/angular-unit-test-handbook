import { TestBed } from '@angular/core/testing';
import { BasicSuiteComponent } from './basic-suite.component';

describe('BasicSuiteComponent', () => {
  let component: BasicSuiteComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicSuiteComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(BasicSuiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('A suite', () => {
    it('contains a spec with an expectation', () => {
      expect(true).toBe(true);
    });
  });

  describe('A suite is just a function', () => {
    let a: boolean;

    it('and so is a spec', () => {
      a = true;
      expect(a).toBe(true);
    });
  });

  describe("The 'toBe' matcher compares with ===", () => {
    it('and has a positive case', () => {
      expect(true).toBe(true);
    });

    it('and can have a negative case', () => {
      expect(false).not.toBe(true);
    });
  });

  describe('BasicSuiteComponent functionality', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have test suites defined', () => {
      expect(component['testSuites']).toBeDefined();
      expect(component['testSuites'].length).toBe(3);
    });

    it('should have code examples defined', () => {
      expect(component['codeExamples']).toBeDefined();
      expect(component['codeExamples'].basicSuite).toContain('describe');
      expect(component['codeExamples'].basicSuite).toContain('it');
      expect(component['codeExamples'].basicSuite).toContain('expect');
    });

    it('should execute demo test without error', () => {
      spyOn(console, 'log');
      component['executeDemoTest'](0, 0);
      
      setTimeout(() => {
        expect(console.log).toHaveBeenCalled();
      }, 150);
    });

    it('should run all tests without error', () => {
      spyOn(console, 'log');
      component['runAllTests']();
      expect(console.log).toHaveBeenCalledWith('実行所有基礎テスト...');
    });
  });
});