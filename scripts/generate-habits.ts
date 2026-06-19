import { writeFileSync } from "node:fs";
import path from "node:path";
import { loadHabits } from "@/scripts/lib/load-habits";

const OUT = path.join(process.cwd(), "lib", "habits", "habits.generated.json");

function main() {
  const { habits, errors } = loadHabits();
  if (errors.length) {
    console.error("Refusing to generate — CSV has structural errors:");
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    process.exit(1);
  }

  writeFileSync(OUT, JSON.stringify(habits, null, 2) + "\n", "utf-8");
  console.log(
    `✓ Generated ${habits.length} habits -> lib/habits/habits.generated.json`,
  );
}

main();
