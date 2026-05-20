'use client';
import { useState } from 'react';
import { BackpackIcon, Check, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GearItem {
  id: string;
  label: string;
  required: boolean;
  warning?: string;
  checked: boolean;
}

interface Category {
  title: string;
  emoji: string;
  items: GearItem[];
}

const defaultCategories: Category[] = [
  {
    title: 'Navigation & Safety',
    emoji: '🧭',
    items: [
      { id: 'map', label: 'Offline trail map (downloaded)', required: true, checked: false },
      { id: 'compass', label: 'Compass or GPS device', required: true, checked: false },
      { id: 'whistle', label: 'Emergency whistle', required: true, checked: false },
      { id: 'headlamp', label: 'Headlamp + spare batteries', required: true, checked: false },
      { id: 'fire', label: 'Fire starter / matches', required: false, checked: false },
    ],
  },
  {
    title: 'Hydration & Nutrition',
    emoji: '💧',
    items: [
      { id: 'water', label: '3L water capacity (bottles/bladder)', required: true, checked: false },
      { id: 'purification', label: 'Water purification tabs/filter', required: true, warning: 'Critical for high-altitude water sources', checked: false },
      { id: 'snacks', label: 'High-energy snacks (nuts, bars)', required: true, checked: false },
      { id: 'electrolytes', label: 'Electrolyte sachets', required: false, checked: false },
    ],
  },
  {
    title: 'Clothing & Shelter',
    emoji: '🧥',
    items: [
      { id: 'base', label: 'Moisture-wicking base layer', required: true, checked: false },
      { id: 'mid', label: 'Insulating mid layer (fleece/down)', required: true, checked: false },
      { id: 'shell', label: 'Waterproof shell jacket', required: true, checked: false },
      { id: 'gloves', label: 'Gloves & warm hat', required: false, checked: false },
      { id: 'tent', label: 'Tent / emergency bivvy', required: false, checked: false },
      { id: 'sleeping', label: 'Sleeping bag (rated for altitude)', required: false, checked: false },
    ],
  },
  {
    title: 'First Aid',
    emoji: '🏥',
    items: [
      { id: 'firstaid', label: 'First aid kit', required: true, checked: false },
      { id: 'blister', label: 'Blister pads / moleskin', required: true, checked: false },
      { id: 'diamox', label: 'Diamox (altitude sickness pills)', required: false, warning: 'Consult a doctor before use. Essential above 3500m.', checked: false },
      { id: 'painkillers', label: 'Pain relief (ibuprofen/paracetamol)', required: false, checked: false },
      { id: 'sunscreen', label: 'Sunscreen SPF 50+', required: true, checked: false },
      { id: 'sunglasses', label: 'UV-protective sunglasses', required: true, warning: 'Snow blindness is a real risk above 3000m', checked: false },
    ],
  },
  {
    title: 'Footwear & Mobility',
    emoji: '🥾',
    items: [
      { id: 'boots', label: 'Trail boots (broken in)', required: true, warning: 'Never wear new boots on a trek', checked: false },
      { id: 'gaiters', label: 'Gaiters (for mud/snow)', required: false, checked: false },
      { id: 'poles', label: 'Trekking poles', required: false, checked: false },
    ],
  },
  {
    title: 'Altitude & Weather',
    emoji: '🌡️',
    items: [
      { id: 'altimeter', label: 'Altimeter watch', required: false, checked: false },
      { id: 'raincover', label: 'Pack rain cover', required: true, checked: false },
      { id: 'emergency_blanket', label: 'Emergency thermal blanket', required: true, checked: false },
    ],
  },
];

export default function GearPage() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(defaultCategories.map((c) => c.title)));

  const toggle = (catTitle: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.title !== catTitle
          ? cat
          : { ...cat, items: cat.items.map((item) => item.id === itemId ? { ...item, checked: !item.checked } : item) },
      ),
    );
  };

  const toggleSection = (title: string) => {
    setExpanded((prev) => {
      const n = new Set(prev);
      n.has(title) ? n.delete(title) : n.add(title);
      return n;
    });
  };

  const totalItems = categories.flatMap((c) => c.items).length;
  const checkedItems = categories.flatMap((c) => c.items).filter((i) => i.checked).length;
  const requiredUnchecked = categories.flatMap((c) => c.items).filter((i) => i.required && !i.checked).length;
  const pct = Math.round((checkedItems / totalItems) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="section-title text-2xl">Gear Checklist</h1>
        <p className="section-subtitle">Smart packing list — review before every trek</p>
      </div>

      {/* Progress Summary */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BackpackIcon size={20} className="text-[#2d6a4f]" />
            <div>
              <p className="font-bold text-gray-900">{checkedItems} / {totalItems} items packed</p>
              <p className="text-xs text-gray-500">
                {requiredUnchecked > 0
                  ? <span className="text-orange-600 font-medium">⚠️ {requiredUnchecked} required item{requiredUnchecked > 1 ? 's' : ''} missing</span>
                  : <span className="text-green-600 font-medium">✅ All required items packed</span>
                }
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-[#2d6a4f]">{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-100">
          <div
            className={cn('h-2.5 rounded-full transition-all', pct === 100 ? 'bg-green-500' : 'bg-[#2d6a4f]')}
            style={{ width: `${pct}%` }}
          />
        </div>

        {pct === 100 && (
          <div className="mt-3 bg-green-50 rounded-xl p-3 text-sm text-green-700 font-medium flex items-center gap-2">
            <Check size={16} /> You&apos;re fully packed! Have a safe trek. 🏔️
          </div>
        )}
      </div>

      {/* Category Sections */}
      {categories.map((cat) => {
        const open = expanded.has(cat.title);
        const catChecked = cat.items.filter((i) => i.checked).length;
        return (
          <div key={cat.title} className="card">
            <button
              className="w-full flex items-center justify-between group"
              onClick={() => toggleSection(cat.title)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{cat.emoji}</span>
                <div className="text-left">
                  <p className="font-bold text-gray-900">{cat.title}</p>
                  <p className="text-xs text-gray-500">{catChecked}/{cat.items.length} packed</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-[#2d6a4f]"
                    style={{ width: `${(catChecked / cat.items.length) * 100}%` }}
                  />
                </div>
                {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </button>

            {open && (
              <div className="mt-4 space-y-2 border-t pt-4">
                {cat.items.map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      'flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-colors',
                      item.checked ? 'bg-green-50' : 'hover:bg-gray-50',
                    )}
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-[#2d6a4f] w-4 h-4 shrink-0"
                      checked={item.checked}
                      onChange={() => toggle(cat.title, item.id)}
                    />
                    <div className="flex-1">
                      <span className={cn('text-sm', item.checked ? 'line-through text-gray-400' : 'text-gray-800 font-medium')}>
                        {item.label}
                        {item.required && !item.checked && (
                          <span className="ml-2 text-[10px] font-bold text-orange-600 uppercase">Required</span>
                        )}
                      </span>
                      {item.warning && !item.checked && (
                        <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                          <AlertTriangle size={11} /> {item.warning}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Hydration Calculator */}
      <div className="card bg-blue-50 border-blue-100">
        <h2 className="font-bold text-gray-900 mb-2">💧 Hydration Calculator</h2>
        <p className="text-sm text-gray-600">At altitude (above 3000m), drink at least <strong>500ml per hour</strong> of active hiking — even if you don&apos;t feel thirsty. For a 6-hour day, carry minimum <strong>3 litres</strong>.</p>
        <div className="grid grid-cols-3 gap-3 mt-3 text-center text-sm">
          {[['Low exertion', '250ml/hr'], ['Moderate', '400ml/hr'], ['High / altitude', '500ml/hr']].map(([label, val]) => (
            <div key={label} className="bg-white rounded-xl p-2">
              <p className="text-xs text-gray-500">{label}</p>
              <p className="font-bold text-[#457b9d]">{val}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
