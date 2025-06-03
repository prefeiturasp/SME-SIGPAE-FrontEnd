import { jsx as _jsx } from "react/jsx-runtime";
export const BuildProviderTree = (providers) => {
  if (providers.length === 1) {
    return providers[0];
  }
  const A = providers.shift();
  const B = providers.shift();
  return BuildProviderTree([
    ({ children }) => _jsx(A, { children: _jsx(B, { children: children }) }),
    ...providers,
  ]);
};
