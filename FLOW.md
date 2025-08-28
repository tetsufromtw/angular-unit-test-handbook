# Angular Unit Test Practice - 工作流程

## 專案目標

基於提供的 Jasmine 單元測試規範，創建對應的 Angular 元件與網頁，以教學式的方式展示各種測試概念。

## 專案架構設計

### 檔案結構規劃

```
src/app/
├── components/
│   ├── basic-tests/              # 基礎測試概念
│   │   ├── basic-suite.component.ts
│   │   ├── basic-suite.component.html
│   │   ├── basic-suite.component.scss
│   │   └── basic-suite.component.spec.ts
│   ├── shared-setup/             # 共享設置測試
│   │   ├── shared-setup.component.ts
│   │   ├── shared-setup.component.html
│   │   ├── shared-setup.component.scss
│   │   └── shared-setup.component.spec.ts
│   ├── async-tests/              # 異步測試
│   │   ├── async-tests.component.ts
│   │   ├── async-tests.component.html
│   │   ├── async-tests.component.scss
│   │   └── async-tests.component.spec.ts
│   ├── spy-tests/                # Spy 測試
│   │   ├── spy-tests.component.ts
│   │   ├── spy-tests.component.html
│   │   ├── spy-tests.component.scss
│   │   └── spy-tests.component.spec.ts
│   ├── matcher-tests/            # Matcher 測試
│   │   ├── matcher-tests.component.ts
│   │   ├── matcher-tests.component.html
│   │   ├── matcher-tests.component.scss
│   │   └── matcher-tests.component.spec.ts
│   └── clock-tests/              # 時間相關測試
│       ├── clock-tests.component.ts
│       ├── clock-tests.component.html
│       ├── clock-tests.component.scss
│       └── clock-tests.component.spec.ts
├── services/
│   ├── foo.service.ts           # 測試用服務
│   ├── foo.service.spec.ts
│   ├── tape.service.ts          # 錄音機模擬服務
│   └── tape.service.spec.ts
└── models/
    ├── test-result.model.ts     # 測試結果模型
    └── timer-callback.model.ts  # 計時器回調模型
```

## 工作流程步驟

### Phase 1: 專案基礎設置 (預估時間: 15 分鐘)

#### Step 1.1: 檢查專案結構

- [ ] 確認 Angular 專案已正確初始化
- [ ] 檢查 `package.json` 是否包含必要的測試相關依賴
- [ ] 確認 Jasmine 和 Karma 配置正確

#### Step 1.2: 建立基礎資料夾結構

- [ ] 創建 `src/app/components/` 目錄
- [ ] 創建 `src/app/services/` 目錄
- [ ] 創建 `src/app/models/` 目錄
- [ ] 為每個測試概念創建子目錄

#### Step 1.3: 創建共用模型

- [ ] 創建 `test-result.model.ts` - 定義測試結果介面
- [ ] 創建 `timer-callback.model.ts` - 定義計時器回調介面

### Phase 2: 基礎測試元件 (預估時間: 30 分鐘)

#### Step 2.1: BasicSuiteComponent (基礎測試套件)

對應測試：

- "A suite"
- "A suite is just a function"
- "The 'toBe' matcher compares with ==="

任務：

- [ ] 創建 `basic-suite.component.ts` - 實作基本測試邏輯
- [ ] 創建 `basic-suite.component.html` - 展示測試概念的 UI
- [ ] 創建 `basic-suite.component.scss` - 樣式設計
- [ ] 創建 `basic-suite.component.spec.ts` - 對應的單元測試

功能需求：

- [ ] 顯示什麼是測試套件 (describe)
- [ ] 顯示什麼是測試規格 (it)
- [ ] 展示 toBe 匹配器的正面和負面案例
- [ ] 提供互動式範例

### Phase 3: 共享設置測試元件 (預估時間: 45 分鐘)

#### Step 3.1: SharedSetupComponent (共享設置)

對應測試：

- "A suite with some shared setup"
- beforeEach, afterEach, beforeAll, afterAll 概念
- "this" 共享狀態
- "fail" 函數使用

任務：

- [ ] 創建 `shared-setup.component.ts`
- [ ] 創建 `shared-setup.component.html`
- [ ] 創建 `shared-setup.component.scss`
- [ ] 創建 `shared-setup.component.spec.ts`

功能需求：

- [ ] 展示生命週期鉤子的執行順序
- [ ] 模擬 foo 變數在不同階段的值變化
- [ ] 展示 this 上下文的隔離性
- [ ] 展示測試汚染的預防
- [ ] 提供 fail() 函數的使用範例

#### Step 3.2: 嵌套測試與跳過測試

任務：

- [ ] 實作嵌套 describe 的展示
- [ ] 實作 xdescribe (跳過測試套件) 的展示
- [ ] 實作 xit (跳過單個測試) 的展示
- [ ] 實作 pending() 函數的使用

### Phase 4: 異步測試元件 (預估時間: 40 分鐘)

#### Step 4.1: AsyncTestsComponent (異步測試)

對應測試：

- "Using async/await"
- "long asynchronous specs"

任務：

- [ ] 創建 `async-tests.component.ts`
- [ ] 創建 `async-tests.component.html`
- [ ] 創建 `async-tests.component.scss`
- [ ] 創建 `async-tests.component.spec.ts`

