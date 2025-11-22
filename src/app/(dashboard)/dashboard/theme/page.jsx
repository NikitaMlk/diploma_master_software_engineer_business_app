"use client"

import React, { useState } from 'react';
import { Plus, Trash2, Download, Upload, Copy, Eye, Settings, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const ThemeManager = () => {
  const [themes, setThemes] = useState([
    {
      id: 1,
      name: 'Light',
      colors: {
        background: '0 0% 100%',
        foreground: '222.2 47.4% 11.2%',
        card: '0 0% 100%',
        'card-foreground': '222.2 47.4% 11.2%',
        popover: '0 0% 100%',
        'popover-foreground': '222.2 47.4% 11.2%',
        primary: '222.2 47.4% 11.2%',
        'primary-foreground': '210 40% 98%',
        secondary: '210 40% 96.1%',
        'secondary-foreground': '222.2 47.4% 11.2%',
        accent: '210 40% 96.1%',
        'accent-foreground': '222.2 47.4% 11.2%',
        destructive: '0 100% 50%',
        'destructive-foreground': '210 40% 98%',
        border: '214.3 31.8% 91.4%',
        input: '214.3 31.8% 91.4%',
        ring: '222.2 47.4% 11.2%',
        muted: '210 40% 96.1%',
        'muted-foreground': '215.4 16.3% 46.9%',
        'scrollbar-thumb': '214 32% 91%',
        'scrollbar-track': '0 0% 95%',
        'scrollbar-border': '0 0% 100%'
      }
    },
    {
      id: 2,
      name: 'Dark',
      colors: {
        background: '0 0% 16%',
        foreground: '210 40% 98%',
        card: '0 0% 20%',
        'card-foreground': '210 40% 98%',
        popover: '0 0% 20%',
        'popover-foreground': '210 40% 98%',
        primary: '210 40% 98%',
        'primary-foreground': '222.2 47.4% 11.2%',
        secondary: '0 0% 20%',
        'secondary-foreground': '210 40% 98%',
        accent: '0 0% 20%',
        'accent-foreground': '210 40% 98%',
        destructive: '0 62.8% 30.6%',
        'destructive-foreground': '210 40% 98%',
        border: '0 0% 20%',
        input: '0 0% 20%',
        ring: '212.7 26.8% 83.9%',
        muted: '0 0% 20%',
        'muted-foreground': '215 20.2% 65.1%',
        'scrollbar-thumb': '0 0% 20%',
        'scrollbar-track': '0 0% 16%',
        'scrollbar-border': '0 0% 16%'
      }
    }
  ]);

  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [activeTab, setActiveTab] = useState('edit');

  const colorProperties = [
    'background', 'foreground', 'card', 'card-foreground', 'popover', 'popover-foreground',
    'primary', 'primary-foreground', 'secondary', 'secondary-foreground', 
    'accent', 'accent-foreground', 'destructive', 'destructive-foreground', 
    'border', 'input', 'ring', 'muted', 'muted-foreground', 
    'scrollbar-thumb', 'scrollbar-track', 'scrollbar-border'
  ];

  const addTheme = () => {
    const newTheme = {
      id: Date.now(),
      name: `Theme ${themes.length + 1}`,
      colors: { ...themes[0].colors }
    };
    setThemes([...themes, newTheme]);
    setSelectedTheme(newTheme);
  };

  const deleteTheme = (id) => {
    if (themes.length > 1) {
      const filtered = themes.filter(t => t.id !== id);
      setThemes(filtered);
      if (selectedTheme.id === id) {
        setSelectedTheme(filtered[0]);
      }
    }
  };

  const updateTheme = (updates) => {
    const updated = themes.map(t => 
      t.id === selectedTheme.id ? { ...t, ...updates } : t
    );
    setThemes(updated);
    setSelectedTheme({ ...selectedTheme, ...updates });
  };

  const updateColor = (property, value) => {
    const newColors = { ...selectedTheme.colors, [property]: value };
    updateTheme({ colors: newColors });
  };

  const generateCSS = () => {
    let css = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n`;
    
    themes.forEach((theme, index) => {
      const selector = index === 0 ? ':root' : `.theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}`;
      css += `  ${selector} {\n`;
      
      Object.entries(theme.colors).forEach(([property, value]) => {
        css += `    --${property}: ${value};\n`;
      });
      
      css += `    --radius: 0.5rem;\n`;
      css += `  }\n\n`;
    });
    
    css += `  * {\n    @apply border-border;\n  }\n\n`;
    css += `  body {\n`;
    css += `    @apply bg-background text-foreground;\n`;
    css += `    /* Ensure scrollbar always appears if content is scrollable */\n`;
    css += `    min-height: 100vh;\n`;
    css += `    overflow-y: scroll; /* Forces a vertical scrollbar for testing */\n`;
    css += `    overflow-x: hidden; /* Prevents horizontal scrollbar if not needed */\n\n`;
    css += `    /* Standard CSS properties (Firefox primarily) */\n`;
    css += `    scrollbar-color: hsl(var(--scrollbar-thumb)) hsl(var(--scrollbar-track));\n`;
    css += `    scrollbar-width: thin; /* auto, thin, none */\n`;
    css += `  }\n\n`;
    css += `  /* Webkit-specific styles (Chrome, Safari, Edge, Opera) */\n`;
    css += `  /* These must be defined directly, not nested within other selectors like 'body &' */\n`;
    css += `  html::-webkit-scrollbar,\n`;
    css += `  body::-webkit-scrollbar {\n`;
    css += `    width: 12px; /* Width of the vertical scrollbar */\n`;
    css += `    height: 8px; /* Height of the horizontal scrollbar */\n`;
    css += `  }\n\n`;
    css += `  html::-webkit-scrollbar-track,\n`;
    css += `  body::-webkit-scrollbar-track {\n`;
    css += `    background: hsl(var(--scrollbar-track));\n`;
    css += `    border-radius: 10px; /* Optional: rounded corners for the track */\n`;
    css += `  }\n\n`;
    css += `  html::-webkit-scrollbar-thumb,\n`;
    css += `  body::-webkit-scrollbar-thumb {\n`;
    css += `    background-color: hsl(var(--scrollbar-thumb));\n`;
    css += `    border-radius: 10px; /* Optional: rounded corners for the thumb */\n`;
    css += `    /* Creates a subtle gap effect around the thumb matching the track color */\n`;
    css += `    border: 2px solid hsl(var(--scrollbar-border));\n`;
    css += `  }\n\n`;
    css += `  html::-webkit-scrollbar-thumb:hover,\n`;
    css += `  body::-webkit-scrollbar-thumb:hover {\n`;
    css += `    /* Slightly adjust brightness on hover for visual feedback */\n`;
    css += `    filter: brightness(1.2);\n`;
    css += `  }\n`;
    css += `}`;
    
    return css;
  };

  const downloadCSS = () => {
    const css = generateCSS();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'themes.css';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS());
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy CSS:', err);
    }
  };

  const parseHSL = (hsl) => {
    const [h, s, l] = hsl.split(' ');
    return {
      h: parseInt(h) || 0,
      s: parseInt(s) || 0,
      l: parseInt(l) || 0
    };
  };

  const formatHSL = (h, s, l) => {
    return `${h} ${s}% ${l}%`;
  };

  const getColorCategory = (property) => {
    if (property.includes('scrollbar')) return 'scrollbar';
    if (property === 'card' || property === 'card-foreground') return 'card';
    if (property === 'popover' || property === 'popover-foreground') return 'popover';
    if (property === 'primary' || property === 'primary-foreground') return 'primary';
    if (property === 'secondary' || property === 'secondary-foreground') return 'secondary';
    if (property === 'accent' || property === 'accent-foreground') return 'accent';
    if (property === 'destructive' || property === 'destructive-foreground') return 'destructive';
    if (property === 'muted' || property === 'muted-foreground') return 'muted';
    return 'base';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Palette className="h-8 w-8" />
            Theme Manager
          </h1>
          <p className="text-muted-foreground">
            Create and manage your Tailwind CSS themes efficiently with shadcn/ui components
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Theme List */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Themes</CardTitle>
                  <Button onClick={addTheme} size="sm" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {themes.map(theme => (
                  <div
                    key={theme.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                      selectedTheme.id === theme.id ? 'bg-accent border-primary' : ''
                    }`}
                    onClick={() => setSelectedTheme(theme)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{theme.name}</span>
                      {themes.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTheme(theme.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="flex space-x-1 mt-2">
                      {['background', 'primary', 'secondary', 'accent', 'card'].map(prop => (
                        <div
                          key={prop}
                          className="w-3 h-3 rounded-sm border"
                          style={{ backgroundColor: `hsl(${theme.colors[prop]})` }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {selectedTheme.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="edit">Edit</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                  </TabsList>

                  <TabsContent value="edit" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme-name">Theme Name</Label>
                      <Input
                        id="theme-name"
                        value={selectedTheme.name}
                        onChange={(e) => updateTheme({ name: e.target.value })}
                        placeholder="Enter theme name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {colorProperties.map(property => {
                        const hsl = parseHSL(selectedTheme.colors[property]);
                        const category = getColorCategory(property);
                        return (
                          <div key={property} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label className="capitalize text-sm font-medium">
                                {property.replace('-', ' ')}
                              </Label>
                              <Badge variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div
                                className="w-10 h-10 rounded-md border-2 border-border flex-shrink-0"
                                style={{ backgroundColor: `hsl(${selectedTheme.colors[property]})` }}
                              />
                              <div className="flex-1 grid grid-cols-3 gap-1">
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">H</Label>
                                  <Input
                                    type="number"
                                    value={hsl.h}
                                    onChange={(e) => updateColor(property, formatHSL(e.target.value, hsl.s, hsl.l))}
                                    className="h-8 text-xs"
                                    min="0"
                                    max="360"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">S</Label>
                                  <Input
                                    type="number"
                                    value={hsl.s}
                                    onChange={(e) => updateColor(property, formatHSL(hsl.h, e.target.value, hsl.l))}
                                    className="h-8 text-xs"
                                    min="0"
                                    max="100"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label className="text-xs text-muted-foreground">L</Label>
                                  <Input
                                    type="number"
                                    value={hsl.l}
                                    onChange={(e) => updateColor(property, formatHSL(hsl.h, hsl.s, e.target.value))}
                                    className="h-8 text-xs"
                                    min="0"
                                    max="100"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="preview" className="space-y-6">
                    <div 
                      className="p-6 rounded-lg border-2"
                      style={{ 
                        backgroundColor: `hsl(${selectedTheme.colors.background})`,
                        color: `hsl(${selectedTheme.colors.foreground})`,
                        borderColor: `hsl(${selectedTheme.colors.border})`
                      }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Eye className="h-5 w-5" />
                        <h3 className="text-lg font-semibold">Preview: {selectedTheme.name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Buttons</Label>
                            <div className="space-y-2">
                              <button
                                className="w-full p-2 rounded-md font-medium transition-colors hover:opacity-90"
                                style={{
                                  backgroundColor: `hsl(${selectedTheme.colors.primary})`,
                                  color: `hsl(${selectedTheme.colors['primary-foreground']})`
                                }}
                              >
                                Primary Button
                              </button>
                              <button
                                className="w-full p-2 rounded-md font-medium transition-colors hover:opacity-90"
                                style={{
                                  backgroundColor: `hsl(${selectedTheme.colors.secondary})`,
                                  color: `hsl(${selectedTheme.colors['secondary-foreground']})`
                                }}
                              >
                                Secondary Button
                              </button>
                              <button
                                className="w-full p-2 rounded-md font-medium transition-colors hover:opacity-90"
                                style={{
                                  backgroundColor: `hsl(${selectedTheme.colors.accent})`,
                                  color: `hsl(${selectedTheme.colors['accent-foreground']})`
                                }}
                              >
                                Accent Button
                              </button>
                            </div>
                          </div>

                          {/* Card Preview */}
                          <div className="space-y-2">
                            <Label>Card Component</Label>
                            <div
                              className="p-4 rounded-lg border-2"
                              style={{
                                backgroundColor: `hsl(${selectedTheme.colors.card})`,
                                color: `hsl(${selectedTheme.colors['card-foreground']})`,
                                borderColor: `hsl(${selectedTheme.colors.border})`
                              }}
                            >
                              <h4 className="font-semibold mb-2">Card Title</h4>
                              <p className="text-sm">This is how cards will look with your theme colors.</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Form Elements</Label>
                            <input
                              type="text"
                              placeholder="Input field"
                              className="w-full p-2 rounded-md border focus:outline-none focus:ring-2"
                              style={{
                                backgroundColor: `hsl(${selectedTheme.colors.input})`,
                                borderColor: `hsl(${selectedTheme.colors.border})`,
                                color: `hsl(${selectedTheme.colors.foreground})`,
                                '--tw-ring-color': `hsl(${selectedTheme.colors.ring})`
                              }}
                            />
                            <div
                              className="p-3 rounded-md"
                              style={{
                                backgroundColor: `hsl(${selectedTheme.colors.muted})`,
                                color: `hsl(${selectedTheme.colors['muted-foreground']})`
                              }}
                            >
                              <Label>Muted Content</Label>
                              <p className="text-sm mt-1">
                                This is how muted text and backgrounds look in your theme.
                              </p>
                            </div>
                          </div>

                          {/* Popover Preview */}
                          <div className="space-y-2">
                            <Label>Popover Component</Label>
                            <div
                              className="p-3 rounded-lg border shadow-lg"
                              style={{
                                backgroundColor: `hsl(${selectedTheme.colors.popover})`,
                                color: `hsl(${selectedTheme.colors['popover-foreground']})`,
                                borderColor: `hsl(${selectedTheme.colors.border})`
                              }}
                            >
                              <p className="text-sm">Popover content with your theme colors</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="export" className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={downloadCSS} className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download CSS
                      </Button>
                      <Button onClick={copyCSS} variant="outline" className="flex items-center gap-2">
                        <Copy className="h-4 w-4" />
                        Copy CSS
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Generated CSS</Label>
                      <div className="bg-muted rounded-lg p-4 border">
                        <pre className="text-sm text-muted-foreground overflow-x-auto max-h-300">
                          <code>{generateCSS()}</code>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeManager;