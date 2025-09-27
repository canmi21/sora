# i18n System Documentation

A file-router inspired internationalization system for Next.js with SSR support and hidden locale detection.

## Overview

This i18n system works similar to Next.js file routing - you organize translations by namespace files and access them using dot notation. It supports both server and client components with automatic locale detection.

## Supported Languages

- `und` (Original/Raw) - Custom language using `<html lang="und">`
- `en-US` (English - United States)
- `en-GB` (English - United Kingdom)
- `zh-CN` (Chinese - Simplified)
- `zh-HK` (Chinese - Hong Kong)
- `es-ES` (Spanish)
- `fr-FR` (French)
- `ja-JP` (Japanese)

## Translation File Structure

Translation files are stored in `src/locales/` with the following structure:

```json
{
	"section": {
		"subsection": {
			"key": {
				"raw": "Original Text",
				"en_US": "English Text",
				"en_GB": "British Text",
				"zh_CN": "中文文本",
				"zh_HK": "繁體文本",
				"es_ES": "Texto en español",
				"fr_FR": "Texte français",
				"ja_JP": "日本語テキスト"
			}
		}
	}
}
```

### Example: `src/locales/footer.json`

```json
{
	"button": {
		"sitemap": {
			"raw": "Site Structure",
			"en_US": "Sitemap",
			"en_GB": "Site Map",
			"zh_CN": "网站地图",
			"zh_HK": "網站地圖",
			"es_ES": "Mapa del sitio",
			"fr_FR": "Plan du site",
			"ja_JP": "サイトマップ"
		},
		"subscribe": {
			"raw": "Get Updates",
			"en_US": "Subscribe",
			"en_GB": "Subscribe",
			"zh_CN": "订阅",
			"zh_HK": "訂閱",
			"es_ES": "Suscribirse",
			"fr_FR": "S'abonner",
			"ja_JP": "購読"
		}
	}
}
```

## Usage

### Server Components

```typescript
import { createServerTranslator } from '~/providers/i18n-server'

export default async function MyServerComponent() {
  const t = await createServerTranslator()

  return (
    <div>
      <h1>{t('navigation.title.home')}</h1>
      <button>{t('footer.button.sitemap')}</button>
    </div>
  )
}
```

### Client Components

```typescript
'use client'

import { useTranslation } from '~/providers/i18n-client'
import { useEffect, useState } from 'react'

export default function MyClientComponent() {
  const { tSync, locale } = useTranslation()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Pre-load necessary translation namespaces
    Promise.all([
      fetch('/i18n/navigation'),
      fetch('/i18n/footer')
    ]).then(() => setIsLoaded(true))
      .catch(console.error)
  }, [])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>{tSync('navigation.title.home')}</h1>
      <button>{tSync('footer.button.sitemap')}</button>
      <p>Current language: {locale}</p>
    </div>
  )
}
```

### Language Switcher

```typescript
'use client'

import { useI18n } from '~/providers/i18n-client'
import { SUPPORTED_LOCALES, getHtmlLang } from '~/providers/i18n'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale)
    document.documentElement.lang = getHtmlLang(newLocale)
  }

  return (
    <select
      value={locale}
      onChange={(e) => handleLocaleChange(e.target.value as SupportedLocale)}
    >
      <option value="und">Original</option>
      <option value="en-US">English (US)</option>
      <option value="en-GB">English (UK)</option>
      <option value="zh-CN">简体中文</option>
      <option value="zh-HK">繁體中文 (香港)</option>
      <option value="es-ES">Español</option>
      <option value="fr-FR">Français</option>
      <option value="ja-JP">日本語</option>
    </select>
  )
}
```

## Translation Key Format

Use dot notation to access nested translations:

```text
{namespace}.{section}.{subsection}.{key}
```

Examples:

- `footer.button.sitemap` → `src/locales/footer.json` → `button.sitemap`
- `navigation.menu.main.home` → `src/locales/navigation.json` → `menu.main.home`
- `common.actions.save` → `src/locales/common.json` → `actions.save`

## Fallback Logic

The system uses the following fallback order:

1. **Current locale** (e.g., `zh_CN`)
2. **Default English** (`en_US`)
3. **Original/Raw** (`raw`)
4. **Key itself** (if all above fail)

## Locale Detection

The system automatically detects locale from:

1. **Cookie** (`locale=en-US`) - highest priority
2. **Accept-Language header** - browser preference
3. **Default locale** (`en-US`) - fallback

For client-side detection, it also checks:

- **URL parameter** (`?lang=zh-CN`)
- **Browser language** (`navigator.language`)

## Setup Requirements

### 1. Install Dependencies

```bash
pnpm install next
# No additional dependencies required - uses built-in Next.js features
```

### 2. Setup Layout

```typescript
// app/layout.tsx
import { I18nProvider } from '~/providers/i18n-client'
import { getServerLocale, getHtmlLang } from '~/providers/i18n-server'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getServerLocale()

  return (
    <html lang={getHtmlLang(locale)}>
      <body>
        <I18nProvider initialLocale={locale}>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}
```

### 3. Create Translation Files

Create JSON files in `src/locales/` with the structure shown above.

## Best Practices

### 1. Pre-loading Translations

Always pre-load translation namespaces in client components before using `tSync()`.

### 2. Namespace Organization

- Use descriptive namespace names (`navigation`, `footer`, `common`)
- Group related translations together
- Keep files focused and not too large

### 3. Key Naming

- Use consistent naming conventions
- Use descriptive keys that indicate context
- Avoid overly deep nesting (max 3-4 levels)

### 4. Translation Management

- Always provide `raw` (original) and `en_US` translations
- Use the side-by-side structure for easy translation comparison
- Test fallback behavior by omitting translations

## API Endpoints

The system exposes translation data via:

```
GET /i18n/{namespace}
```

Example: `GET /i18n/footer` returns the contents of `src/locales/footer.json`
