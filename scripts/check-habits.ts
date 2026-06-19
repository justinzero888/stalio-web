import { loadHabits } from "@/scripts/lib/load-habits";

const EXPECTED_COUNT = 54;

function main() {
  const { habits, errors, warnings } = loadHabits();

  console.log(`Loaded ${habits.length} habits from the consolidated CSV.`);

  if (habits.length !== EXPECTED_COUNT) {
    errors.push(
      `Expected ${EXPECTED_COUNT} habits, found ${habits.length}.`,
    );
  }

  const bundle = habits.filter((h) => h.isDefaultBundle).length;
  const groups = new Set(habits.map((h) => h.colorGroup));
  console.log(`  default-bundle: ${bundle}`);
  console.log(`  color groups:   ${[...groups].sort().join(", ")}`);

  // Summarise content gaps (PM TODO) without failing.
  const todoCounts: Record<string, number> = {};
  for (const w of warnings) {
    const m = w.match(/TODO-PM (\w+)/);
    if (m) todoCounts[m[1]] = (todoCounts[m[1]] ?? 0) + 1;
  }
  const todoKeys = Object.keys(todoCounts);
  if (todoKeys.length) {
    console.log("\nContent still awaiting PM (warnings, not failures):");
    for (const k of todoKeys) {
      console.log(`  ${todoCounts[k]}/${habits.length} rows missing ${k}`);
    }
  }

  const nonTodoWarnings = warnings.filter((w) => !w.includes("TODO-PM"));
  if (nonTodoWarnings.length) {
    console.log("\nWarnings:");
    nonTodoWarnings.forEach((w) => console.log(`  ! ${w}`));
  }

  if (errors.length) {
    console.error("\nERRORS:");
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }

  console.log("\n✓ Structural validation passed.");
}

main();
