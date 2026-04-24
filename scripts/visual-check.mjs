import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const baseUrl = 'http://127.0.0.1:3000'
const outputDir = path.resolve('.tmp/visual-check')

const viewports = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '375x812', width: 375, height: 812 },
]

const requestedViewports = process.env.VISUAL_VIEWPORTS
  ? new Set(
      process.env.VISUAL_VIEWPORTS.split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    )
  : null

const personas = [
  'Corretores & Imobiliárias',
  'Proprietários Rurais',
  'Investidores de Terras',
  'Advogados & Cartórios',
]

const heatmapIndexes = {
  AM: 2,
  MT: 16,
  SP: 23,
}

const consoleEntries = []

function serializeConsoleMessage(viewport, message) {
  const location = message.location()

  return {
    viewport,
    type: message.type(),
    text: message.text(),
    location: {
      url: location.url ?? null,
      lineNumber: location.lineNumber ?? null,
      columnNumber: location.columnNumber ?? null,
    },
  }
}

async function waitForSettled(page) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' })

  try {
    await page.waitForLoadState('networkidle', { timeout: 15000 })
  } catch {
    // Next dev can keep requests open; a short fixed wait is enough here.
  }

  await page.waitForTimeout(1200)
}

async function scrollToBottom(page) {
  let lastPosition = -1

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const metrics = await page.evaluate(() => ({
      scrollY: window.scrollY,
      innerHeight: window.innerHeight,
      scrollHeight: document.documentElement.scrollHeight,
    }))

    if (
      metrics.scrollY + metrics.innerHeight >= metrics.scrollHeight - 4 ||
      metrics.scrollY === lastPosition
    ) {
      break
    }

    lastPosition = metrics.scrollY

    await page.evaluate((step) => {
      window.scrollBy(0, step)
    }, Math.max(360, Math.floor(metrics.innerHeight * 0.82)))

    await page.waitForTimeout(500)
  }

  await page.waitForTimeout(500)
}

async function screenshotForWhoPanel(page) {
  const section = page.locator('section').filter({ hasText: 'Feito para quem trabalha com terra' }).first()

  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)

  const sectionBox = await section.boundingBox()

  if (!sectionBox) {
    throw new Error('Nao foi possivel localizar a secao ForWho para screenshot.')
  }

  const clip = {
    x: Math.max(0, sectionBox.x + sectionBox.width * 0.42),
    y: Math.max(0, sectionBox.y),
    width: Math.max(1, sectionBox.width * 0.58),
    height: Math.max(1, sectionBox.height),
  }

  for (let index = 0; index < personas.length; index += 1) {
    await page.getByRole('button', { name: personas[index], exact: true }).click()
    await page.waitForTimeout(500)
    await page.screenshot({
      path: path.join(outputDir, `forwho-${index + 1}.png`),
      clip,
    })
  }
}

async function screenshotHeatmapTooltips(page) {
  const section = page.locator('section').filter({ hasText: 'Presentes em todo o Brasil' }).first()
  const paths = section.locator('svg path')

  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)

  for (const [uf, index] of Object.entries(heatmapIndexes)) {
    await paths.nth(index).hover()
    await page.waitForTimeout(500)

    const tooltipText = section.locator('p').filter({ hasText: 'propriedades mapeadas' }).first()
    const tooltip = tooltipText.locator('xpath=ancestor::div[1]')

    await tooltip.screenshot({
      path: path.join(outputDir, `heatmap-${uf}.png`),
    })
  }
}

async function screenshotPricingBlock(page, viewportName) {
  const section = page.locator('section').filter({ hasText: 'Simples. Transparente. Sem surpresas.' }).first()

  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await section.screenshot({
    path: path.join(outputDir, `pricing-${viewportName}.png`),
  })
}

async function runViewport(browser, viewport) {
  const context = await browser.newContext({
    viewport: {
      width: viewport.width,
      height: viewport.height,
    },
    deviceScaleFactor: 1,
  })
  const page = await context.newPage()

  page.on('console', (message) => {
    if (message.type() === 'warning' || message.type() === 'error') {
      consoleEntries.push(serializeConsoleMessage(viewport.name, message))
    }
  })

  page.on('pageerror', (error) => {
    consoleEntries.push({
      viewport: viewport.name,
      type: 'pageerror',
      text: error.message,
      location: null,
    })
  })

  await waitForSettled(page)
  await scrollToBottom(page)

  await page.screenshot({
    path: path.join(outputDir, `${viewport.name}.png`),
    fullPage: true,
  })

  await screenshotPricingBlock(page, viewport.name)

  if (viewport.name === '1440x900') {
    await screenshotForWhoPanel(page)
    await screenshotHeatmapTooltips(page)
  }

  await context.close()
}

async function main() {
  await mkdir(outputDir, { recursive: true })

  const browser = await chromium.launch({
    headless: true,
  })

  try {
    for (const viewport of viewports) {
      if (requestedViewports && !requestedViewports.has(viewport.name)) {
        continue
      }
      await runViewport(browser, viewport)
    }
  } finally {
    await browser.close()
  }

  await writeFile(
    path.join(outputDir, 'console.json'),
    JSON.stringify(
      {
        baseUrl,
        generatedAt: new Date().toISOString(),
        entries: consoleEntries,
      },
      null,
      2,
    ),
    'utf8',
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
