import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const componentsDir = join(__dirname, '../components')
const serverUtilsDir = join(__dirname, '../server/utils')
const outputFile = join(serverUtilsDir, 'component-codes.ts')

// 确保 server/utils 目录存在
try {
  mkdirSync(serverUtilsDir, { recursive: true })
} catch (err) {
  // 目录已存在
}

// 读取所有 .vue 文件
const componentCodes = {}

const files = readdirSync(componentsDir)
files.forEach(file => {
  if (file.endsWith('.vue')) {
    const filePath = join(componentsDir, file)
    const code = readFileSync(filePath, 'utf-8')
    // 转义字符串中的反引号和反斜杠
    componentCodes[file] = code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
  }
})

// 生成 TypeScript 文件
const tsContent = `// Auto-generated file - do not edit manually
// Generated at: ${new Date().toISOString()}

export const componentCodes: Record<string, string> = {
${Object.entries(componentCodes).map(([filename, code]) =>
  `  '${filename}': \`${code}\`,`
).join('\n')}
}
`

writeFileSync(outputFile, tsContent)
console.log(`✓ Generated component codes: ${Object.keys(componentCodes).length} files`)
console.log(`✓ Output: ${outputFile}`)
