import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  const menuItems = [
    { title: 'Dashboard', path: '/dashboard', icon: '📊' },
    { title: 'Profile', path: '/dashboard/profile', icon: '👤' },
    { title: 'Settings', path: '/dashboard/settings', icon: '⚙️' },
    { title: 'Analytics', path: '/dashboard/analytics', icon: '📈' },
    { title: 'Help', path: '/dashboard/help', icon: '❓' },
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h2 className="logo">{isCollapsed ? 'B' : 'Bitax'}</h2>
        <button className="toggle-btn" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path} className={router.pathname === item.path ? 'active' : ''}>
              <Link href={item.path}>
                <a>
                  <span className="icon">{item.icon}</span>
                  {!isCollapsed && <span className="title">{item.title}</span>}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        {!isCollapsed && <p>© 2023 Bitax</p>}
      </div>
    </div>
  );
};

export default Sidebar;
