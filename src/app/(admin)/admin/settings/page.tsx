export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Manage your LINK'D UP CRM settings</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-white">CRM Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Organization Name</label>
            <input defaultValue="LINK'D UP" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Website</label>
            <input defaultValue="https://www.linkdup.club" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Reply-To Email</label>
            <input placeholder="hello@linkdup.club" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500 placeholder-zinc-600" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Instagram</label>
            <input placeholder="@linkdup.club" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500 placeholder-zinc-600" />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">Save Changes</button>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-white">Email / Resend</h2>
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">Resend API Key</label>
          <input type="password" placeholder="re_••••••••••••••••" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500 placeholder-zinc-600" />
          <p className="text-xs text-zinc-600 mt-1">Set via environment variable RESEND_API_KEY</p>
        </div>
        <div>
          <label className="block text-xs text-zinc-400 mb-1.5">From Email</label>
          <input placeholder="LINK'D UP <hello@linkdup.club>" className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 text-sm focus:outline-none focus:border-violet-500 placeholder-zinc-600" />
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
        <h2 className="font-semibold text-white">Database</h2>
        <div className="text-sm text-zinc-400 space-y-2">
          <p>Database URL is configured via <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300">DATABASE_URL</code> environment variable.</p>
          <p>Run <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300">npx prisma db push</code> to apply schema changes.</p>
          <p>Run <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-violet-300">npx prisma generate</code> to regenerate the client after schema changes.</p>
        </div>
      </div>
    </div>
  )
}
