import { describe, it, expect, afterEach } from "vitest";
import { androidCertFingerprints, assetLinks, ANDROID_PACKAGE_NAME } from "./android";

const KEY = "ANDROID_CERT_FINGERPRINTS";
const original = process.env[KEY];

afterEach(() => {
  if (original === undefined) delete process.env[KEY];
  else process.env[KEY] = original;
});

describe("android digital asset links", () => {
  it("parses a comma-separated fingerprint list, trimming and dropping blanks", () => {
    process.env[KEY] = " AA:BB , 11:22 ,, ";
    expect(androidCertFingerprints()).toEqual(["AA:BB", "11:22"]);
  });

  it("returns an empty statement list when no fingerprints are configured", () => {
    delete process.env[KEY];
    expect(assetLinks()).toEqual([]);
  });

  it("emits a valid handle_all_urls statement for the package + fingerprints", () => {
    process.env[KEY] = "AA:BB:CC,11:22:33";
    const [stmt] = assetLinks() as Array<Record<string, unknown>>;
    expect(stmt.relation).toEqual(["delegate_permission/common.handle_all_urls"]);
    const target = stmt.target as Record<string, unknown>;
    expect(target).toMatchObject({
      namespace: "android_app",
      package_name: ANDROID_PACKAGE_NAME,
      sha256_cert_fingerprints: ["AA:BB:CC", "11:22:33"],
    });
  });
});
