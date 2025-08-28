import { TestBed } from '@angular/core/testing';
import { SharedSetupComponent } from './shared-setup.component';

describe('SharedSetupComponent', () => {
  let component: SharedSetupComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedSetupComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(SharedSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // SPEC.md のテストに対応
  describe('A suite with some shared setup', () => {
    let foo = 0;
    
    beforeEach(() => {
      foo += 1;
    });
    
    afterEach(() => {
      foo = 0;
    });
    
    beforeAll(() => {
      foo = 1;
    });
    
    afterAll(() => {
      foo = 0;
    });

    describe('A spec', () => {
      beforeEach(function() {
        (this as any).foo = 0;
      });

      it('can use the `this` to share state', function() {
        expect((this as any).foo).toEqual(0);
        (this as any).bar = "test pollution?";
      });

      it('prevents test pollution by having an empty `this` created for the next spec', function() {
        expect((this as any).foo).toEqual(0);
        expect((this as any).bar).toBe(undefined);
      });
    });

    describe('A spec using the fail function', () => {
      function foo(x: boolean, callBack: () => void) {
        if (x) {
          callBack();
        }
      }

      it('should not call the callBack', () => {
        foo(false, () => {
          fail('Callback has been called');
        });
      });
    });
  });

  describe('SharedSetupComponent functionality', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should have test scenarios defined', () => {
      expect(component['testScenarios']).toBeDefined();
      expect(component['testScenarios'].length).toBe(3);
    });

    it('should simulate lifecycle execution', () => {
      spyOn(console, 'log');
      component['simulateLifecycleExecution']();
      expect(component['executionLog']).toBeDefined();
    });

    it('should simulate this isolation', () => {
      component['simulateThisIsolation']();
      expect(component['executionLog']).toBeDefined();
    });

    it('should simulate fail function', () => {
      component['simulateFailFunction']();
      expect(component['executionLog']).toBeDefined();
    });

    it('should run nested describe example', () => {
      component['runNestedDescribeExample']();
      expect(component['executionLog']).toBeDefined();
    });
  });
});