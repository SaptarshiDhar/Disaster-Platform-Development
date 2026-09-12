'use client';

import { useState } from 'react';
import {
  Bell,
  Check,
  Download,
  Home,
  Map,
  Menu,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';

import { CitizenShield } from '@/components/citizen/CitizenShield';

/**
 * Citizen Home Dashboard — frontend only, static demo data.
 *
 * No live alerts, GIS, or reporting workflow yet — see the tiles below and
 * docs/demo-data-policy.md. Every action here is a placeholder interaction
 * until the backend and citizen features land.
 */

const DISTRICTS = ['Darjeeling District', 'Kalimpong District', 'Jalpaiguri District'];

const NEED_TILES = [
  {
    icon: TriangleAlert,
    tone: 'bg-red-600',
    title: 'Report Incident',
    subtitle: 'Flood, landslide, road damage',
    action: 'report',
  },
  {
    icon: Map,
    tone: 'bg-blue-700',
    title: 'Emergency Map',
    subtitle: 'Shelters, hospitals, safe points',
    action: 'info',
  },
  {
    icon: TriangleAlert,
    tone: 'bg-orange-500',
    title: 'Alerts Near Me',
    subtitle: 'Official warnings and updates',
    action: 'info',
  },
  {
    icon: ShieldCheck,
    tone: 'bg-emerald-600',
    title: 'Safety Guide',
    subtitle: 'What to do before, during, after',
    action: 'info',
  },
] as const;

const SITUATION_ROWS = [
  { label: 'Landslide exposure', value: 'HIGH', tone: 'bg-red-100 text-red-700' },
  { label: 'Flood exposure', value: 'LOW', tone: 'bg-emerald-100 text-emerald-700' },
  { label: 'Citizen reports nearby', value: '7 unverified', tone: 'bg-amber-100 text-amber-700' },
];

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'report', label: 'Report', icon: TriangleAlert },
  { key: 'alerts', label: 'Alerts', icon: Bell },
  { key: 'more', label: 'More', icon: Menu },
] as const;

