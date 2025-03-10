import { jestPreviewConfigure } from "jest-preview";
import { APIMockVersion } from "mocks/apiVersionMock";
import mock from "services/_mock";
import { mockMeusDadosFornecedor } from "mocks/services/perfil.service/mockMeusDados";

jestPreviewConfigure({
  // Opt-in to automatic mode to preview failed test case automatically.
  autoPreview: true,
});

const { querySelector, matches } = window.Element.prototype;

window.Element.prototype.querySelector = function (selector) {
  try {
    return querySelector.call(this, selector);
  } catch (e) {
    return null;
  }
};

window.Element.prototype.matches = function (selector) {
  try {
    return matches.call(this, selector);
  } catch (e) {
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
