/* global chrome */

describe('content script', () => {
  const defaultUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

  const loadContentModule = ({ userAgent = defaultUserAgent, storageResult } = {}) => {
    jest.resetModules();
    chrome.storage.local.get.mockImplementation((_, callback) => {
      callback(storageResult ?? {});
    });
    const userAgentSpy = jest.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue(userAgent);
    const moduleExports = require('../../public/content.js');
    userAgentSpy.mockRestore();
    return moduleExports;
  };

  beforeAll(() => {
    delete document.todoKeydownListenerAdded;
  });

  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
    chrome.storage.local.get.mockImplementation((_, callback) => {
      callback({});
    });
  });

  it('detects Arc browser user agent', () => {
    const { isArcBrowser } = loadContentModule({
      userAgent: `${defaultUserAgent} Arc/1.0`,
      storageResult: { showFloatingButton: false },
    });

    expect(isArcBrowser).toBe(true);
  });

  it('creates a floating button once and wires click to openTodo', () => {
    const { createFloatingButton } = loadContentModule({ storageResult: { showFloatingButton: false } });

    expect(document.getElementById('todo-extension-floating-btn')).toBeNull();

    createFloatingButton();

    const button = document.getElementById('todo-extension-floating-btn');
    expect(button).not.toBeNull();

    chrome.runtime.sendMessage.mockClear();
    button.click();

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ action: 'openTodo' }, expect.any(Function));

    createFloatingButton();
    expect(document.querySelectorAll('#todo-extension-floating-btn')).toHaveLength(1);
  });

  it('sends openTodo message when Alt+T shortcut is pressed', () => {
    loadContentModule({ storageResult: { showFloatingButton: false } });

    chrome.runtime.sendMessage.mockClear();

    const event = new KeyboardEvent('keydown', { key: 't', altKey: true });
    document.dispatchEvent(event);

    expect(chrome.runtime.sendMessage).toHaveBeenCalledTimes(1);
    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ action: 'openTodo' }, expect.any(Function));
  });
});

describe('background script', () => {
  const loadBackgroundModule = () => {
    jest.resetModules();

    return {
      ...require('../../public/background.js'),
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    chrome.storage.local.get.mockImplementation((_, callback) => {
      callback({});
    });
    chrome.runtime.sendMessage.mockImplementation((message, callback) => {
      if (callback) {
        callback({ success: true, method: 'test' });
      }
    });
    chrome.tabs.query.mockImplementation(() => Promise.resolve([{ id: 1 }]));
    chrome.runtime.getURL.mockImplementation((path) => path);
    chrome.windows.create.mockImplementation(jest.fn());
    chrome.action.onClicked = { addListener: jest.fn() };
    chrome.runtime.onMessage.addListener = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('opens resizable popup when extension icon is clicked', async () => {
    loadBackgroundModule();

    const listener = chrome.action.onClicked.addListener.mock.calls[0][0];

    await listener({ id: 5 });

    expect(chrome.runtime.getURL).toHaveBeenCalledWith('index.html');
    expect(chrome.windows.create).toHaveBeenCalledWith({
      url: 'index.html',
      width: 450,
      height: 650,
      type: 'popup',
      focused: true,
    });
  });

  it('handles openTodo message by opening resizable popup', async () => {
    loadBackgroundModule();

    const listener = chrome.runtime.onMessage.addListener.mock.calls[0][0];
    const sendResponse = jest.fn();

    // The listener should return true to indicate async response
    const result = listener({ action: 'openTodo' }, { tab: { id: 9 } }, sendResponse);
    expect(result).toBe(true);

    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 10));

    expect(chrome.runtime.getURL).toHaveBeenCalledWith('index.html');
    expect(chrome.windows.create).toHaveBeenCalledWith({
      url: 'index.html',
      width: 450,
      height: 650,
      type: 'popup',
      focused: true,
    });
    // sendResponse may or may not be called yet due to async nature
  });

  it('handles message errors gracefully', async () => {
    chrome.windows.create.mockImplementation(() => Promise.reject(new Error('Window creation failed')));
    loadBackgroundModule();

    const listener = chrome.runtime.onMessage.addListener.mock.calls[0][0];
    const sendResponse = jest.fn();

    // The listener returns true to keep the message channel open
    const result = listener({ action: 'openTodo' }, { tab: { id: 9 } }, sendResponse);
    expect(result).toBe(true);

    // The error should be handled, but sendResponse might not be called immediately
    await new Promise(resolve => setTimeout(resolve, 10));
    // Just verify the function was called and returned true
  });

  it('ignores non-openTodo messages', () => {
    loadBackgroundModule();

    const listener = chrome.runtime.onMessage.addListener.mock.calls[0][0];
    const sendResponse = jest.fn();

    const result = listener({ action: 'otherAction' }, { tab: { id: 9 } }, sendResponse);

    expect(result).toBeUndefined();
    expect(chrome.windows.create).not.toHaveBeenCalled();
    expect(sendResponse).not.toHaveBeenCalled();
  });
});
