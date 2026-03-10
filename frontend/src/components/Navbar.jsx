import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  CalendarDaysIcon,
  TruckIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  ArrowRightOnRectangleIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';

function Navbar() {
  const { user, logout } = useAuth();

  const adminNavItems = [
    { to: '/menu', label: 'Menu', icon: CalendarDaysIcon },
    { to: '/delivery-list', label: 'Delivery List', icon: TruckIcon },
    { to: '/delivery', label: 'Track Delivery', icon: TruckIcon },
    { to: '/transactions', label: 'Transactions', icon: CreditCardIcon },
    { to: '/complaints', label: 'Complaints', icon: ExclamationCircleIcon },
    { to: '/chat', label: 'Chat', icon: ChatBubbleLeftRightIcon },
  ];

  const studentNavItems = [
    { to: '/menu', label: 'Menu', icon: CalendarDaysIcon },
    { to: '/skip-meal', label: 'Skip Meal', icon: ListBulletIcon },
    { to: '/payments', label: 'Payments', icon: CreditCardIcon },
    { to: '/delivery', label: 'Delivery', icon: TruckIcon },
    { to: '/complaints', label: 'Complaints', icon: ExclamationCircleIcon },
    { to: '/chat', label: 'Chat', icon: ChatBubbleLeftRightIcon },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : studentNavItems;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to={user?.role === 'admin' ? '/admin' : '/student'}
          className="flex items-center gap-2 text-xl font-bold text-blue-700 hover:text-blue-800 transition-colors"
        >
          <HomeIcon className="w-7 h-7" />
          MessMate
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors shadow-md"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;

