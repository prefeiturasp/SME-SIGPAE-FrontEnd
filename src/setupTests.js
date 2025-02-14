import { jestPreviewConfigure } from "jest-preview";

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
});