export default function CitizenHomePage() {
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [pickingDistrict, setPickingDistrict] = useState(false);
  const [packReady, setPackReady] = useState(false);
  const [activeTab, setActiveTab] = useState<(typeof NAV_ITEMS)[number]['key']>('home');

  const reportIncident = () => alert('Incident reporting coming next.');

  return (
    <main className="min-h-screen bg-[#eef3f9] pb-24">
      <div className="mx-auto w-full max-w-md sm:max-w-lg">
        {/* Header */}
        <header className="flex items-center justify-between gap-3 bg-[#0f2440] px-4 py-4">
          <div className="flex items-center gap-3">
            <CitizenShield size={38} />
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-white">RAKSHA</h1>
              <p className="text-xs text-slate-300">Citizen Safety</p>
            </div>
          </div>

          <span className="flex items-center gap-1.5 rounded-full bg-[#17335a] px-3 py-1.5 text-xs font-bold text-emerald-300">
            <span className="size-2 rounded-full bg-emerald-400" aria-hidden="true" />
            ONLINE
          </span>
        </header>

        {/* Area row */}
        <div className="relative flex items-center justify-between bg-white px-4 py-3">
          <div>
            <p className="text-xs text-slate-500">Your area</p>
            <p className="text-base font-bold text-slate-900">{district}</p>
          </div>
          <button
            type="button"
            onClick={() => setPickingDistrict((v) => !v)}
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            Change
          </button>

          {pickingDistrict ? (
            <div className="absolute right-4 top-full z-10 mt-1 w-56 rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-slate-200">
              {DISTRICTS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setDistrict(item);
                    setPickingDistrict(false);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
                    item === district
                      ? 'bg-blue-50 font-semibold text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-4 px-4 pt-4">
          {/* Hero */}
          <section className="rounded-2xl bg-blue-50 p-5">
            <h2 className="text-2xl font-extrabold leading-snug text-slate-900">
              Stay aware. Act safely.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              See verified alerts, report what you observe, and keep key
              safety information ready offline.
            </p>

            <button
              type="button"
              onClick={reportIncident}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-red-700 py-3.5 text-sm font-bold tracking-wide text-white transition-colors hover:bg-red-800 active:bg-red-900"
            >
              <TriangleAlert size={17} aria-hidden="true" />
              REPORT AN INCIDENT
            </button>
          </section>

          {/* Official alert */}
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
            <span className="text-[11px] font-extrabold tracking-wide text-red-600">
              OFFICIAL ALERT
            </span>
            <h3 className="mt-1.5 text-[15px] font-bold leading-snug text-slate-900">
              Heavy rainfall warning in parts of the district
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
              Follow instructions from local authorities. Avoid unnecessary
              travel in landslide-prone areas.
            </p>
            <p className="mt-2.5 text-xs text-slate-400">
              Updated 18 min ago &nbsp;•&nbsp; Verified source
            </p>
          </section>

          {/* What do you need */}
          <section>
            <h3 className="mb-3 text-lg font-bold text-slate-900">What do you need?</h3>
            <div className="grid grid-cols-2 gap-3">
              {NEED_TILES.map(({ icon: Icon, tone, title, subtitle, action }) => (
                <button
                  key={title}
                  type="button"
                  onClick={action === 'report' ? reportIncident : undefined}
                  className="flex flex-col items-start gap-2 rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200/70 transition-shadow hover:shadow-md"
                >
                  <span className={`grid size-9 place-items-center rounded-full ${tone}`}>
                    <Icon size={17} className="text-white" aria-hidden="true" />
                  </span>
                  <span className="text-[14px] font-bold leading-tight text-slate-900">
                    {title}
                  </span>
                  <span className="text-[12px] leading-snug text-slate-500">{subtitle}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Situation around you */}
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
            <h3 className="text-base font-bold text-slate-900">Situation around you</h3>
            <dl className="mt-3 flex flex-col gap-3">
              {SITUATION_ROWS.map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <dt className="text-sm text-slate-700">{row.label}</dt>
                  <dd className={`rounded-full px-3 py-1 text-xs font-bold ${row.tone}`}>
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[11px] text-slate-400">
              Risk information is advisory. Follow official instructions.
            </p>
          </section>

          {/* Offline pack */}
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/70">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-teal-700">
                {packReady ? (
                  <Check size={18} className="text-white" aria-hidden="true" />
                ) : (
                  <Download size={18} className="text-white" aria-hidden="true" />
                )}
              </span>
              <div className="flex-1">
                <h3 className="text-[15px] font-bold text-slate-900">
                  Offline Emergency Pack
                </h3>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                  Keep maps, safety guides and emergency contacts available
                  even if internet access is lost.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPackReady(true)}
              disabled={packReady}
              className={`mt-3 ml-auto block rounded-xl px-5 py-2.5 text-xs font-bold tracking-wide text-white transition-colors ${
                packReady
                  ? 'cursor-default bg-emerald-600'
                  : 'bg-teal-700 hover:bg-teal-800 active:bg-teal-900'
              }`}
            >
              {packReady ? 'EMERGENCY PACK READY' : 'DOWNLOAD'}
            </button>
          </section>

          {/* Emergency strip */}
          <section className="rounded-xl bg-blue-50 px-4 py-3 text-center text-[13px] font-semibold text-slate-700 ring-1 ring-blue-100">
            Emergency? Call the appropriate official emergency service.
          </section>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav
        className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white"
        aria-label="Citizen navigation"
      >
        <div className="mx-auto flex w-full max-w-md justify-between px-2 py-2 sm:max-w-lg">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-medium transition-colors ${
                  active ? 'text-blue-700' : 'text-slate-400 hover:text-slate-500'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
