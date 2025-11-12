// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.chrome = {
  runtime: {
    sendMessage: jest.fn((message, callback) => {
      if (callback) {
        callback({ success: true, method: 'test' });
      }
    }),
    onMessage: {
      addListener: jest.fn(),
    },
    getURL: jest.fn((path) => path),
    onInstalled: {
      addListener: jest.fn(),
    },
  },
  storage: {
    local: {
      get: jest.fn((keys, callback) => {
        callback({});
      }),
      set: jest.fn(),
    },
  },
  tabs: {
    query: jest.fn(() => Promise.resolve([{ id: 1 }])),
  },
  windows: {
    create: jest.fn(),
  },
  sidePanel: {
    setOptions: jest.fn(() => Promise.resolve()),
    open: jest.fn(() => Promise.resolve()),
    setPanelBehavior: jest.fn(() => Promise.resolve()),
  },
  action: {
    onClicked: {
      addListener: jest.fn(),
    },
  },
};
