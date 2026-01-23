import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const componentsDir = join(__dirname, '../components')
const outputDir = join(__dirname, '../public')
const outputFile = join(outputDir, 'component-codes.json')

// 确保 public 目录存在
try {
  mkdirSync(outputDir, { recursive: true })
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
    componentCodes[file] = code
  }
})

// 写入 JSON 文件
writeFileSync(outputFile, JSON.stringify(componentCodes, null, 2))
console.log(`✓ Generated component codes: ${Object.keys(componentCodes).length} files`)
