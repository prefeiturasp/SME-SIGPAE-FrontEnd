import { dataPrioritaria } from "../../utilities";

//TODO: fazer iterando valores
describe("Teste data prioritária", () => {
  it("não é data prioritária", () => {
    expect(
      dataPrioritaria(
        "05/08/2019",
        new Date("2019-08-07"),
        new Date("2019-08-12")
      )
    ).toBe(false);
  });

  it("é data prioritária", () => {
    expect(
      dataPrioritaria(
        "09/08/2019",
        new Date("2019-08-07"),
        new Date("2019-08-12")
      )
    ).toBe(true);
  });

  it("não é data prioritária", () => {
    expect(
      dataPrioritaria(
        "12/08/2019",
        new Date("2019-08-07"),
        new Date("2019-08-12")
      )
    ).toBe(false);
  });
});
