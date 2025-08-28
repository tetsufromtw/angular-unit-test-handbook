import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrismService } from '../../services/prism.service';

@Component({
  selector: 'app-code-highlight',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="code-container">
      @if (title) {
        <div class="code-header">
          <span class="language-badge">{{ language }}</span>
          <span class="title">{{ title }}</span>
        </div>
      }
      <pre class="code-block" [class]="'language-' + language"><code 
        #codeElement 
        [class]="'language-' + language"
        [innerHTML]="highlightedCode"></code></pre>
    </div>
  `,
  styles: [`
    .code-container {
      background: white;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e1e8ed;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .code-header {
      background: linear-gradient(135deg, #4a90e2 0%, #5c7cfa 100%);
      color: white;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .language-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      text-transform: uppercase;
    }

    .title {
      flex: 1;
    }

    .code-block {
      background: #2d3748 !important;
      color: #e2e8f0;
      margin: 0;
      padding: 1.5rem;
      overflow-x: auto;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 0.85rem;
      line-height: 1.6;
      min-height: 200px;

      code {
        background: transparent !important;
        color: inherit;
        padding: 0;
        font-size: inherit;
        font-family: inherit;
      }
    }

    /* PrismJS Dark Theme Colors */
    :host ::ng-deep {
      .token.comment,
      .token.prolog,
      .token.doctype,
      .token.cdata {
        color: #8da1b9;
      }

      .token.punctuation {
        color: #e2e8f0;
      }

      .token.property,
      .token.tag,
      .token.boolean,
      .token.number,
      .token.constant,
      .token.symbol,
      .token.deleted {
        color: #ff8c94;
      }

      .token.selector,
      .token.attr-name,
      .token.string,
      .token.char,
      .token.builtin,
      .token.inserted {
        color: #98d8c8;
      }

      .token.operator,
      .token.entity,
      .token.url,
      .language-css .token.string,
      .style .token.string {
        color: #f7dc6f;
      }

      .token.atrule,
      .token.attr-value,
      .token.keyword {
        color: #bb9af7;
      }

      .token.function,
      .token.class-name {
        color: #7aa2f7;
      }

      .token.regex,
      .token.important,
      .token.variable {
        color: #ff9e64;
      }
    }
  `]
})
export class CodeHighlightComponent implements OnInit, AfterViewInit {
  @Input() code: string = '';
  @Input() language: string = 'typescript';
  @Input() title?: string;
  @ViewChild('codeElement') codeElement!: ElementRef<HTMLElement>;

  highlightedCode: string = '';

  constructor(private prismService: PrismService) {}

  async ngOnInit() {
    this.highlightedCode = await this.prismService.highlightCode(this.code, this.language);
  }

  ngAfterViewInit() {
    // 確保 DOM 更新後再次高亮
    setTimeout(() => {
      if (this.codeElement) {
        this.prismService.highlightElement(this.codeElement.nativeElement);
      }
    }, 0);
  }
}