功能需求：

- [ ] 展示 async/await 在測試中的使用
- [ ] 模擬 Promise 相關的異步操作
- [ ] 展示長時間運行的異步測試
- [ ] 提供超時設置的範例
- [ ] 實作 `soon()` 和 `somethingSlow()` 模擬函數

### Phase 5: Spy 測試元件 (預估時間: 50 分鐘)

#### Step 5.1: FooService (測試用服務)

任務：

- [ ] 創建 `foo.service.ts` - 包含 setBar 方法
- [ ] 創建 `foo.service.spec.ts` - 對應的服務測試

#### Step 5.2: TapeService (錄音機模擬服務)

任務：

- [ ] 創建 `tape.service.ts` - 包含 play, pause, stop, rewind 方法
- [ ] 創建 `tape.service.spec.ts` - 對應的服務測試

#### Step 5.3: SpyTestsComponent (Spy 測試展示)

對應測試：

- "A spy"
- "A spy, when created manually"
- "Multiple spies, when created manually"

任務：

- [ ] 創建 `spy-tests.component.ts`
- [ ] 創建 `spy-tests.component.html`
- [ ] 創建 `spy-tests.component.scss`
- [ ] 創建 `spy-tests.component.spec.ts`

功能需求：

- [ ] 展示 spyOn() 的使用
- [ ] 展示手動創建 spy 的方法
- [ ] 展示 createSpyObj() 的使用
- [ ] 展示各種 spy 匹配器的使用

### Phase 6: Matcher 測試元件 (預估時間: 60 分鐘)

#### Step 6.1: MatcherTestsComponent (高級匹配器)

對應測試：

- "Matching with finesse"
- jasmine.any, jasmine.anything
- jasmine.objectContaining, jasmine.arrayContaining
- jasmine.stringMatching
- 自定義非對稱匹配器

任務：

- [ ] 創建 `matcher-tests.component.ts`
- [ ] 創建 `matcher-tests.component.html`
- [ ] 創建 `matcher-tests.component.scss`
- [ ] 創建 `matcher-tests.component.spec.ts`

功能需求：

- [ ] 展示 jasmine.any() 的各種用法
- [ ] 展示 jasmine.anything() 的使用場景
- [ ] 展示 jasmine.objectContaining() 的物件匹配
- [ ] 展示 jasmine.arrayContaining() 的陣列匹配
- [ ] 展示 jasmine.stringMatching() 的字串匹配
- [ ] 實作自定義非對稱匹配器範例

### Phase 7: 時間測試元件 (預估時間: 45 分鐘)

#### Step 7.1: ClockTestsComponent (時間相關測試)

對應測試：

- "Manually ticking the Jasmine Clock"
- setTimeout 和 setInterval 的測試
- "Mocking the Date object"

任務：

- [ ] 創建 `clock-tests.component.ts`
- [ ] 創建 `clock-tests.component.html`
- [ ] 創建 `clock-tests.component.scss`
- [ ] 創建 `clock-tests.component.spec.ts`

功能需求：

- [ ] 展示 jasmine.clock() 的安裝和卸載
- [ ] 模擬 setTimeout 的同步執行
- [ ] 模擬 setInterval 的同步執行
- [ ] 展示時間的手動推進
- [ ] 展示 Date 物件的模擬

### Phase 8: 主頁面整合 (預估時間: 30 分鐘)

#### Step 8.1: 更新主元件

任務：

- [ ] 更新 `app.html` - 創建一頁式的導航結構
- [ ] 更新 `app.scss` - 設計教學式的視覺風格
- [ ] 更新 `app.ts` - 整合所有子元件
- [ ] 更新 `app.routes.ts` - 如果需要路由配置

#### Step 8.2: 整體樣式設計

任務：

- [ ] 設計統一的程式碼展示區塊
- [ ] 設計測試結果的視覺化展示
- [ ] 創建響應式布局
- [ ] 添加語法高亮顯示

### Phase 9: 測試驗證 (預估時間: 30 分鐘)

#### Step 9.1: 執行所有測試

- [ ] 運行 `npm test` 確保所有測試通過
- [ ] 檢查測試覆蓋率
- [ ] 修正任何失敗的測試

#### Step 9.2: 功能測試

- [ ] 測試應用程式的完整流程
- [ ] 確認所有元件正確渲染
- [ ] 確認交互功能正常運作

### Phase 10: 文檔與優化 (預估時間: 20 分鐘)

#### Step 10.1: 代碼文檔

- [ ] 為所有元件添加適當的註釋
- [ ] 更新 README.md 說明應用程式功能
- [ ] 創建使用說明

#### Step 10.2: 效能優化

- [ ] 檢查是否有未使用的導入
- [ ] 優化元件的載入效能
- [ ] 確保程式碼符合 Angular 最佳實踐

## 預估總時間

總計約 5-6 小時的開發時間

## 注意事項

1. 每個元件都應該有清楚的命名，反映其對應的測試概念
2. 保持 FAANG 級別的程式碼品質標準
3. 確保每個步驟完成後進行測試驗證
4. 遵循 Angular 的最佳實踐和風格指南
5. 保持一頁式的設計，便於學習和理解

## 開始執行

建議按照 Phase 順序執行，每完成一個 Phase 就進行測試，確保品質後再進行下一個 Phase。
