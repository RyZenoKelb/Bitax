import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/sidebar.css';

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Listen for sidebar collapse state
  useEffect(() => {
    const handleSidebarChange = () => {
      const sidebar = document.querySelector('.sidebar');
      setSidebarCollapsed(sidebar.classList.contains('collapsed'));
    };
    
    const observer = new MutationObserver(handleSidebarChange);
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebar) {
      observer.observe(sidebar, { attributes: true });
    }
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="dashboard-container">
      <Sidebar />
      
      <main className={`dashboard-content ${sidebarCollapsed ? 'extended' : ''}`}>
        <h1>Dashboard</h1>
        <div className="dashboard-grid">
          {/* Your dashboard content here */}
          <div className="card">
            <h3>Welcome back!</h3>
            <p>Here's your summary for today</p>
          </div>
          <div className="card">
            <h3>Recent Activity</h3>
            <p>You have 3 pending tasks</p>
          </div>
          <div className="card">
            <h3>Analytics</h3>
            <p>Your traffic increased by 25%</p>
          </div>
        </div>
      </main>
    </div>
  );
}
