import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();
  
  const isActive = (path) => {
    return router.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>Bitax</h3>
      </div>
      <div className="sidebar-menu">
        <ul>
          <li className={isActive('/dashboard')}>
            <Link href="/dashboard">
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/profile')}>
            <Link href="/dashboard/profile">
              <span>Profile</span>
            </Link>
          </li>
          <li className={isActive('/dashboard/settings')}>
            <Link href="/dashboard/settings">
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link href="/logout">
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
