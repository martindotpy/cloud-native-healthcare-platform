import { generateDtsBundle } from "dts-bundle-generator"
import { mkdirSync, writeFileSync } from "node:fs"

// Generate .d.ts bundle for the entire project
const targetFilePath = "./src/index.ts"
const tsconfigPath = "./tsconfig.json"

const [bundle] = generateDtsBundle(
  [
    {
      filePath: targetFilePath,
      output: { noBanner: true },
    },
  ],
  {
    preferredConfigPath: tsconfigPath,
  }
)

// Save the generated bundle to a file
mkdirSync("./dist", { recursive: true })
writeFileSync("./dist/index.d.ts", bundle!)
