"use client";
import React, { useMemo, useState } from 'react';

interface Campaign {
  id: number;
  name: string;
  status: 'Active' | 'Paused';
  clicks: number;
  cost: number;
  impressions: number;
}

const initialData: Campaign[] = [
  { id: 1, name: 'Spring Sale 2025', status: 'Active', clicks: 12_456, cost: 3421.75, impressions: 512_345 },
  { id: 2, name: 'Brand Awareness Q1', status: 'Paused', clicks: 842, cost: 512.0, impressions: 45_000 },
  { id: 3, name: 'Holiday Push', status: 'Active', clicks: 9_800, cost: 2740.2, impressions: 301_234 },
  { id: 4, name: 'New Product Launch', status: 'Paused', clicks: 230, cost: 120.5, impressions: 12_000 },
  { id: 5, name: 'Referral Promo', status: 'Active', clicks: 4_321, cost: 900.0, impressions: 98_000 },
  { id: 6, name: 'Retargeting - Web', status: 'Active', clicks: 7_650, cost: 1500.99, impressions: 210_000 }
];

export default function Home() {
  const [filter, setFilter] = useState<'Active' | 'Paused'>('Active');
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return initialData.filter((c) => c.status === filter && c.name.toLowerCase().includes(q));
  }, [filter, query]);

  const totals = useMemo(
    () => filtered.reduce(
      (acc, c) => {
        acc.clicks += c.clicks;
        acc.cost += c.cost;
        acc.impressions += c.impressions;
        return acc;
      },
      { clicks: 0, cost: 0, impressions: 0 }
    ),
    [filtered]
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Marketing Campaigns</h1>
            <p className="text-sm text-gray-600">Overview of campaigns with quick filter and metrics.</p>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="statusFilter" className="text-sm text-gray-700">
              Filter:
            </label>
            <select
              id="statusFilter"
              aria-label="Campaign status filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'Active' | 'Paused')}
              className="rounded-md border-gray-300 text-sm px-3 py-2 bg-white text-gray-900 font-semibold"
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>

            <label htmlFor="campaignSearch" className="sr-only">
              Search campaigns
            </label>
            <input
              id="campaignSearch"
              type="search"
              placeholder="Search campaign"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ml-3 rounded-md border-gray-300 px-3 py-2 text-sm text-gray-900 font-semibold placeholder:text-gray-700"
            />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <div className="text-xs text-gray-500">Campaigns</div>
            <div className="text-xl font-medium text-gray-900">{filtered.length}</div>
          </div>

          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <div className="text-xs text-gray-500">Total Clicks</div>
            <div className="text-xl font-medium text-gray-900">{totals.clicks.toLocaleString()}</div>
          </div>

            <div className="p-4 bg-white rounded-2xl shadow-sm">
            <div className="text-xs text-gray-500">Total Cost</div>
            <div className="text-xl font-medium text-gray-900">{formatCurrency(totals.cost)}</div>
          </div>
        </section>

        <main>
          <div className="overflow-x-auto bg-white rounded-2xl shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          c.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{c.clicks.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{formatCurrency(c.cost)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-700">{c.impressions.toLocaleString()}</td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">
                      No campaigns match the selected filter{query ? ' or search.' : '.'}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 text-sm font-medium text-gray-700">Total</td>
                  <td></td>
                  <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">{totals.clicks.toLocaleString()}</td>
                  <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">{formatCurrency(totals.cost)}</td>
                  <td className="px-6 py-3 text-right text-sm font-semibold text-gray-900">{totals.impressions.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}
