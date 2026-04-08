import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Check, Copy } from "lucide-react"

interface PlaygroundProps {
  title: string
  description: string
  code: string
  customCode?: string
  controls?: React.ReactNode
  children: React.ReactNode
}

function getContrastForeground(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) || 0
  const g = parseInt(hex.slice(3, 5), 16) || 0
  const b = parseInt(hex.slice(5, 7), 16) || 0
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128 ? "oklch(0.12 0 0)" : "oklch(0.985 0 0)"
}
function CopyCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false)

  const onCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative h-full min-h-[400px] rounded-xl border border-border/40 bg-[#202020] p-5 overflow-auto group">
      <button
        onClick={onCopy}
        className="absolute top-4 right-4 px-2.5 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-zinc-300 transition-colors flex items-center gap-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100"
        title="Copy code"
      >
        {copied ? (
          <>
            <Check className="size-3.5 text-green-400" />
            <span className="text-xs font-medium text-green-400">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="size-3.5" />
            <span className="text-xs font-medium">Copy</span>
          </>
        )}
      </button>
      <pre className="text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
        <code>{code}</code>
      </pre>
    </div>
  )
}

export function Playground({ title, description, code, customCode, controls, children }: PlaygroundProps) {
  const [radius, setRadius] = React.useState(0.625)
  const [themeColor, setThemeColor] = React.useState("#ffffff")
  
  // Custom Settings
  const [hoverScale, setHoverScale] = React.useState(1.02)
  const [activeScale, setActiveScale] = React.useState(0.97)
  const [ringThickness, setRingThickness] = React.useState(1) // px
  const [cardPadding, setCardPadding] = React.useState(1.25) // rem

  const resetDefaults = () => {
    setThemeColor("#ffffff")
    setRadius(0.625)
    setHoverScale(1.02)
    setActiveScale(0.97)
    setRingThickness(1)
    setCardPadding(1.25)
  }

  const previewStyle = {
    "--radius": `${radius}rem`,
    "--primary": themeColor,
    "--primary-foreground": getContrastForeground(themeColor),
    "--ring": themeColor,
    "--hover-scale": hoverScale,
    "--active-scale": activeScale,
    "--ring-thickness": `${ringThickness}px`,
    "--card-active-scale": activeScale,
    "--card-ring-thickness": `${ringThickness === 0 ? 0 : ringThickness + 1}px`,
    "--card-padding": `${cardPadding}rem`,
    ...(controls ? (props as any).codeReplacements : {})
  } as React.CSSProperties

  const processCode = (rawCode: string) => {
    if (!rawCode) return rawCode
    let processed = rawCode
      .replace(/var\(--hover-scale,[^)]+\)/g, String(hoverScale))
      .replace(/var\(--active-scale,[^)]+\)/g, String(activeScale))
      .replace(/var\(--ring-thickness,[^)]+\)/g, `${ringThickness}px`)
      .replace(/var\(--card-active-scale,[^)]+\)/g, String(activeScale))
      .replace(/var\(--card-ring-thickness,[^)]+\)/g, `${ringThickness === 0 ? 0 : ringThickness + 1}px`)
      .replace(/var\(--card-padding,[^)]+\)/g, `${cardPadding}rem`)

    const replacements = (props as any).codeReplacements as Record<string, string>
    if (replacements) {
      for (const [key, value] of Object.entries(replacements)) {
        // Find exact var assignments matching the key to replace them entirely with the value
        // Pattern: var(--my-key, fallback)
        // Fallback can contain nested parens like hsl(...) so we match until the last closing paren using greedy matching where safe, or just do specific replacements.
        // Easiest robust approach for nested is to escape the string if possible, or just inject CSS vars in previewStyle and NOT strip them in the string.
        // For simplicity, we just inject the CSS variables onto the live playground component, so we don't have to string replace ALL of them.
      }
    }
    return processed
  }

  const finalCode = processCode(code)
  const finalCustomCode = customCode ? processCode(customCode) : undefined

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 h-full">
      {/* Main preview area */}
      <div className="flex flex-col space-y-4 min-w-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        </div>

        <Tabs defaultValue="preview" className="flex-1 flex flex-col">
          <TabsList className="w-fit">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Usage Code</TabsTrigger>
            {customCode && <TabsTrigger value="customCode">Source Code</TabsTrigger>}
          </TabsList>

          <TabsContent value="preview" className="flex-1 mt-4">
            <div
              className="dark h-full min-h-[400px] flex items-center justify-center p-8 rounded-xl border border-border/40 bg-[#202020] transition-colors"
              style={previewStyle}
            >
              {children}
            </div>
          </TabsContent>

          <TabsContent value="code" className="flex-1 mt-4">
            <CopyCodeBlock code={finalCode} />
          </TabsContent>

          {customCode && (
            <TabsContent value="customCode" className="flex-1 mt-4">
              <CopyCodeBlock code={finalCustomCode!} />
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Settings sidebar */}
      <div className="flex flex-col space-y-8 overflow-y-auto max-h-[calc(100vh-7rem)] pr-1 pb-10">
        <div>
          <h2 className="font-semibold text-lg tracking-tight mb-6">Playground Settings</h2>
          
          <div className="space-y-8">
            {/* GLOBAL */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  Global
                </h3>
                <button 
                  onClick={resetDefaults} 
                  className="text-[10px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-5 border-l-2 border-border/40 pl-4 ml-1">
                {/* Theme Color */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Theme Color</Label>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="relative h-8 w-12 overflow-hidden rounded-md border border-border">
                      <input
                        type="color"
                        value={themeColor.match(/^#[0-9a-fA-F]{6}$/) ? themeColor : "#ffffff"}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="absolute -inset-2 h-12 w-16 cursor-pointer border-0 p-0"
                      />
                    </div>
                    <Input
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      maxLength={7}
                      placeholder="#FFFFFF"
                      className="h-8 flex-1 font-mono text-xs uppercase"
                    />
                  </div>
                </div>

                {/* Border Radius */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Border Radius</Label>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                      {radius}rem
                    </span>
                  </div>
                  <Slider
                    value={[radius]}
                    max={2}
                    min={0}
                    step={0.125}
                    onValueChange={(v: number | readonly number[]) =>
                      setRadius(Array.isArray(v) ? v[0] : v)
                    }
                  />
                </div>
              </div>
            </div>

            {/* CUSTOM SETTINGS */}
            <div>
              <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-4">
                Custom Settings
              </h3>
              <div className="space-y-5 border-l-2 border-border/40 pl-4 ml-1">
                {/* Hover Scale */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Hover Scale Lift</Label>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                      {hoverScale.toFixed(2)}x
                    </span>
                  </div>
                  <Slider
                    value={[hoverScale]}
                    max={1.1}
                    min={1.0}
                    step={0.01}
                    onValueChange={(v: number | readonly number[]) =>
                      setHoverScale(Array.isArray(v) ? v[0] : v)
                    }
                  />
                </div>

                {/* Press Scale */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Active Press Scale</Label>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                      {activeScale.toFixed(2)}x
                    </span>
                  </div>
                  <Slider
                    value={[activeScale]}
                    max={1.0}
                    min={0.9}
                    step={0.01}
                    onValueChange={(v: number | readonly number[]) =>
                      setActiveScale(Array.isArray(v) ? v[0] : v)
                    }
                  />
                </div>

                {/* Ring Thickness */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Ring Border Line</Label>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                      {ringThickness}px
                    </span>
                  </div>
                  <Slider
                    value={[ringThickness]}
                    max={4}
                    min={0}
                    step={1}
                    onValueChange={(v: number | readonly number[]) =>
                      setRingThickness(Array.isArray(v) ? v[0] : v)
                    }
                  />
                </div>

                {/* Padding */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Structural Padding</Label>
                    <span className="text-[10px] text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">
                      {cardPadding * 16}px
                    </span>
                  </div>
                  <Slider
                    value={[cardPadding]}
                    max={3}
                    min={0.5}
                    step={0.25}
                    onValueChange={(v: number | readonly number[]) =>
                      setCardPadding(Array.isArray(v) ? v[0] : v)
                    }
                  />
                </div>
              </div>
            </div>

            {/* COMPONENT PROPS */}
            {controls && (
              <div>
                <h3 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-4">
                  Component Props
                </h3>
                <div className="space-y-5 border-l-2 border-border/40 pl-4 ml-1">
                  {controls}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

