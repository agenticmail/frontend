/**
 * Mention parser for the @agenticmail GitHub App.
 *
 * Extracted into its own module so it's import-able from both the webhook
 * function and the unit-test suite. Per design.md §7.1:
 *   - first-mention-wins, case-insensitive trigger
 *   - verb is the first token after the mention
 *   - args are the rest of that line
 *
 * Verb buckets:
 *   FREE_VERBS  — pure-read + LLM-reply, available to everyone.
 *   PAID_VERBS  — state-changing GitHub actions, gated by plan check.
 *   help        — synthetic verb returned when an unknown token follows
 *                 the mention. Triggers a usage comment, no agent call.
 */

export const FREE_VERBS = ["summarize", "triage", "email", "reply", "handoff", "link"] as const;
export const PAID_VERBS = ["close", "merge", "review"] as const;
export const VALID_VERBS = new Set<string>([...FREE_VERBS, ...PAID_VERBS]);
export const PAID_VERB_SET = new Set<string>(PAID_VERBS);

export type Verb = typeof FREE_VERBS[number] | typeof PAID_VERBS[number] | "help";

export interface MentionCommand {
  verb: Verb;
  args: string;
}

export function parseMention(body: string): MentionCommand | null {
  if (!body || !body.toLowerCase().includes("@agenticmail")) return null;
  const lines = body.split("\n");
  for (const line of lines) {
    const m = line.match(/(^|\s)@agenticmail\b\s*(.*)/i);
    if (!m) continue;
    const rest = (m[2] || "").trim();
    // Bare @agenticmail with no following token → default to summarize.
    // Most users discover the bot this way; defaulting to "help" would be
    // pedantic. They get value immediately.
    if (rest.length === 0) return { verb: "summarize", args: "" };
    const tokens = rest.split(/\s+/);
    const first = tokens[0].toLowerCase();
    if (VALID_VERBS.has(first)) {
      let args = tokens.slice(1).join(" ").trim();
      // "handoff to <name>" → strip the leading "to"
      if (first === "handoff" && args.toLowerCase().startsWith("to ")) {
        args = args.slice(3).trim();
      }
      return { verb: first as Verb, args };
    }
    // Unknown verb after the mention → return "help" so the handler can post
    // a usage comment instead of silently defaulting to summarize. This is
    // a v2 change from the original behavior (which defaulted to summarize
    // and confused first-time users who mistyped a verb).
    return { verb: "help", args: rest };
  }
  return null;
}

export function helpMessage(): string {
  return [
    `👋 **\`@agenticmail\` commands:**`,
    ``,
    `**Free:**`,
    `- \`@agenticmail summarize\` — 2-paragraph summary of the thread`,
    `- \`@agenticmail triage\` — suggest labels, priority, similar issues`,
    `- \`@agenticmail email <addr>\` — send the thread to a real inbox`,
    `- \`@agenticmail reply <prompt>\` — draft a follow-up comment`,
    `- \`@agenticmail handoff to <agent>\` — re-route to another agent`,
    `- \`@agenticmail link related\` — find related issues`,
    ``,
    `**Paid plan:**`,
    `- \`@agenticmail close [not planned]\` — close the issue or PR`,
    `- \`@agenticmail merge [squash|rebase|merge]\` — merge the PR (default: squash)`,
    `- \`@agenticmail review\` — post a formal PR review`,
    ``,
    `Bare \`@agenticmail\` with no verb runs **summarize**.`,
    ``,
    `— [AgenticMail](https://agenticmail.io) · help`,
  ].join("\n");
}
