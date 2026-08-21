// Confirma que os dois fluxos de compra (carrinho de Pronta Entrega e
// jornada de Encomenda) nunca compartilham import nem estado — exceto o
// reaproveitamento de tipo explicitamente sancionado pela TASK-01
// (Address, importado de @/app/cart/service/types, nunca duplicado).
import fs from 'fs'
import path from 'path'

const ALLOWED_TYPE_ONLY_IMPORT = "import { Address } from '@/app/cart/service/types'"

function listFilesRecursive(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap(entry => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return listFilesRecursive(fullPath)
    if (/\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.includes('.test.')) {
      return [fullPath]
    }
    return []
  })
}

function extractImportStatements(content: string): string[] {
  return content.match(/^import\s+[^;]+from\s+['"][^'"]+['"]/gm) ?? []
}

describe('Isolamento entre carrinho (Pronta Entrega) e jornada de Encomenda', () => {
  const cartDir = path.join(__dirname, '..', 'cart')
  const productionOrderDir = path.join(__dirname, '..', 'production-order')

  it('nenhum arquivo de src/app/production-order/** importa de src/app/cart/ (exceto o tipo Address, sancionado pela TASK-01)', () => {
    const offenders = listFilesRecursive(productionOrderDir).flatMap(file => {
      const content = fs.readFileSync(file, 'utf8')
      const cartImports = extractImportStatements(content).filter(
        line => /from ['"]@\/app\/cart\//.test(line) && line.trim() !== ALLOWED_TYPE_ONLY_IMPORT
      )
      return cartImports.map(line => `${file}: ${line}`)
    })

    expect(offenders).toEqual([])
  })

  it('nenhum arquivo de src/app/cart/** importa de src/app/production-order/', () => {
    const offenders = listFilesRecursive(cartDir).flatMap(file => {
      const content = fs.readFileSync(file, 'utf8')
      const imports = extractImportStatements(content).filter(line =>
        /from ['"]@\/app\/production-order\//.test(line)
      )
      return imports.map(line => `${file}: ${line}`)
    })

    expect(offenders).toEqual([])
  })

  it('nenhum arquivo de src/app/production-order/** referencia useCartStore/useCartStepsStore em código executável', () => {
    const offenders = listFilesRecursive(productionOrderDir).flatMap(file => {
      const content = fs.readFileSync(file, 'utf8')
      const codeOnly = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
      return /useCartStore|useCartStepsStore/.test(codeOnly) ? [file] : []
    })

    expect(offenders).toEqual([])
  })

  it('nenhum arquivo de src/app/cart/** referencia useProductionOrderStore em código executável', () => {
    const offenders = listFilesRecursive(cartDir).flatMap(file => {
      const content = fs.readFileSync(file, 'utf8')
      const codeOnly = content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
      return /useProductionOrderStore/.test(codeOnly) ? [file] : []
    })

    expect(offenders).toEqual([])
  })

  it('useProductionOrderStore e useCartStepsStore persistem sob chaves de localStorage distintas', () => {
    const productionOrderZustand = fs.readFileSync(
      path.join(productionOrderDir, 'zustand', 'zustand.tsx'),
      'utf8'
    )
    const cartZustand = fs.readFileSync(
      path.join(cartDir, 'zustand', 'zustand.tsx'),
      'utf8'
    )

    expect(productionOrderZustand).toMatch(/production_order_state/)
    expect(cartZustand).toMatch(/cart_state/)
  })
})
