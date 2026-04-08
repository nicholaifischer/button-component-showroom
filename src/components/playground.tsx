"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Check, Copy, Droplet, Eye, LayoutGrid, Maximize, Minus, Plus, Settings2, Square, ChevronDown } from "lucide-react"

interface PlaygroundProps {
  title: string
  description: string
  code: string
  customCode?: string
  controls?: React.ReactNode
  codeReplacements?: Record<string, string>
  children?: React.ReactNode
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

function FigmaColorRow({ label, hex, setHex, opacity, setOpacity, icons }: { label: string, hex: string, setHex: (v: string) => void, opacity: number, setOpacity: (v: number) => void, icons: React.ReactNode }) {
  return (
    <div className="border-t border-white/5 py-4 px-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-xs tracking-wide text-white">{label}</div>
        <div className="flex gap-3 text-white/40">
          {icons}
        </div>
      </div>
      
      <div className="flex items-center group">
        <label className="relative h-5 w-5 rounded-[4px] border border-white/10 shrink-0 overflow-hidden cursor-pointer" style={{ backgroundColor: hex }}>
          <input type="color" className="absolute -inset-2 h-10 w-10 cursor-pointer opacity-0" value={hex.match(/^#[0-9a-fA-F]{6}$/) ? hex.slice(0, 7) : "#000000"} onChange={e => setHex(e.target.value)} />
        </label>
        <div className="ml-2 flex-1 flex bg-transparent group-hover:bg-[#2a2a2a] transition-colors rounded px-1.5 py-0.5 border border-transparent focus-within:bg-[#2a2a2a] focus-within:border-white/10">
          <input className="bg-transparent border-none outline-none w-full text-[11px] text-white font-mono uppercase" value={hex.replace('#','')} onChange={e => setHex('#' + e.target.value)} />
        </div>
        <div className="w-16 flex justify-end items-center bg-transparent group-hover:bg-[#2a2a2a] transition-colors rounded px-1.5 py-0.5 border border-transparent focus-within:bg-[#2a2a2a] text-[11px]">
          <input className="bg-transparent border-none outline-none w-8 text-right text-white" value={opacity} onChange={e => setOpacity(Number(e.target.value))} />
          <span className="text-white/40 ml-1">%</span>
        </div>
        <div className="flex items-center justify-end w-8 ml-2 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <Eye className="size-3.5" />
        </div>
      </div>
    </div>
  )
}

export function Playground({ title, description, code, customCode, controls, codeReplacements, children }: PlaygroundProps) {
  // Layout
  const [containerWidth, setContainerWidth] = React.useState("")
  const [containerHeight, setContainerHeight] = React.useState("")
  
  // Appearance
  const [containerOpacity, setContainerOpacity] = React.useState(100)
  const [radius, setRadius] = React.useState(0)
  
  // Fill (Button color)
  const [buttonColor, setButtonColor] = React.useState("#d9d9d9")
  const [buttonOpacity, setButtonOpacity] = React.useState(100)
  
  // Typography (Text color)
  const [textColor, setTextColor] = React.useState("#ffffff")
  const [textOpacity, setTextOpacity] = React.useState(100)

  // Stroke (Border color)
  const [borderColor, setBorderColor] = React.useState("#000000")
  const [borderOpacity, setBorderOpacity] = React.useState(100)

  // Custom Settings (Effects) mapped logically
  const [hoverScale, setHoverScale] = React.useState(1.02)
  const [activeScale, setActiveScale] = React.useState(0.97)
  const [ringThickness, setRingThickness] = React.useState(1) // px
  const [cardPadding, setCardPadding] = React.useState(1.25) // rem

  const resetDefaults = () => {
    setContainerWidth("")
    setContainerHeight("")
    setContainerOpacity(100)
    setRadius(0)
    setButtonColor("#d9d9d9")
    setButtonOpacity(100)
    setTextColor("#ffffff")
    setTextOpacity(100)
    setBorderColor("#000000")
    setBorderOpacity(100)
    setHoverScale(1.02)
    setActiveScale(0.97)
    setRingThickness(1)
    setCardPadding(1.25)
  }

  // Handle transparent hex via opacity
  const applyOpacity = (hex: string, op: number) => {
    const h = hex.replace('#', '')
    if (h.length === 6) {
      const alpha = Math.round((op / 100) * 255).toString(16).padStart(2, '0')
      return `#${h}${alpha !== 'ff' ? alpha : ''}`
    }
    return hex
  }

  const previewStyle = {
    "--radius": `${radius}px`,
    "--primary": applyOpacity(buttonColor, buttonOpacity),
    "--primary-foreground": applyOpacity(textColor, textOpacity),
    "--text-color": applyOpacity(textColor, textOpacity),
    "--ring": applyOpacity(borderColor, borderOpacity),
    "--hover-scale": hoverScale,
    "--active-scale": activeScale,
    "--ring-thickness": `${ringThickness}px`,
    "--card-active-scale": activeScale,
    "--card-ring-thickness": `${ringThickness === 0 ? 0 : ringThickness + 1}px`,
    "--card-padding": `${cardPadding}rem`,
    ...(controls && codeReplacements ? codeReplacements : {})
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

    const replacements = codeReplacements
    if (replacements) {
      for (const [key, value] of Object.entries(replacements)) {
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

          <TabsContent value="preview" className="flex-1 mt-4 relative">
            <div
              className="dark h-full min-h-[400px] flex items-center justify-center p-8 rounded-xl border border-border/40 bg-[#202020] transition-colors overflow-hidden"
            >
               <div 
                  className="flex items-center justify-center transition-all duration-300"
                  style={{ 
                    width: containerWidth ? `${containerWidth}px` : "100%", 
                    height: containerHeight ? `${containerHeight}px` : "100%", 
                    opacity: containerOpacity / 100 
                  }}
               >
                 <div style={previewStyle} className="w-full h-full flex items-center justify-center">
                   {children}
                 </div>
               </div>
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
      <div className="flex flex-col bg-[#1e1e1e] border border-border/40 rounded-xl overflow-hidden max-h-[calc(100vh-7rem)] font-sans text-sm text-[#cecece]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 shrink-0 bg-[#242424]">
          <h2 className="font-semibold text-[13px] tracking-tight text-white">Playground Settings</h2>
          <Button onClick={resetDefaults} variant="secondary" size="sm" className="h-[22px] px-2 text-[10px] uppercase font-bold tracking-wider">Reset</Button>
        </div>
        
        <div className="overflow-y-auto pb-6">
          {/* Layout */}
          <div className="py-4 px-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-xs tracking-wide text-white">Layout</div>
            </div>
            <div>
              <div className="text-[11px] text-white/40 mb-1.5">Dimensions</div>
              <div className="flex gap-2">
                 <div className="flex-1 flex bg-[#2a2a2a] hover:bg-[#333] transition-colors rounded items-center px-1.5 py-1 box-border border border-transparent focus-within:border-white/20">
                   <span className="text-[10px] text-white/30 mr-1.5 w-3 text-center">W</span>
                   <input className="bg-transparent border-none outline-none w-full text-[11px] text-white" value={containerWidth} onChange={e => setContainerWidth(e.target.value)} placeholder="Auto" />
                 </div>
                 <div className="flex-1 flex bg-[#2a2a2a] hover:bg-[#333] transition-colors rounded items-center px-1.5 py-1 box-border border border-transparent focus-within:border-white/20">
                   <span className="text-[10px] text-white/30 mr-1.5 w-3 text-center">H</span>
                   <input className="bg-transparent border-none outline-none w-full text-[11px] text-white" value={containerHeight} onChange={e => setContainerHeight(e.target.value)} placeholder="Auto" />
                 </div>
                 <div className="w-6 flex items-center justify-center shrink-0 border border-white/5 bg-[#2a2a2a] rounded cursor-pointer hover:bg-[#333]">
                   <Maximize className="size-3 text-white/40" />
                 </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="border-t border-white/5 py-4 px-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-xs tracking-wide text-white">Appearance</div>
              <div className="flex gap-3 text-white/40">
                <Eye className="size-3.5" />
                <Droplet className="size-3.5" />
              </div>
            </div>
            <div className="flex gap-2">
               <div className="flex-1">
                 <div className="text-[11px] text-white/40 mb-1.5">Opacity</div>
                 <div className="flex bg-[#2a2a2a] hover:bg-[#333] transition-colors rounded items-center px-1.5 py-1 box-border border border-transparent focus-within:border-white/20">
                   <span className="text-[10px] text-white/30 mr-1.5 shrink-0"><Settings2 className="size-3" /></span>
                   <input className="bg-transparent border-none outline-none w-full text-[11px] text-white" value={containerOpacity} onChange={e => setContainerOpacity(Number(e.target.value))} type="number" min="0" max="100" />
                   <span className="text-[10px] text-white/40 ml-1">%</span>
                 </div>
               </div>
               
               <div className="flex-1">
                 <div className="text-[11px] text-white/40 mb-1.5">Corner radius</div>
                 <div className="flex bg-[#2a2a2a] hover:bg-[#333] transition-colors rounded items-center px-1.5 py-1 box-border border border-transparent focus-within:border-white/20">
                   <span className="text-[10px] text-white/30 mr-1.5 shrink-0"><Square className="size-3" /></span>
                   <input className="bg-transparent border-none outline-none w-full text-[11px] text-white" value={radius} onChange={e => setRadius(Number(e.target.value))} type="number" min="0" />
                 </div>
               </div>
               
               <div className="w-6 flex items-end shrink-0 pb-[1px]">
                 <div className="w-full h-[22px] flex items-center justify-center border border-white/5 bg-[#2a2a2a] rounded cursor-pointer hover:bg-[#333]">
                   <Maximize className="size-3 text-white/40" />
                 </div>
               </div>
            </div>
          </div>

          <FigmaColorRow 
            label="Typography" 
            hex={textColor} setHex={setTextColor} 
            opacity={textOpacity} setOpacity={setTextOpacity} 
            icons={<><LayoutGrid className="size-3.5" /><Plus className="size-3.5" /></>} 
          />

          <FigmaColorRow 
            label="Fill" 
            hex={buttonColor} setHex={setButtonColor} 
            opacity={buttonOpacity} setOpacity={setButtonOpacity} 
            icons={<><LayoutGrid className="size-3.5" /><Plus className="size-3.5" /></>} 
          />
          
          {/* Stroke */}
          <div className="border-t border-white/5 py-4 px-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-xs tracking-wide text-white">Stroke</div>
              <div className="flex gap-3 text-white/40">
                <LayoutGrid className="size-3.5" />
                <Plus className="size-3.5" />
              </div>
            </div>
            
            <div className="flex items-center group mb-2">
              <label className="relative h-5 w-5 rounded-[4px] border border-white/10 shrink-0 overflow-hidden cursor-pointer" style={{ backgroundColor: borderColor }}>
                <input type="color" className="absolute -inset-2 h-10 w-10 cursor-pointer opacity-0" value={borderColor.match(/^#[0-9a-fA-F]{6}$/) ? borderColor.slice(0, 7) : "#000000"} onChange={e => setBorderColor(e.target.value)} />
              </label>
              <div className="ml-2 flex-1 flex bg-transparent group-hover:bg-[#2a2a2a] transition-colors rounded px-1.5 py-0.5 border border-transparent focus-within:bg-[#2a2a2a] focus-within:border-white/10">
                <input className="bg-transparent border-none outline-none w-full text-[11px] text-white font-mono uppercase" value={borderColor.replace('#','')} onChange={e => setBorderColor('#' + e.target.value)} />
              </div>
              <div className="w-16 flex justify-end items-center bg-transparent group-hover:bg-[#2a2a2a] transition-colors rounded px-1.5 py-0.5 border border-transparent focus-within:bg-[#2a2a2a] text-[11px]">
                <input className="bg-transparent border-none outline-none w-8 text-right text-white" value={borderOpacity} onChange={e => setBorderOpacity(Number(e.target.value))} />
                <span className="text-white/40 ml-1">%</span>
              </div>
              <div className="flex items-center justify-end w-8 ml-2 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <Eye className="size-3.5" />
                <Minus className="size-3.5 ml-1.5" />
              </div>
            </div>
            
            {/* Added details for stroke specifically */}
            <div className="flex gap-2 mt-2">
               <div className="w-24">
                 <div className="text-[11px] text-white/40 mb-1.5">Position</div>
                 <div className="flex bg-[#2a2a2a] hover:bg-[#333] transition-colors rounded items-center px-2 py-1 box-border border border-transparent focus-within:border-white/20 relative">
                   <select className="bg-transparent border-none outline-none w-full text-[11px] text-white appearance-none cursor-pointer">
                     <option>Inside</option>
                     <option>Center</option>
                     <option>Outside</option>
                   </select>
                   <ChevronDown className="size-3 text-white/40 absolute right-2 pointer-events-none" />
                 </div>
               </div>
               
               <div className="flex-1">
                 <div className="text-[11px] text-white/40 mb-1.5">Weight</div>
                 <div className="flex bg-[#2a2a2a] hover:bg-[#333] transition-colors rounded items-center px-1.5 py-1 box-border border border-transparent focus-within:border-white/20">
                   <span className="text-[10px] text-white/30 mr-1.5 shrink-0"><Check className="size-3" /></span>
                   <input className="bg-transparent border-none outline-none w-full text-[11px] text-white" value={ringThickness} onChange={e => setRingThickness(Number(e.target.value))} type="number" min="0" />
                   <span className="text-[10px] text-white/40 ml-1">px</span>
                 </div>
               </div>
               <div className="w-14 shrink-0 pb-[1px] flex items-end">
                 <div className="w-full flex items-center justify-around h-[22px] px-1 text-white/40">
                    <Settings2 className="size-3.5 cursor-pointer hover:text-white" />
                    <Square className="size-3.5 cursor-pointer hover:text-white" />
                 </div>
               </div>
            </div>
          </div>

          {/* Effects */}
          <div className="border-t border-white/5 py-4 px-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-xs tracking-wide text-white">Effects</div>
              <div className="flex gap-3 text-white/40">
                <Plus className="size-3.5 cursor-pointer hover:text-white" />
              </div>
            </div>
            
            <div className="pt-2 space-y-5 border-l border-white/10 pl-3 ml-[6px]">
               {/* Hover Scale */}
               <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <Label className="text-[11px] text-white/80 font-normal">Hover Scale Lift</Label>
                   <span className="text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded">
                     {hoverScale.toFixed(2)}x
                   </span>
                 </div>
                 <Slider
                   value={[hoverScale]} max={1.1} min={1.0} step={0.01}
                   onValueChange={(v: number | readonly number[]) => setHoverScale(Array.isArray(v) ? v[0] : v)}
                 />
               </div>

               {/* Press Scale */}
               <div className="space-y-2">
                 <div className="flex items-center justify-between">
                   <Label className="text-[11px] text-white/80 font-normal">Active Press Scale</Label>
                   <span className="text-[10px] text-muted-foreground font-mono px-1.5 py-0.5 rounded">
                     {activeScale.toFixed(2)}x
                   </span>
                 </div>
                 <Slider
                   value={[activeScale]} max={1.0} min={0.9} step={0.01}
                   onValueChange={(v: number | readonly number[]) => setActiveScale(Array.isArray(v) ? v[0] : v)}
                 />
               </div>
            </div>
          </div>

          {/* COMPONENT PROPS */}
          {controls && (
            <div className="border-t border-white/5 py-4 px-4 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div className="font-semibold text-xs tracking-wide text-white">Component Props</div>
              </div>
              <div className="space-y-5 border-l border-white/10 pl-3 ml-[6px]">
                {controls}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
