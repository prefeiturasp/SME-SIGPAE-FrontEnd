/* eslint-env jest */

import "@testing-library/jest-dom";
import { Blob } from "buffer";
import { jestPreviewConfigure } from "jest-preview";
import { APIMockVersion } from "src/mocks/apiVersionMock";
import { mockMeusDadosFornecedor } from "src/mocks/services/perfil.service/mockMeusDados";
import mock from "src/services/_mock";
import { TransformStream } from "stream/web";
import { TextDecoder, TextEncoder } from "util";
import "whatwg-fetch";

class MockBroadcastChannel {
  constructor() {}
  postMessage() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
}

if (typeof global.BroadcastChannel === "undefined") {
  global.BroadcastChannel = MockBroadcastChannel;
}

jestPreviewConfigure({
  // Opt-in to automatic mode to preview failed test case automatically.
  autoPreview: true,
});

jest.setTimeout(120000);

jest.mock("src/constants/viteEnv", () => ({
  viteEnv: {
    MODE: "test",
    VITE_API_URL: "http://localhost:8000",
    VITE_REFRESH_TOKEN_TIMEOUT: 3000,
    HOME: "/",
  },
}));

if (typeof global.TransformStream === "undefined") {
  global.TransformStream = TransformStream;
}

if (typeof global.TextEncoder === "undefined") {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === "undefined") {
  global.TextDecoder = TextDecoder;
}

if (typeof global.Blob === "undefined") {
  global.Blob = Blob;
}

const { querySelector, matches } = window.Element.prototype;

window.Element.prototype.querySelector = function (selector) {
  try {
    return querySelector.call(this, selector);
  } catch {
    return null;
  }
};

window.Element.prototype.matches = function (selector) {
  try {
    return matches.call(this, selector);
  } catch {
    return false;
  }
};

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  global.window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));

  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosFornecedor);

  mock.onGet("/api-version/").reply(200, APIMockVersion);
  mock.onGet("/notificacoes/").reply(200, {
    next: null,
    previous: null,
    count: 0,
    page_size: 4,
    results: [],
  });
  mock
    .onGet("/notificacoes/quantidade-nao-lidos/")
    .reply(200, { quantidade_nao_lidos: 0 });
});
