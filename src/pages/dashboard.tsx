/* styles/dashboard.css - Styles spécifiques pour le dashboard */

/* Effets visuels avancés pour le dashboard */
.dashboard-bg {
  background-color: var(--color-dark);
  background-image: 
    radial-gradient(circle at 30% 20%, rgba(123, 63, 228, 0.12), transparent 25%),
    radial-gradient(circle at 80% 70%, rgba(14, 234, 255, 0.12), transparent 25%);
  position: relative;
}

.light .dashboard-bg {
  background-color: var(--color-light);
  background-image: 
    radial-gradient(circle at 30% 20%, rgba(123, 63, 228, 0.07), transparent 25%),
    radial-gradient(circle at 80% 70%, rgba(14, 234, 255, 0.07), transparent 25%);
}

/* Styles améliorés pour la sidebar */
.sidebar {
  backdrop-filter: blur(10px);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.light .sidebar {
  background-color: rgba(255, 255, 255, 0.9);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sidebar-link-active {
  background: linear-gradient(90deg, rgba(123, 63, 228, 0.15), rgba(123, 63, 228, 0.05));
  color: #7B3FE4;
  border-left: 3px solid #7B3FE4;
}

.light .sidebar-link-active {
  background: linear-gradient(90deg, rgba(123, 63, 228, 0.1), rgba(123, 63, 228, 0.02));
}

.sidebar-icon {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
}

/* Effets de carte améliorés */
.dashboard-card {
  background: rgba(31, 41, 55, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.light .dashboard-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.2);
}

/* En-têtes de carte */
.card-header {
  padding: 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.light .card-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* Styles pour les statistiques */
.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}

.light .stat-value {
  color: #1a202c;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

.light .stat-label {
  color: rgba(0, 0, 0, 0.7);
}

/* Pastilles de statut */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge-success {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.light .status-badge-success {
  background-color: rgba(16, 185, 129, 0.1);
}

.status-badge-warning {
  background-color: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.light .status-badge-warning {
  background-color: rgba(245, 158, 11, 0.1);
}

.status-badge-error {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.light .status-badge-error {
  background-color: rgba(239, 68, 68, 0.1);
}

/* Styles pour les boutons network */
.network-button {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.network-button-icon {
  width: 16px;
  height: 16px;
  margin-right: 0.5rem;
}

.network-button-active {
  background: linear-gradient(90deg, rgba(123, 63, 228, 0.8), rgba(123, 63, 228, 0.7));
  color: white;
  box-shadow: 0 4px 12px rgba(123, 63, 228, 0.25);
}

.light .network-button-active {
  background: linear-gradient(90deg, rgba(123, 63, 228, 0.9), rgba(123, 63, 228, 0.8));
}

/* Animation pour les effets de chargement */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Animations et transitions pour les chartes et visualisations */
.chart-container {
  transition: all 0.5s ease;
}

.chart-container:hover {
  transform: scale(1.02);
}

/* Premium banner effet de gradient amélioré */
.premium-banner {
  background: linear-gradient(135deg, #7B3FE4, #0891B2);
  border-radius: 1rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.premium-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
  z-index: 1;
}

.premium-banner::after {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  right: -50px;
  top: -50px;
}

.premium-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
}

.premium-badge-icon {
  width: 14px;
  height: 14px;
  margin-right: 0.25rem;
}

/* Scrollbar stylisée */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}

/* Styles pour appliquer une transition fluide lors des changements de thème */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease;
}

/* CSS pour les textes en dégradé */
.gradient-text {
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(90deg, #7B3FE4, #0EEAFF);
}

/* Pour les headers et effets visuels avancés */
.header-glow {
  position: relative;
}

.header-glow::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(123, 63, 228, 0.7), transparent);
}

/* Effet hover pour les hover charts */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
}

/* Effet de glace pour les cards en mode clair */
.light .glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
}

/* Effet néon subtil pour les éléments en surbrillance */
.neon-highlight {
  box-shadow: 0 0 10px rgba(123, 63, 228, 0.5), 0 0 20px rgba(123, 63, 228, 0.3);
}

/* Support des transitions de thème */
.theme-transition-container {
  transition: background-color 0.5s ease-in-out;
}

/* Styles spécifiques pour les boutons d'action */
.action-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-button-primary {
  background: linear-gradient(90deg, #7B3FE4, #6A2DD1);
  color: white;
  box-shadow: 0 4px 12px rgba(123, 63, 228, 0.25);
}

.action-button-primary:hover {
  box-shadow: 0 6px 15px rgba(123, 63, 228, 0.35);
  transform: translateY(-2px);
}

.action-button-secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.light .action-button-secondary {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1a202c;
}

.action-button-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.light .action-button-secondary:hover {
  background: rgba(0, 0, 0, 0.1);
}

/* Animation pour les éléments nécessitant l'attention */
@keyframes attention-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(123, 63, 228, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(123, 63, 228, 0);
  }
}

.attention-animation {
  animation: attention-pulse 2s infinite;
}