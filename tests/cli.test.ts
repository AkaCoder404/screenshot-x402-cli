import { exec } from "node:child_process";
import { promisify } from "node:util";
import { describe, it, expect } from "vitest";
import { join } from "node:path";

const execAsync = promisify(exec);
const cliPath = join(process.cwd(), "src", "index.ts");
const cmd = `npx tsx ${cliPath}`;

describe("screenshot-x402-cli", () => {
  it("should display usage when run without arguments", async () => {
    try {
      await execAsync(cmd);
      expect.fail("Expected CLI to exit with code 1");
    } catch (err: any) {
      expect(err.code).toBe(1);
      expect(err.stdout).toContain("screenshot-x402-cli v");
      expect(err.stdout).toContain("screenshot-x402 health");
    }
  });

  it("should display usage when run with --help", async () => {
    const { stdout } = await execAsync(`${cmd} --help`);
    expect(stdout).toContain("screenshot-x402-cli v");
    expect(stdout).toContain("screenshot-x402 health");
  });

  it("should attempt connection and fail if no server is running (health command)", async () => {
    try {
      await execAsync(`${cmd} health --mcp-url http://localhost:9999/mcp`);
      expect.fail("Expected connection to fail");
    } catch (err: any) {
      expect(err.code).toBe(1);
      expect(err.stderr).toContain("Connecting to http://localhost:9999/mcp");
      expect(err.stderr).toContain("fetch failed"); // Node.js native fetch error
    }
  });
});
