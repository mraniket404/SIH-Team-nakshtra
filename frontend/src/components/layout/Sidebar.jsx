import { NavLink } from 'react-router-dom';

const navigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '⌂',
  },
  {
    label: 'New Analysis',
    path: '/analysis/new',
    icon: '+',
  },
  {
    label: 'Projects',
    path: '/projects',
    icon: '▣',
  },
  {
    label: 'History',
    path: '/history',
    icon: '◷',
  },
  {
    label: 'Models',
    path: '/models',
    icon: '◈',
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: '▤',
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: '⚙',
  },
];

function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-900/80 lg:block">
      <div className="sticky top-0 flex h-screen flex-col">
        <div className="border-b border-white/10 px-6 py-5">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-cyan-400">Sat</span>Query
            <span className="text-violet-400"> AI</span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Remote Sensing Intelligence
          </p>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition',
                  isActive
                    ? 'bg-cyan-400/10 text-cyan-300'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
            >
              <span className="w-5 text-center">{item.icon}</span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-medium text-slate-300">
              AI Service
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />

              <span className="text-xs text-slate-500">
                Not connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;