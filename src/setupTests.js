import { jestPreviewConfigure } from "jest-preview";
import { getNotificacoes, getQtdNaoLidas } from "services/notificacoes.service";
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

jest.mock("services/notificacoes.service");

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

  mock.onGet("/usuarios/meus-dados/").reply(200, mockMeusDadosFornecedor);

  getNotificacoes.mockResolvedValue({
    data: {},
    status: 200,
  });

  getQtdNaoLidas.mockResolvedValue({
    data: {},
    status: 200,
  });
});

global.console = {
  ...console,
  // uncomment to ignore a specific log level
  //log: jest.fn(),
  //debug: jest.fn(),
  //info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
