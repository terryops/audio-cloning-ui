import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const componentsDir = join(__dirname, '../components')
const serverCodesDir = join(__dirname, '../server/codes')

// 删除旧的 codes 目录
try {
  rmSync(serverCodesDir, { recursive: true, force: true })
} catch (err) {
  // 目录不存在
}

// 创建 server/codes 目录
mkdirSync(serverCodesDir, { recursive: true })

// 读取所有 .vue 文件并为每个生成单独的 .ts 文件
const files = readdirSync(componentsDir)
let count = 0

files.forEach(file => {
  if (file.endsWith('.vue')) {
    const filePath = join(componentsDir, file)
    const code = readFileSync(filePath, 'utf-8')

    // 转义代码字符串
    const escapedCode = code
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$/g, '\\$')

    // 生成对应的 TypeScript 文件
    const tsFileName = file.replace('.vue', '.ts')
    const tsFilePath = join(serverCodesDir, tsFileName)

    const tsContent = `// Auto-generated - ${file}
export default \`${escapedCode}\`
`

    writeFileSync(tsFilePath, tsContent)
    count++
  }
})

// 生成索引文件
const indexContent = `// Auto-generated index
${files.filter(f => f.endsWith('.vue')).map(file => {
  const name = file.replace('.vue', '')
  return `import ${name} from './${name}'`
}).join('\n')}

export const componentCodes: Record<string, string> = {
${files.filter(f => f.endsWith('.vue')).map(file => {
  const name = file.replace('.vue', '')
  return `  '${file}': ${name},`
}).join('\n')}
}
`

writeFileSync(join(serverCodesDir, 'index.ts'), indexContent)

console.log(`✓ Generated ${count} component code files`)
console.log(`✓ Output directory: ${serverCodesDir}`)
