import { describe, it, expect } from "vitest";
import {
  parseMention,
  FREE_VERBS,
  PAID_VERBS,
  helpMessage,
} from "./parse-mention.js";

describe("parseMention", () => {
  it("returns null for empty / undefined / non-mention input", () => {
    expect(parseMention("")).toBeNull();
    expect(parseMention("just a regular comment")).toBeNull();
    expect(parseMention("contains @agentmail typo")).toBeNull();
  });

  it("treats bare @agenticmail as summarize", () => {
    expect(parseMention("@agenticmail")).toEqual({ verb: "summarize", args: "" });
    expect(parseMention("hey @agenticmail what's up")).toEqual({
      verb: "help",
      args: "what's up",
    });
    expect(parseMention("@agenticmail  ")).toEqual({ verb: "summarize", args: "" });
  });

  it("is case-insensitive on the trigger and verb", () => {
    expect(parseMention("@AgenticMail SUMMARIZE")).toEqual({ verb: "summarize", args: "" });
    expect(parseMention("@AGENTICMAIL Triage")).toEqual({ verb: "triage", args: "" });
  });

  it("recognizes every free verb", () => {
    for (const verb of FREE_VERBS) {
      expect(parseMention(`@agenticmail ${verb}`)).toEqual({ verb, args: "" });
    }
  });

  it("recognizes every paid verb", () => {
    for (const verb of PAID_VERBS) {
      expect(parseMention(`@agenticmail ${verb}`)).toEqual({ verb, args: "" });
    }
  });

  it("captures args after the verb", () => {
    expect(parseMention("@agenticmail email ope@example.com")).toEqual({
      verb: "email",
      args: "ope@example.com",
    });
    expect(parseMention("@agenticmail reply please confirm by friday")).toEqual({
      verb: "reply",
      args: "please confirm by friday",
    });
  });

  it("strips 'to' from handoff args", () => {
    expect(parseMention("@agenticmail handoff to alice")).toEqual({
      verb: "handoff",
      args: "alice",
    });
    expect(parseMention("@agenticmail handoff TO bob carol")).toEqual({
      verb: "handoff",
      args: "bob carol",
    });
    // No "to" present → args left as-is
    expect(parseMention("@agenticmail handoff bob")).toEqual({
      verb: "handoff",
      args: "bob",
    });
  });

  it("returns help verb for unknown tokens (not silent summarize)", () => {
    expect(parseMention("@agenticmail wibble")).toEqual({
      verb: "help",
      args: "wibble",
    });
    expect(parseMention("@agenticmail destroy the codebase")).toEqual({
      verb: "help",
      args: "destroy the codebase",
    });
  });

  it("acts on the first mention only and only that line's args", () => {
    const body = [
      "Some intro text.",
      "@agenticmail summarize",
      "Then @agenticmail triage as well — should be ignored.",
    ].join("\n");
    expect(parseMention(body)).toEqual({ verb: "summarize", args: "" });
  });

  it("only reads the rest of the LINE containing the mention", () => {
    const body = [
      "@agenticmail close",
      "extra context that should NOT become args",
    ].join("\n");
    expect(parseMention(body)).toEqual({ verb: "close", args: "" });
  });

  it("requires word-boundary on the trigger (no substring matches)", () => {
    expect(parseMention("contact @agenticmailbot for help")).toBeNull();
    expect(parseMention("@agenticmailx")).toBeNull();
  });

  it("accepts mention at start of line, mid-line, after punctuation", () => {
    expect(parseMention("@agenticmail summarize")).toEqual({ verb: "summarize", args: "" });
    expect(parseMention("Hey @agenticmail summarize")).toEqual({ verb: "summarize", args: "" });
    // Trigger requires a non-word-char before @, so adjacent punctuation
    // counts only if it's whitespace separating them. "(@agenticmail …)"
    // shouldn't trigger because GitHub mentions on the same line work
    // by space delimiting.
    expect(parseMention(",@agenticmail summarize")).toBeNull();
  });

  it("collapses extra whitespace between verb and args", () => {
    expect(parseMention("@agenticmail   email     a@b.com")).toEqual({
      verb: "email",
      args: "a@b.com",
    });
  });

  it("merge arg parsing for merge methods (consumed downstream, but token in args)", () => {
    expect(parseMention("@agenticmail merge")).toEqual({ verb: "merge", args: "" });
    expect(parseMention("@agenticmail merge squash")).toEqual({ verb: "merge", args: "squash" });
    expect(parseMention("@agenticmail merge rebase")).toEqual({ verb: "merge", args: "rebase" });
  });
});

describe("helpMessage", () => {
  it("lists every free verb", () => {
    const msg = helpMessage();
    for (const verb of FREE_VERBS) {
      expect(msg).toContain(`@agenticmail ${verb}`);
    }
  });
  it("lists every paid verb", () => {
    const msg = helpMessage();
    for (const verb of PAID_VERBS) {
      expect(msg).toContain(`@agenticmail ${verb}`);
    }
  });
  it("ends with the AgenticMail footer", () => {
    expect(helpMessage()).toContain("— [AgenticMail](https://agenticmail.io)");
  });
});
