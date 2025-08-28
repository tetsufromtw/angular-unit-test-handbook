export interface TestResult {
  testName: string;
  description: string;
  expected: any;
  actual: any;
  passed: boolean;
  errorMessage?: string;
}

export interface TestSuite {
  suiteName: string;
  description: string;
  tests: TestResult[];
  setupCode?: string;
  teardownCode?: string;
}

export interface TestExecution {
  suites: TestSuite[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  executionTime: number;
}