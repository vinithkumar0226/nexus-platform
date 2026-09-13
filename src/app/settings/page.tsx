'use client';

import React, { useState } from 'react';
import { useNexusStore } from '@/store/nexusStore';
import { cn } from '@/lib/utils';
import { 
  User, Settings as SettingsIcon, BrainCircuit, Shield, Palette, 
  Save, Eye, EyeOff, CheckCircle2 
} from 'lucide-react';

type Tab = 'profile' | 'preferences' | 'ai' | 'security' | 'appearance';

export default function SettingsPage() {
  const { addToast } = useNexusStore();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [showApiKey, setShowApiKey] = useState(false);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4 mr-2" /> },
    { id: 'preferences', label: 'Preferences', icon: <SettingsIcon className="w-4 h-4 mr-2" /> },
    { id: 'ai', label: 'AI Configuration', icon: <BrainCircuit className="w-4 h-4 mr-2" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4 mr-2" /> },
    { id: 'appearance', label: 'Appearance', icon: <Palette className="w-4 h-4 mr-2" /> },
  ];

  const handleSave = () => {
    addToast({ type: 'success', title: 'Settings Saved', description: 'Your preferences have been updated successfully.' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-nexus-bg text-white">
      {/* Header */}
      <header className="px-8 py-6 border-b border-nexus-border bg-nexus-panel flex justify-between items-center z-10 sticky top-0">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-400 mt-1">Manage system configurations and personal preferences</p>
        </div>
        <button onClick={handleSave} className="flex items-center px-4 py-2 bg-nexus-cyan hover:bg-nexus-cyan/90 text-black rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(0,212,255,0.2)]">
          <Save className="w-4 h-4 mr-2" /> Save Changes
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-nexus-border bg-nexus-panel/50 p-6 overflow-y-auto">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  activeTab === tab.id 
                    ? "bg-nexus-cyan/10 text-nexus-cyan" 
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                )}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-xl font-bold mb-6 border-b border-nexus-border pb-2">Profile Information</h2>
                  
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-nexus-blue/20 border-2 border-nexus-blue/50 flex items-center justify-center text-3xl font-bold text-nexus-blue">
                      OP
                    </div>
                    <div>
                      <button className="px-4 py-2 bg-nexus-card border border-nexus-border rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Full Name</label>
                      <input type="text" defaultValue="Operator Admin" className="w-full bg-black/40 border border-nexus-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nexus-cyan transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Email Address</label>
                      <input type="email" defaultValue="admin@ntro.gov.in" className="w-full bg-black/40 border border-nexus-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nexus-cyan transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Role</label>
                      <input type="text" defaultValue="Senior Analyst" disabled className="w-full bg-black/20 border border-nexus-border rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Organization</label>
                      <input type="text" defaultValue="National Technical Research Organisation" disabled className="w-full bg-black/20 border border-nexus-border rounded-lg px-4 py-2.5 text-gray-500 cursor-not-allowed" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PREFERENCES TAB */}
            {activeTab === 'preferences' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-xl font-bold mb-6 border-b border-nexus-border pb-2">System Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-400">Default Output Types</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Executive Brief', 'Cybersecurity Advisory', 'Presentation', 'LinkedIn Post'].map((type, i) => (
                          <label key={i} className="flex items-center gap-3 p-3 bg-black/20 border border-white/5 rounded-lg cursor-pointer hover:bg-black/40">
                            <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 accent-nexus-cyan rounded border-gray-600 bg-gray-700" />
                            <span className="text-sm">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Default Audience</label>
                        <select className="w-full bg-black/40 border border-nexus-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nexus-cyan transition-colors appearance-none">
                          <option>Technical Leadership</option>
                          <option>Executive Board</option>
                          <option>General Public</option>
                          <option>Engineering Team</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Language</label>
                        <select className="w-full bg-black/40 border border-nexus-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nexus-cyan transition-colors appearance-none">
                          <option>English (US)</option>
                          <option>English (UK)</option>
                          <option>Hindi</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-lg">
                      <div>
                        <h4 className="font-medium">Auto-generate Content DNA</h4>
                        <p className="text-sm text-gray-500 mt-1">Automatically start DNA extraction upon source upload.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nexus-cyan"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI CONFIGURATION TAB */}
            {activeTab === 'ai' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-xl font-bold mb-6 border-b border-nexus-border pb-2">AI Configuration</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">LLM Provider</label>
                      <div className="flex gap-4">
                        {['Gemini', 'OpenAI', 'Anthropic'].map((provider) => (
                          <label key={provider} className={cn(
                            "flex-1 p-4 rounded-lg border cursor-pointer text-center transition-all",
                            provider === 'Gemini' ? "bg-nexus-cyan/10 border-nexus-cyan text-nexus-cyan" : "bg-black/20 border-white/10 text-gray-400 hover:border-white/30"
                          )}>
                            <input type="radio" name="provider" value={provider} defaultChecked={provider === 'Gemini'} className="hidden" />
                            <span className="font-bold">{provider}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Model Selection</label>
                      <select className="w-full bg-black/40 border border-nexus-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-nexus-cyan transition-colors appearance-none">
                        <option>gemini-2.5-pro</option>
                        <option>gemini-2.0-flash</option>
                        <option>gemini-1.5-pro</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-400">Temperature</label>
                        <span className="text-sm text-nexus-cyan font-mono">0.2</span>
                      </div>
                      <input type="range" min="0" max="1" step="0.1" defaultValue="0.2" className="w-full accent-nexus-cyan" />
                      <p className="text-xs text-gray-500">Lower values produce more deterministic, factual outputs. Recommended for cybersecurity.</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Max Tokens</label>
                      <input type="number" defaultValue="8192" className="w-full bg-black/40 border border-nexus-border rounded-lg px-4 py-2.5 text-white font-mono focus:outline-none focus:border-nexus-cyan transition-colors" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">API Key</label>
                      <div className="relative">
                        <input 
                          type={showApiKey ? "text" : "password"} 
                          defaultValue="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX" 
                          className="w-full bg-black/40 border border-nexus-border rounded-lg pl-4 pr-12 py-2.5 text-white font-mono focus:outline-none focus:border-nexus-cyan transition-colors" 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <div className="flex items-start gap-2 mt-2">
                        <Shield className="w-4 h-4 text-nexus-green flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-nexus-green font-medium">API keys are stored securely server-side and never exposed to the frontend.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-xl font-bold mb-6 border-b border-nexus-border pb-2">Security & Privacy</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 bg-black/20 border border-white/5 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-nexus-green" />
                        <div>
                          <h4 className="font-medium text-white">Two-Factor Authentication (2FA)</h4>
                          <p className="text-sm text-gray-500 mt-1">Authenticator app enabled</p>
                        </div>
                      </div>
                      <span className="flex items-center text-sm font-bold text-nexus-green px-3 py-1 bg-nexus-green/10 rounded-full">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Enabled
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-lg">
                      <div>
                        <h4 className="font-medium text-white">Auto-mask PII</h4>
                        <p className="text-sm text-gray-500 mt-1">Automatically redact personally identifiable information in outputs.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nexus-cyan"></div>
                      </label>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-400">Sensitive Info Detection Sensitivity</label>
                        <span className="text-sm text-white font-medium">High</span>
                      </div>
                      <input type="range" min="1" max="3" step="1" defaultValue="3" className="w-full accent-nexus-cyan" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Low</span>
                        <span>Medium</span>
                        <span>High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div>
                  <h2 className="text-xl font-bold mb-6 border-b border-nexus-border pb-2">Appearance</h2>
                  
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-400">Theme</label>
                      <div className="grid grid-cols-3 gap-4">
                        {['Dark', 'Light', 'System'].map((theme) => (
                          <label key={theme} className={cn(
                            "flex flex-col items-center justify-center p-4 rounded-lg border cursor-pointer transition-all h-24",
                            theme === 'Dark' ? "bg-nexus-cyan/10 border-nexus-cyan text-nexus-cyan" : "bg-black/20 border-white/10 text-gray-400 hover:border-white/30"
                          )}>
                            <input type="radio" name="theme" value={theme} defaultChecked={theme === 'Dark'} className="hidden" />
                            <span className="font-bold">{theme}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-400">Accent Color</label>
                      <div className="flex gap-4">
                        {[
                          { name: 'Cyan', color: 'bg-[#00d4ff]' },
                          { name: 'Blue', color: 'bg-[#4f8ef7]' },
                          { name: 'Green', color: 'bg-[#00e676]' },
                          { name: 'Purple', color: 'bg-[#b388ff]' },
                        ].map((accent) => (
                          <label key={accent.name} className={cn(
                            "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                            accent.name === 'Cyan' ? "bg-white/10 border-white/50 text-white" : "bg-black/20 border-white/10 text-gray-400 hover:border-white/30"
                          )}>
                            <input type="radio" name="accent" value={accent.name} defaultChecked={accent.name === 'Cyan'} className="hidden" />
                            <div className={cn("w-4 h-4 rounded-full", accent.color)} />
                            <span className="text-sm font-medium">{accent.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-400">Sidebar Layout</label>
                      <div className="flex gap-4">
                        {['Expanded', 'Compact'].map((layout) => (
                          <label key={layout} className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all",
                            layout === 'Expanded' ? "bg-white/10 border-white/50 text-white" : "bg-black/20 border-white/10 text-gray-400 hover:border-white/30"
                          )}>
                            <input type="radio" name="layout" value={layout} defaultChecked={layout === 'Expanded'} className="hidden" />
                            <span className="text-sm font-medium">{layout}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
