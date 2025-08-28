import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrismService {
  private prism: any;

  constructor() {
    this.loadPrism();
  }

  private async loadPrism(): Promise<void> {
    if (typeof window !== 'undefined') {
      try {
        const Prism = await import('prismjs');
        
        // 必要な言語サポートをロード - TypeScript エラーを回避するために any 型を使用
        await (import('prismjs/components/prism-javascript' as any));
        await (import('prismjs/components/prism-typescript' as any));
        
        this.prism = Prism.default || Prism;
      } catch (error) {
        console.warn('Failed to load PrismJS:', error);
      }
    }
  }

  async highlightCode(code: string, language: string = 'typescript'): Promise<string> {
    if (!this.prism) {
      await this.loadPrism();
    }

    if (!this.prism) {
      return this.escapeHtml(code); // fallback if prism fails to load
    }

    try {
      const grammar = this.prism.languages[language] || this.prism.languages['javascript'];
      if (grammar) {
        return this.prism.highlight(code, grammar, language);
      }
      return this.escapeHtml(code);
    } catch (error) {
      console.warn('PrismJS highlighting failed:', error);
      return this.escapeHtml(code);
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  highlightElement(element: HTMLElement): void {
    if (this.prism && typeof this.prism.highlightElement === 'function') {
      this.prism.highlightElement(element);
    }
  }

  highlightAll(): void {
    if (this.prism && typeof this.prism.highlightAll === 'function') {
      this.prism.highlightAll();
    }
  }
}