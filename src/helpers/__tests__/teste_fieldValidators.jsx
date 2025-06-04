import { deveSerNoAnoCorrente } from "../fieldValidators";
import { anoCorrente } from "../../components/screens/Relatorios/helper";

describe("Teste mesmo ano corrente", () => {
  it("não é o mesmo ano corrente", () => {
    expect(deveSerNoAnoCorrente(`14/12/${anoCorrente() + 1}`)).toBe(
      "Deve ser no mesmo ano"
    );
  });

  it("é o mesmo ano corrente", () => {
    expect(deveSerNoAnoCorrente(`14/12/${anoCorrente()}`)).toBe(undefined);
  });

  it("é o mesmo ano corrente", () => {
    expect(deveSerNoAnoCorrente(`31/12/${anoCorrente()}`)).toBe(undefined);
  });

  it("não é o mesmo ano corrente", () => {
    expect(deveSerNoAnoCorrente(`14/12/${anoCorrente() + 1}`)).toBe(
      "Deve ser no mesmo ano"
    );
  });

  it("não é o mesmo ano corrente", () => {
    expect(deveSerNoAnoCorrente(`14/12/${anoCorrente() - 1}`)).toBe(
      "Deve ser no mesmo ano"
    );
  });
});
