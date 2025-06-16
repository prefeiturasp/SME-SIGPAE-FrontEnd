import { validarCPF } from "../../utilities";

describe.each([
  ["57588740272", true],
  ["11111111111", false],
  ["38301662654", true],
  ["00000000000", false],
])(".validarCPF(%s, %b)", (cpf, expected) => {
  test(`returns ${expected}`, () => {
    expect(validarCPF(cpf)).toBe(expected);
  });
});
