import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BasicSuiteComponent } from './components/basic-tests/basic-suite.component';
import { SharedSetupComponent } from './components/shared-setup/shared-setup.component';
import { AsyncTestsComponent } from './components/async-tests/async-tests.component';
import { SpyTestsComponent } from './components/spy-tests/spy-tests.component';
import { MatcherTestsComponent } from './components/matcher-tests/matcher-tests.component';
import { ClockTestsComponent } from './components/clock-tests/clock-tests.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BasicSuiteComponent, SharedSetupComponent, AsyncTestsComponent, SpyTestsComponent, MatcherTestsComponent, ClockTestsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Jasmine Unit Test Practice';
}
