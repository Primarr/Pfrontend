import { describe, expect, it } from "vitest";
import {
  formatAmount,
  isStellarContractId,
  isStellarPublicKey,
  shortenAddress,
  stellar,
} from "./stellar";

describe("stellar helpers", () => {
  it("accepts a G-strkey public key", () => {
    expect(
      isStellarPublicKey("GDZST3XVCDTUJ76ZAV2HA72KYFL3JCPBHQ4PXESVXHMZQ5MDDG2WXYUP")
    ).toBe(true);
  });

  it("rejects short or wrong-prefix keys", () => {
    expect(isStellarPublicKey("GSHORT")).toBe(false);
    expect(isStellarPublicKey("not-a-key")).toBe(false);
    expect(isStellarPublicKey("")).toBe(false);
  });

  it("validates C-strkey contract ids", () => {
    expect(
      isStellarContractId("CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABSC4")
    ).toBe(true);
    expect(
      isStellarContractId("GDZST3XVCDTUJ76ZAV2HA72KYFL3JCPBHQ4PXESVXHMZQ5MDDG2WXYUP")
    ).toBe(false);
  });

  it("formats amounts and shortens addresses", () => {
    expect(formatAmount(1.5)).toBe("1.5");
    expect(shortenAddress("GDZST3XVCDTUJ76ZAV2HA72KYFL3JCPBHQ4PXESVXHMZQ5MDDG2WXYUP")).toContain(
      "…"
    );
  });

  it("defaults to testnet horizon", () => {
    expect(stellar.network).toBe("testnet");
    expect(stellar.horizonUrl).toContain("horizon");
  });
});
