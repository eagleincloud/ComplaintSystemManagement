// COMPLAINT MANAGEMENT SYSTEM - COMPLETE APPLICATION
'use strict';

// ==================== DATA LAYER ====================
const DEMO_USERS = [
  {email: 'customer1@demo.com', password: 'Customer@123', name: 'Rajesh Kumar', role: 'CUSTOMER', company: 'Tech Solutions Inc'},
  {email: 'customer2@demo.com', password: 'Customer@123', name: 'Priya Singh', role: 'CUSTOMER', company: 'Retail Plus'},
  {email: 'agent1@demo.com', password: 'Agent@123', name: 'Amit Patel', role: 'L1_AGENT', team: 'Support Team A', tickets_handled: 145},
  {email: 'agent2@demo.com', password: 'Agent@123', name: 'Neha Sharma', role: 'L1_AGENT', team: 'Support Team A', tickets_handled: 198},
  {email: 'l2agent@demo.com', password: 'Agent@123', name: 'Vikram Singh', role: 'L2_AGENT', team: 'Technical Support', expertise: 'Technical Issues', tickets_handled: 87},
  {email: 'manager@demo.com', password: 'Manager@123', name: 'Sarah Johnson', role: 'MANAGER', team: 'Support Team A', reports_to: 'Regional Director'},
  {email: 'admin@demo.com', password: 'Admin@123', name: 'System Admin', role: 'ADMIN', access_level: 'Full'}
];

const CATEGORIES = ['Product', 'Service', 'Billing', 'Technical', 'Shipping', 'Quality', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const STATUSES = ['New', 'Under Review', 'In Progress', 'Waiting on Customer', 'Escalated to L2', 'Manager Review', 'Resolved', 'Closed', 'Reopened'];

const SAMPLE_COMPLAINTS = [
  {id: 'CMP-2024-001', title: 'Defective product received', description: 'Product arrived with broken components and packaging was damaged. Need immediate replacement.', category: 'Product', priority: 'High', status: 'In Progress', customer_email: 'customer1@demo.com', assigned_to: 'agent1@demo.com', created_at: Date.now() - 3*24*60*60*1000, sla_hours: 24, comments: [{by: 'agent1@demo.com', text: 'Working on replacement order', time: Date.now() - 2*60*60*1000}]},
  {id: 'CMP-2024-002', title: 'Incorrect billing charges', description: 'Charged twice for single transaction on invoice #12345. Please refund immediately.', category: 'Billing', priority: 'Critical', status: 'Escalated to L2', customer_email: 'customer1@demo.com', assigned_to: 'l2agent@demo.com', created_at: Date.now() - 1*24*60*60*1000, sla_hours: 4, comments: [{by: 'agent1@demo.com', text: 'Escalating to finance team', time: Date.now() - 3*60*60*1000, internal: true}, {by: 'l2agent@demo.com', text: 'Investigating with billing department', time: Date.now() - 1*60*60*1000}]},
  {id: 'CMP-2024-003', title: 'Delayed shipment', description: 'Order #98765 not received after 10 days. Expected delivery was 5 days ago.', category: 'Shipping', priority: 'Medium', status: 'Resolved', customer_email: 'customer2@demo.com', assigned_to: 'agent2@demo.com', created_at: Date.now() - 5*24*60*60*1000, resolved_at: Date.now() - 12*60*60*1000, sla_hours: 48, satisfaction: 4, comments: [{by: 'agent2@demo.com', text: 'Tracked package, arriving today', time: Date.now() - 1*24*60*60*1000}, {by: 'customer2@demo.com', text: 'Received! Thank you', time: Date.now() - 12*60*60*1000}]},
  {id: 'CMP-2024-004', title: 'Login issues with portal', description: 'Unable to login to customer portal. Reset password not working.', category: 'Technical', priority: 'High', status: 'New', customer_email: 'customer2@demo.com', assigned_to: null, created_at: Date.now() - 2*60*60*1000, sla_hours: 12, comments: []},
  {id: 'CMP-2024-005', title: 'Poor customer service experience', description: 'Called support three times, no resolution provided. Very disappointed with service quality.', category: 'Service', priority: 'Medium', status: 'Under Review', customer_email: 'customer1@demo.com', assigned_to: 'agent2@demo.com', created_at: Date.now() - 4*60*60*1000, sla_hours: 24, comments: [{by: 'agent2@demo.com', text: 'Reviewing call records', time: Date.now() - 1*60*60*1000, internal: true}]}
];

const KNOWLEDGE_BASE = [
  {id: 1, category: 'Product', question: 'How do I check warranty status?', answer: 'You can find warranty information in your order receipt or product documentation. For extended warranty, check your account dashboard.', helpful: 45},
  {id: 2, category: 'Billing', question: 'How to raise a refund request?', answer: 'Create a complaint under the Billing category and select "Refund Request". Our team will process it within 3-5 business days.', helpful: 67},
  {id: 3, category: 'Technical', question: 'App is crashing frequently', answer: 'Try clearing your browser cache and cookies. If the issue persists, contact technical support with your device details.', helpful: 34},
  {id: 4, category: 'Shipping', question: 'Where is my order?', answer: 'Track your order using the tracking number provided in your confirmation email. Visit the Shipping section of your account.', helpful: 89},
  {id: 5, category: 'Product', question: 'How to return a product?', answer: 'Initiate a return request within 30 days of delivery. Products must be in original condition with tags attached.', helpful: 56},
  {id: 6, category: 'Service', question: 'How do I escalate my complaint?', answer: 'If your issue is not resolved within the SLA timeframe, it will be automatically escalated to senior support.', helpful: 41}
];

// ==================== APPLICATION STATE ====================
let APP_STATE = {
  currentUser: null,
  currentView: 'login',
  complaints: [...SAMPLE_COMPLAINTS],
  users: [...DEMO_USERS],
  knowledgeBase: [...KNOWLEDGE_BASE],
  selectedComplaintId: null,
  theme: 'light',
  sidebarOpen: false,
  filters: {},
  searchQuery: ''
};

// ==================== UTILITY FUNCTIONS ====================
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

function getUserByEmail(email) {
  return APP_STATE.users.find(u => u.email === email);
}

function getComplaintById(id) {
  return APP_STATE.complaints.find(c => c.id === id);
}

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show' + (isError ? ' error' : '');
  setTimeout(() => toast.className = 'toast', 3000);
}

function showModal(content) {
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = content;
  modal.style.display = 'block';
  
  document.getElementById('modalOverlay').onclick = () => {
    modal.style.display = 'none';
  };
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function getSLAStatus(complaint) {
  if (!complaint.created_at || !complaint.sla_hours) return 'info';
  const elapsed = (Date.now() - complaint.created_at) / 3600000;
  const slaPercent = (elapsed / complaint.sla_hours) * 100;
  
  if (slaPercent >= 100) return 'error';
  if (slaPercent >= 75) return 'warning';
  return 'success';
}

function getSLAText(complaint) {
  if (!complaint.created_at || !complaint.sla_hours) return 'N/A';
  const elapsed = (Date.now() - complaint.created_at) / 3600000;
  const remaining = Math.max(0, complaint.sla_hours - elapsed);
  
  if (remaining === 0) return 'SLA BREACHED';
  if (remaining < 1) return `${Math.floor(remaining * 60)} min left`;
  return `${Math.floor(remaining)}h remaining`;
}

// ==================== AUTHENTICATION ====================
function handleLogin(email, password) {
  const user = APP_STATE.users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (user) {
    APP_STATE.currentUser = user;
    APP_STATE.currentView = 'dashboard';
    showToast(`Welcome back, ${user.name}!`);
    renderApp();
  } else {
    showToast('Invalid credentials. Please try again.', true);
  }
}

function handleLogout() {
  APP_STATE.currentUser = null;
  APP_STATE.currentView = 'login';
  APP_STATE.selectedComplaintId = null;
  renderApp();
}

// ==================== RENDER LOGIN ====================
function renderLogin() {
  return `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 80vh;">
      <div class="card" style="max-width: 420px; width: 100%; padding: var(--space-32);">
        <h2 style="text-align: center; margin-bottom: var(--space-24);">Complaint Management System</h2>
        
        <form id="loginForm" onsubmit="handleLoginSubmit(event)">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" name="email" class="form-control" required autocomplete="username">
          </div>
          
          <div class="form-group">
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-control" required autocomplete="current-password">
          </div>
          
          <button type="submit" class="btn btn--primary btn--full-width">Log In</button>
        </form>
        
        <div style="margin-top: var(--space-24); padding: var(--space-16); background: var(--color-bg-1); border-radius: var(--radius-md);">
          <h4 style="margin-bottom: var(--space-12);">Demo Accounts</h4>
          <div style="font-size: var(--font-size-sm); line-height: 1.8;">
            <strong>Customer:</strong> customer1@demo.com / Customer@123<br>
            <strong>Agent (L1):</strong> agent1@demo.com / Agent@123<br>
            <strong>Agent (L2):</strong> l2agent@demo.com / Agent@123<br>
            <strong>Manager:</strong> manager@demo.com / Manager@123<br>
            <strong>Admin:</strong> admin@demo.com / Admin@123
          </div>
        </div>
      </div>
    </div>
  `;
}

window.handleLoginSubmit = function(e) {
  e.preventDefault();
  const form = e.target;
  handleLogin(form.email.value, form.password.value);
};

// ==================== RENDER SIDEBAR ====================
function renderSidebar() {
  const user = APP_STATE.currentUser;
  if (!user) return '';
  
  const navItems = [
    {id: 'dashboard', label: 'Dashboard', icon: '📊', roles: ['CUSTOMER', 'L1_AGENT', 'L2_AGENT', 'MANAGER', 'ADMIN']},
    {id: 'complaints', label: user.role === 'CUSTOMER' ? 'My Complaints' : 'Complaints', icon: '📝', roles: ['CUSTOMER', 'L1_AGENT', 'L2_AGENT', 'MANAGER', 'ADMIN']},
    {id: 'analytics', label: 'Analytics', icon: '📈', roles: ['MANAGER', 'ADMIN']},
    {id: 'knowledge', label: 'Knowledge Base', icon: '📚', roles: ['CUSTOMER', 'L1_AGENT', 'L2_AGENT', 'MANAGER', 'ADMIN']},
    {id: 'users', label: 'User Management', icon: '👥', roles: ['ADMIN']},
    {id: 'settings', label: 'Settings', icon: '⚙️', roles: ['MANAGER', 'ADMIN']}
  ];
  
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = `
    <div class="sidebar-nav">
      ${navItems
        .filter(item => item.roles.includes(user.role))
        .map(item => `
          <a href="#" 
             class="${APP_STATE.currentView === item.id ? 'active' : ''}"
             onclick="navigateTo('${item.id}'); return false;">
            <span>${item.icon}</span>
            <span>${escapeHtml(item.label)}</span>
          </a>
        `).join('')}
      
      <hr style="margin: var(--space-16) 0; border: none; border-top: 1px solid var(--color-border);">
      
      <a href="#" onclick="handleLogout(); return false;" style="color: var(--color-error);">
        <span>🚪</span>
        <span>Logout</span>
      </a>
    </div>
  `;
}

window.navigateTo = function(view) {
  APP_STATE.currentView = view;
  APP_STATE.selectedComplaintId = null;
  APP_STATE.sidebarOpen = false;
  renderApp();
};

// ==================== RENDER DASHBOARD ====================
function renderDashboard() {
  const user = APP_STATE.currentUser;
  
  if (user.role === 'CUSTOMER') {
    return renderCustomerDashboard();
  } else if (user.role === 'L1_AGENT' || user.role === 'L2_AGENT') {
    return renderAgentDashboard();
  } else if (user.role === 'MANAGER') {
    return renderManagerDashboard();
  } else if (user.role === 'ADMIN') {
    return renderAdminDashboard();
  }
}

function renderCustomerDashboard() {
  const user = APP_STATE.currentUser;
  const myComplaints = APP_STATE.complaints.filter(c => c.customer_email === user.email);
  
  const stats = {
    total: myComplaints.length,
    pending: myComplaints.filter(c => !['Resolved', 'Closed'].includes(c.status)).length,
    resolved: myComplaints.filter(c => c.status === 'Resolved').length,
    closed: myComplaints.filter(c => c.status === 'Closed').length
  };
  
  return `
    <h2>Welcome, ${escapeHtml(user.name)}!</h2>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-24);">Track and manage your complaints</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Complaints</div>
        <div class="stat-value">${stats.total}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Pending</div>
        <div class="stat-value" style="color: var(--color-warning);">${stats.pending}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Resolved</div>
        <div class="stat-value" style="color: var(--color-success);">${stats.resolved}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Closed</div>
        <div class="stat-value" style="color: var(--color-info);">${stats.closed}</div>
      </div>
    </div>
    
    <div style="margin-bottom: var(--space-24);">
      <button class="btn btn--primary" onclick="openNewComplaintForm()">
        + New Complaint
      </button>
    </div>
    
    <h3>Recent Complaints</h3>
    ${renderComplaintsList(myComplaints.slice(0, 5))}
    
    <h3 style="margin-top: var(--space-24);">Quick Actions</h3>
    <div style="display: flex; gap: var(--space-12); flex-wrap: wrap;">
      <button class="btn btn--outline" onclick="navigateTo('complaints')">📝 View All Complaints</button>
      <button class="btn btn--outline" onclick="navigateTo('knowledge')">📚 Browse Help Center</button>
    </div>
  `;
}

function renderAgentDashboard() {
  const user = APP_STATE.currentUser;
  const assigned = APP_STATE.complaints.filter(c => c.assigned_to === user.email && c.status !== 'Closed');
  const resolvedToday = APP_STATE.complaints.filter(c => 
    c.assigned_to === user.email && 
    c.resolved_at && 
    c.resolved_at > Date.now() - 24*60*60*1000
  ).length;
  
  const avgResTime = '18 hours'; // Simulated
  
  return `
    <h2>Hello, ${escapeHtml(user.name)}</h2>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-24);">${user.role} - ${escapeHtml(user.team || 'Support Team')}</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Assigned Complaints</div>
        <div class="stat-value" style="color: var(--color-primary);">${assigned.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Resolved Today</div>
        <div class="stat-value" style="color: var(--color-success);">${resolvedToday}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg. Resolution Time</div>
        <div class="stat-value" style="font-size: var(--font-size-xl);">${avgResTime}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Handled</div>
        <div class="stat-value">${user.tickets_handled || 0}</div>
      </div>
    </div>
    
    <h3>Your Queue</h3>
    ${assigned.length > 0 ? renderComplaintsList(assigned) : '<div class="empty-state">No complaints assigned</div>'}
    
    <h3 style="margin-top: var(--space-24);">SLA Monitoring</h3>
    <div class="card" style="padding: var(--space-16);">
      ${assigned.map(c => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: var(--space-8) 0; border-bottom: 1px solid var(--color-border);">
          <div>
            <strong>${escapeHtml(c.id)}</strong> - ${escapeHtml(c.title)}
            <br><span class="badge">${escapeHtml(c.priority)}</span>
          </div>
          <div style="text-align: right;">
            <span class="status status--${getSLAStatus(c)}">${getSLAText(c)}</span>
            <br><button class="btn btn--sm btn--secondary" onclick="viewComplaint('${c.id}')" style="margin-top: var(--space-4);">Open</button>
          </div>
        </div>
      `).join('') || '<div class="empty-state">No active SLAs</div>'}
    </div>
  `;
}

function renderManagerDashboard() {
  const user = APP_STATE.currentUser;
  const teamAgents = APP_STATE.users.filter(u => u.team === user.team && u.role.includes('AGENT'));
  const teamComplaints = APP_STATE.complaints.filter(c => 
    teamAgents.some(a => a.email === c.assigned_to)
  );
  
  const escalated = teamComplaints.filter(c => c.status.includes('Escalated'));
  const resolved = teamComplaints.filter(c => c.status === 'Resolved');
  const slaCompliance = ((resolved.length / teamComplaints.length) * 100).toFixed(1);
  
  return `
    <h2>Manager Dashboard</h2>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-24);">Team: ${escapeHtml(user.team)}</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Team Complaints</div>
        <div class="stat-value">${teamComplaints.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">SLA Compliance</div>
        <div class="stat-value" style="color: var(--color-success);">${slaCompliance}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Resolved</div>
        <div class="stat-value" style="color: var(--color-success);">${resolved.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Escalations</div>
        <div class="stat-value" style="color: var(--color-warning);">${escalated.length}</div>
      </div>
    </div>
    
    <h3>Escalation Pipeline</h3>
    ${escalated.length > 0 ? renderComplaintsList(escalated) : '<div class="empty-state">No escalations</div>'}
    
    <h3 style="margin-top: var(--space-24);">Team Performance</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: var(--space-16);">
      ${teamAgents.map(agent => {
        const agentComplaints = teamComplaints.filter(c => c.assigned_to === agent.email);
        return `
          <div class="card" style="padding: var(--space-16);">
            <h4>${escapeHtml(agent.name)}</h4>
            <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm);">${agent.role}</p>
            <div style="margin-top: var(--space-8);">
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Assigned: <strong>${agentComplaints.length}</strong></div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Total Handled: <strong>${agent.tickets_handled || 0}</strong></div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    
    <div style="margin-top: var(--space-24);">
      <button class="btn btn--primary" onclick="navigateTo('analytics')">📈 View Detailed Analytics</button>
    </div>
  `;
}

function renderAdminDashboard() {
  const totalComplaints = APP_STATE.complaints.length;
  const activeUsers = APP_STATE.users.length;
  const newToday = APP_STATE.complaints.filter(c => c.created_at > Date.now() - 24*60*60*1000).length;
  
  return `
    <h2>System Administration</h2>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-24);">Enterprise Complaint Management Overview</p>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Complaints</div>
        <div class="stat-value">${totalComplaints}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Users</div>
        <div class="stat-value">${activeUsers}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">New Today</div>
        <div class="stat-value" style="color: var(--color-primary);">${newToday}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">System Health</div>
        <div class="stat-value" style="font-size: var(--font-size-xl);">
          <span class="status status--success">HEALTHY</span>
        </div>
      </div>
    </div>
    
    <h3>Quick Actions</h3>
    <div style="display: flex; gap: var(--space-12); flex-wrap: wrap; margin-bottom: var(--space-24);">
      <button class="btn btn--primary" onclick="navigateTo('users')">👥 Manage Users</button>
      <button class="btn btn--outline" onclick="navigateTo('analytics')">📈 View Analytics</button>
      <button class="btn btn--outline" onclick="navigateTo('settings')">⚙️ System Settings</button>
      <button class="btn btn--outline" onclick="showToast('Export started')">Export Reports</button>
    </div>
    
    <h3>Recent Activity</h3>
    ${renderComplaintsList(APP_STATE.complaints.slice(0, 5))}
  `;
}

// ==================== RENDER COMPLAINTS LIST ====================
function renderComplaintsList(complaints) {
  if (!complaints || complaints.length === 0) {
    return '<div class="empty-state">📝 No complaints found</div>';
  }
  
  return `
    <div class="card" style="overflow-x: auto;">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${complaints.map(c => {
            const assignedUser = c.assigned_to ? getUserByEmail(c.assigned_to) : null;
            return `
              <tr>
                <td><strong>${escapeHtml(c.id)}</strong></td>
                <td>${escapeHtml(c.title)}</td>
                <td><span class="badge">${escapeHtml(c.category)}</span></td>
                <td><span class="status status--${c.priority === 'Critical' ? 'error' : c.priority === 'High' ? 'warning' : 'info'}">${escapeHtml(c.priority)}</span></td>
                <td><span class="badge">${escapeHtml(c.status)}</span></td>
                <td>${assignedUser ? escapeHtml(assignedUser.name) : '<em>Unassigned</em>'}</td>
                <td style="white-space: nowrap;">${formatDate(c.created_at)}</td>
                <td><button class="btn btn--sm btn--outline" onclick="viewComplaint('${c.id}')">View</button></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

window.viewComplaint = function(complaintId) {
  APP_STATE.selectedComplaintId = complaintId;
  APP_STATE.currentView = 'complaint-detail';
  renderApp();
};

// ==================== RENDER COMPLAINTS PAGE ====================
function renderComplaintsPage() {
  const user = APP_STATE.currentUser;
  let complaints;
  
  if (user.role === 'CUSTOMER') {
    complaints = APP_STATE.complaints.filter(c => c.customer_email === user.email);
  } else if (user.role === 'L1_AGENT' || user.role === 'L2_AGENT') {
    complaints = APP_STATE.complaints.filter(c => c.assigned_to === user.email);
  } else {
    complaints = APP_STATE.complaints;
  }
  
  // Apply search filter
  if (APP_STATE.searchQuery) {
    const query = APP_STATE.searchQuery.toLowerCase();
    complaints = complaints.filter(c => 
      c.id.toLowerCase().includes(query) ||
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query)
    );
  }
  
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-24);">
      <h2>${user.role === 'CUSTOMER' ? 'My Complaints' : 'Complaints'}</h2>
      ${user.role === 'CUSTOMER' ? '<button class="btn btn--primary" onclick="openNewComplaintForm()">+ New Complaint</button>' : ''}
    </div>
    
    <div style="margin-bottom: var(--space-16);">
      <input type="search" 
             class="form-control" 
             placeholder="Search complaints..." 
             value="${escapeHtml(APP_STATE.searchQuery)}"
             oninput="handleSearch(this.value)"
             style="max-width: 400px;">
    </div>
    
    <div style="display: flex; gap: var(--space-8); margin-bottom: var(--space-16); flex-wrap: wrap;">
      <button class="btn btn--sm btn--outline" onclick="filterByStatus('all')">All</button>
      <button class="btn btn--sm btn--outline" onclick="filterByStatus('New')">New</button>
      <button class="btn btn--sm btn--outline" onclick="filterByStatus('In Progress')">In Progress</button>
      <button class="btn btn--sm btn--outline" onclick="filterByStatus('Resolved')">Resolved</button>
    </div>
    
    ${renderComplaintsList(complaints)}
  `;
}

window.handleSearch = function(value) {
  APP_STATE.searchQuery = value;
  renderApp();
};

window.filterByStatus = function(status) {
  if (status === 'all') {
    APP_STATE.searchQuery = '';
  } else {
    APP_STATE.searchQuery = status;
  }
  renderApp();
};

// ==================== NEW COMPLAINT FORM ====================
window.openNewComplaintForm = function() {
  let formStep = 1;
  let formData = {category: '', title: '', description: '', priority: 'Medium'};
  
  function renderStep() {
    let content = '';
    
    if (formStep === 1) {
      content = `
        <h3>New Complaint - Step 1 of 3</h3>
        <p style="color: var(--color-text-secondary);">Select category</p>
        <div class="form-group">
          <label class="form-label">Category</label>
          <select class="form-control" id="complaintCategory">
            <option value="">Select a category</option>
            ${CATEGORIES.map(cat => `<option value="${cat}" ${formData.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (formStep === 2) {
      content = `
        <h3>New Complaint - Step 2 of 3</h3>
        <p style="color: var(--color-text-secondary);">Provide details</p>
        <div class="form-group">
          <label class="form-label">Title <span style="float: right; font-size: var(--font-size-xs);"><span id="titleCount">0</span>/100</span></label>
          <input type="text" class="form-control" id="complaintTitle" maxlength="100" value="${escapeHtml(formData.title)}" oninput="document.getElementById('titleCount').textContent = this.value.length">
        </div>
        <div class="form-group">
          <label class="form-label">Description <span style="float: right; font-size: var(--font-size-xs);"><span id="descCount">0</span>/500</span></label>
          <textarea class="form-control" id="complaintDescription" rows="5" maxlength="500" oninput="document.getElementById('descCount').textContent = this.value.length">${escapeHtml(formData.description)}</textarea>
        </div>
      `;
    } else if (formStep === 3) {
      content = `
        <h3>New Complaint - Step 3 of 3</h3>
        <p style="color: var(--color-text-secondary);">Set priority and review</p>
        <div class="form-group">
          <label class="form-label">Priority</label>
          <select class="form-control" id="complaintPriority">
            ${PRIORITIES.map(p => `<option value="${p}" ${formData.priority === p ? 'selected' : ''}>${p}</option>`).join('')}
          </select>
        </div>
        <div class="card" style="padding: var(--space-16); background: var(--color-bg-1);">
          <h4>Review</h4>
          <p><strong>Category:</strong> ${escapeHtml(formData.category)}</p>
          <p><strong>Title:</strong> ${escapeHtml(formData.title)}</p>
          <p><strong>Description:</strong> ${escapeHtml(formData.description)}</p>
        </div>
      `;
    }
    
    content += `
      <div class="progress" style="margin: var(--space-16) 0;">
        <div class="progress-bar" style="width: ${(formStep / 3) * 100}%;"></div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: var(--space-16);">
        <button class="btn btn--outline" onclick="complaintFormPrev()" ${formStep === 1 ? 'disabled' : ''}>Previous</button>
        <button class="btn btn--primary" onclick="complaintFormNext()">${formStep === 3 ? 'Submit' : 'Next'}</button>
      </div>
    `;
    
    showModal(content);
    
    if (formStep === 2) {
      setTimeout(() => {
        document.getElementById('titleCount').textContent = formData.title.length;
        document.getElementById('descCount').textContent = formData.description.length;
      }, 50);
    }
  }
  
  window.complaintFormPrev = function() {
    if (formStep > 1) {
      formStep--;
      renderStep();
    }
  };
  
  window.complaintFormNext = function() {
    if (formStep === 1) {
      const category = document.getElementById('complaintCategory').value;
      if (!category) {
        showToast('Please select a category', true);
        return;
      }
      formData.category = category;
      formStep++;
      renderStep();
    } else if (formStep === 2) {
      const title = document.getElementById('complaintTitle').value.trim();
      const description = document.getElementById('complaintDescription').value.trim();
      if (!title || title.length < 10) {
        showToast('Title must be at least 10 characters', true);
        return;
      }
      if (!description || description.length < 20) {
        showToast('Description must be at least 20 characters', true);
        return;
      }
      formData.title = title;
      formData.description = description;
      formStep++;
      renderStep();
    } else if (formStep === 3) {
      formData.priority = document.getElementById('complaintPriority').value;
      submitNewComplaint(formData);
    }
  };
  
  renderStep();
};

function submitNewComplaint(data) {
  const newComplaint = {
    id: `CMP-2024-${String(APP_STATE.complaints.length + 1).padStart(3, '0')}`,
    title: data.title,
    description: data.description,
    category: data.category,
    priority: data.priority,
    status: 'New',
    customer_email: APP_STATE.currentUser.email,
    assigned_to: null,
    created_at: Date.now(),
    sla_hours: data.priority === 'Critical' ? 4 : data.priority === 'High' ? 12 : 24,
    comments: []
  };
  
  APP_STATE.complaints.unshift(newComplaint);
  closeModal();
  showToast('Complaint submitted successfully!');
  APP_STATE.currentView = 'complaints';
  renderApp();
}

// ==================== COMPLAINT DETAIL ====================
function renderComplaintDetail() {
  const complaint = getComplaintById(APP_STATE.selectedComplaintId);
  if (!complaint) {
    return '<div class="empty-state">Complaint not found</div>';
  }
  
  const customer = getUserByEmail(complaint.customer_email);
  const assignedUser = complaint.assigned_to ? getUserByEmail(complaint.assigned_to) : null;
  const user = APP_STATE.currentUser;
  const canEdit = ['L1_AGENT', 'L2_AGENT', 'MANAGER', 'ADMIN'].includes(user.role);
  
  return `
    <div style="margin-bottom: var(--space-16);">
      <button class="btn btn--outline btn--sm" onclick="navigateTo('complaints')">&larr; Back</button>
    </div>
    
    <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-24);">
      <div>
        <div class="card" style="padding: var(--space-24);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-16);">
            <div>
              <h2 style="margin-bottom: var(--space-8);">${escapeHtml(complaint.title)}</h2>
              <div style="display: flex; gap: var(--space-8); flex-wrap: wrap;">
                <span class="badge">${escapeHtml(complaint.id)}</span>
                <span class="badge">${escapeHtml(complaint.category)}</span>
                <span class="status status--${complaint.priority === 'Critical' ? 'error' : complaint.priority === 'High' ? 'warning' : 'info'}">${escapeHtml(complaint.priority)}</span>
                <span class="badge">${escapeHtml(complaint.status)}</span>
                <span class="status status--${getSLAStatus(complaint)}">${getSLAText(complaint)}</span>
              </div>
            </div>
            ${canEdit ? `
              <div style="display: flex; gap: var(--space-8);">
                <button class="btn btn--sm btn--outline" onclick="updateComplaintStatus('${complaint.id}')">Update Status</button>
                <button class="btn btn--sm btn--secondary" onclick="assignComplaint('${complaint.id}')">Assign</button>
              </div>
            ` : ''}
          </div>
          
          <div class="card" style="padding: var(--space-16); background: var(--color-bg-1); margin-bottom: var(--space-16);">
            <h4>Description</h4>
            <p>${escapeHtml(complaint.description)}</p>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-16); margin-bottom: var(--space-16);">
            <div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Customer</div>
              <div style="font-weight: var(--font-weight-semibold);">${escapeHtml(customer?.name || 'Unknown')}</div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${escapeHtml(complaint.customer_email)}</div>
            </div>
            <div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Assigned To</div>
              <div style="font-weight: var(--font-weight-semibold);">${assignedUser ? escapeHtml(assignedUser.name) : '<em>Unassigned</em>'}</div>
              ${assignedUser ? `<div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${escapeHtml(assignedUser.role)}</div>` : ''}
            </div>
            <div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Created</div>
              <div style="font-weight: var(--font-weight-semibold);">${formatDate(complaint.created_at)}</div>
            </div>
            ${complaint.resolved_at ? `
              <div>
                <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">Resolved</div>
                <div style="font-weight: var(--font-weight-semibold);">${formatDate(complaint.resolved_at)}</div>
              </div>
            ` : ''}
          </div>
          
          <h4>Status Timeline</h4>
          <ul class="timeline">
            <li>Created - ${formatDate(complaint.created_at)}</li>
            ${complaint.status !== 'New' ? `<li>Updated to: ${escapeHtml(complaint.status)}</li>` : ''}
            ${complaint.resolved_at ? `<li>Resolved - ${formatDate(complaint.resolved_at)}</li>` : ''}
          </ul>
        </div>
        
        <div class="card" style="padding: var(--space-24); margin-top: var(--space-24);">
          <h3>Comments &amp; Updates</h3>
          
          ${(complaint.comments || []).length > 0 ? `
            <div style="margin: var(--space-16) 0;">
              ${complaint.comments.map(comment => {
                const commentUser = getUserByEmail(comment.by);
                const isInternal = comment.internal && user.role !== 'CUSTOMER';
                if (comment.internal && user.role === 'CUSTOMER') return '';
                
                return `
                  <div class="card" style="padding: var(--space-12); margin-bottom: var(--space-12); ${isInternal ? 'background: var(--color-bg-2);' : ''}">
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-8);">
                      <strong>${escapeHtml(commentUser?.name || comment.by)}</strong>
                      ${isInternal ? '<span class="badge">Internal Note</span>' : ''}
                    </div>
                    <p style="margin: 0;">${escapeHtml(comment.text)}</p>
                    <div style="font-size: var(--font-size-xs); color: var(--color-text-secondary); margin-top: var(--space-8);">${formatDate(comment.time)}</div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : '<p style="color: var(--color-text-secondary);">No comments yet</p>'}
          
          <div class="form-group">
            <textarea class="form-control" id="newComment" rows="3" placeholder="Add a comment..."></textarea>
          </div>
          <div style="display: flex; gap: var(--space-8);">
            <button class="btn btn--primary" onclick="addComment('${complaint.id}', false)">Add Comment</button>
            ${canEdit ? '<button class="btn btn--secondary" onclick="addComment(\''+complaint.id+'\', true)">Add Internal Note</button>' : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

window.updateComplaintStatus = function(complaintId) {
  const complaint = getComplaintById(complaintId);
  showModal(`
    <h3>Update Status</h3>
    <div class="form-group">
      <label class="form-label">New Status</label>
      <select class="form-control" id="newStatus">
        ${STATUSES.map(s => `<option value="${s}" ${s === complaint.status ? 'selected' : ''}>${s}</option>`).join('')}
      </select>
    </div>
    <div style="display: flex; gap: var(--space-8); justify-content: flex-end;">
      <button class="btn btn--outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn--primary" onclick="saveComplaintStatus('${complaintId}')">Save</button>
    </div>
  `);
};

window.saveComplaintStatus = function(complaintId) {
  const newStatus = document.getElementById('newStatus').value;
  const complaint = getComplaintById(complaintId);
  complaint.status = newStatus;
  
  if (newStatus === 'Resolved' && !complaint.resolved_at) {
    complaint.resolved_at = Date.now();
  }
  
  closeModal();
  showToast('Status updated successfully');
  renderApp();
};

window.assignComplaint = function(complaintId) {
  const agents = APP_STATE.users.filter(u => u.role.includes('AGENT'));
  showModal(`
    <h3>Assign Complaint</h3>
    <div class="form-group">
      <label class="form-label">Assign To</label>
      <select class="form-control" id="assignAgent">
        <option value="">Select agent...</option>
        ${agents.map(a => `<option value="${a.email}">${a.name} (${a.role})</option>`).join('')}
      </select>
    </div>
    <div style="display: flex; gap: var(--space-8); justify-content: flex-end;">
      <button class="btn btn--outline" onclick="closeModal()">Cancel</button>
      <button class="btn btn--primary" onclick="saveAssignment('${complaintId}')">Assign</button>
    </div>
  `);
};

window.saveAssignment = function(complaintId) {
  const agentEmail = document.getElementById('assignAgent').value;
  if (!agentEmail) {
    showToast('Please select an agent', true);
    return;
  }
  
  const complaint = getComplaintById(complaintId);
  complaint.assigned_to = agentEmail;
  
  if (complaint.status === 'New') {
    complaint.status = 'Under Review';
  }
  
  closeModal();
  showToast('Complaint assigned successfully');
  renderApp();
};

window.addComment = function(complaintId, isInternal) {
  const commentText = document.getElementById('newComment').value.trim();
  if (!commentText) {
    showToast('Please enter a comment', true);
    return;
  }
  
  const complaint = getComplaintById(complaintId);
  if (!complaint.comments) complaint.comments = [];
  
  complaint.comments.push({
    by: APP_STATE.currentUser.email,
    text: commentText,
    time: Date.now(),
    internal: isInternal
  });
  
  showToast('Comment added');
  renderApp();
};

// ==================== ANALYTICS ====================
function renderAnalytics() {
  const complaints = APP_STATE.complaints;
  
  // Category distribution
  const categoryData = {};
  CATEGORIES.forEach(cat => {
    categoryData[cat] = complaints.filter(c => c.category === cat).length;
  });
  
  // Priority distribution
  const priorityData = {};
  PRIORITIES.forEach(pri => {
    priorityData[pri] = complaints.filter(c => c.priority === pri).length;
  });
  
  // Status distribution
  const statusData = {};
  STATUSES.forEach(status => {
    statusData[status] = complaints.filter(c => c.status === status).length;
  });
  
  setTimeout(() => {
    // Category Chart
    const ctxCat = document.getElementById('chartCategory');
    if (ctxCat) {
      new Chart(ctxCat, {
        type: 'pie',
        data: {
          labels: Object.keys(categoryData),
          datasets: [{
            data: Object.values(categoryData),
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#964325']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Complaints by Category' }
          }
        }
      });
    }
    
    // Priority Chart
    const ctxPri = document.getElementById('chartPriority');
    if (ctxPri) {
      new Chart(ctxPri, {
        type: 'bar',
        data: {
          labels: Object.keys(priorityData),
          datasets: [{
            label: 'Count',
            data: Object.values(priorityData),
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#DB4545']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Complaints by Priority' }
          }
        }
      });
    }
    
    // Status Chart
    const ctxStatus = document.getElementById('chartStatus');
    if (ctxStatus) {
      new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
          labels: Object.keys(statusData).filter(k => statusData[k] > 0),
          datasets: [{
            data: Object.values(statusData).filter(v => v > 0),
            backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' },
            title: { display: true, text: 'Complaints by Status' }
          }
        }
      });
    }
  }, 100);
  
  return `
    <h2>Analytics &amp; Reports</h2>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-24);">Comprehensive complaint insights</p>
    
    <div style="margin-bottom: var(--space-24);">
      <button class="btn btn--primary" onclick="showToast('Report exported successfully!')">📊 Export Report</button>
    </div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-24); margin-bottom: var(--space-32);">
      <div class="card" style="padding: var(--space-16);">
        <div class="chart-container">
          <canvas id="chartCategory"></canvas>
        </div>
      </div>
      <div class="card" style="padding: var(--space-16);">
        <div class="chart-container">
          <canvas id="chartPriority"></canvas>
        </div>
      </div>
      <div class="card" style="padding: var(--space-16);">
        <div class="chart-container">
          <canvas id="chartStatus"></canvas>
        </div>
      </div>
    </div>
    
    <h3>Agent Performance</h3>
    <div class="card" style="overflow-x: auto;">
      <table>
        <thead>
          <tr>
            <th>Agent Name</th>
            <th>Role</th>
            <th>Team</th>
            <th>Assigned</th>
            <th>Resolved</th>
            <th>Total Handled</th>
          </tr>
        </thead>
        <tbody>
          ${APP_STATE.users.filter(u => u.role.includes('AGENT')).map(agent => {
            const assigned = complaints.filter(c => c.assigned_to === agent.email && c.status !== 'Resolved');
            const resolved = complaints.filter(c => c.assigned_to === agent.email && c.status === 'Resolved');
            return `
              <tr>
                <td>${escapeHtml(agent.name)}</td>
                <td><span class="badge">${escapeHtml(agent.role)}</span></td>
                <td>${escapeHtml(agent.team || '-')}</td>
                <td>${assigned.length}</td>
                <td style="color: var(--color-success); font-weight: var(--font-weight-semibold);">${resolved.length}</td>
                <td><strong>${agent.tickets_handled || 0}</strong></td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ==================== KNOWLEDGE BASE ====================
function renderKnowledgeBase() {
  let filteredKB = APP_STATE.knowledgeBase;
  
  if (APP_STATE.searchQuery) {
    const query = APP_STATE.searchQuery.toLowerCase();
    filteredKB = filteredKB.filter(kb => 
      kb.question.toLowerCase().includes(query) ||
      kb.answer.toLowerCase().includes(query) ||
      kb.category.toLowerCase().includes(query)
    );
  }
  
  return `
    <h2>Knowledge Base</h2>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-24);">Find answers to common questions</p>
    
    <div style="margin-bottom: var(--space-24);">
      <input type="search" 
             class="form-control" 
             placeholder="Search articles..." 
             value="${escapeHtml(APP_STATE.searchQuery)}"
             oninput="handleSearch(this.value)"
             style="max-width: 500px;">
    </div>
    
    <div style="display: flex; gap: var(--space-8); margin-bottom: var(--space-24); flex-wrap: wrap;">
      ${CATEGORIES.map(cat => `
        <button class="btn btn--sm btn--outline" onclick="handleSearch('${cat}')">${escapeHtml(cat)}</button>
      `).join('')}
      <button class="btn btn--sm btn--secondary" onclick="handleSearch('')">Clear</button>
    </div>
    
    ${filteredKB.length > 0 ? `
      <div style="display: grid; gap: var(--space-16);">
        ${filteredKB.map(kb => `
          <div class="card" style="padding: var(--space-20);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: var(--space-12);">
              <div>
                <span class="badge" style="margin-bottom: var(--space-8);">${escapeHtml(kb.category)}</span>
                <h4 style="margin: var(--space-8) 0;">${escapeHtml(kb.question)}</h4>
              </div>
            </div>
            <p style="color: var(--color-text-secondary);">${escapeHtml(kb.answer)}</p>
            <div style="display: flex; gap: var(--space-16); margin-top: var(--space-12); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
              <span>✅ ${kb.helpful} people found this helpful</span>
            </div>
          </div>
        `).join('')}
      </div>
    ` : '<div class="empty-state">🔍 No articles found</div>'}
  `;
}

// ==================== USER MANAGEMENT ====================
function renderUserManagement() {
  return `
    <h2>User Management</h2>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-24);">Manage system users and roles</p>
    
    <div style="margin-bottom: var(--space-16);">
      <button class="btn btn--primary" onclick="showToast('Add user feature - coming soon')">👥 Add New User</button>
    </div>
    
    <div class="card" style="overflow-x: auto;">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Team</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${APP_STATE.users.map(user => `
            <tr>
              <td><strong>${escapeHtml(user.name)}</strong></td>
              <td>${escapeHtml(user.email)}</td>
              <td><span class="badge">${escapeHtml(user.role)}</span></td>
              <td>${escapeHtml(user.team || user.company || '-')}</td>
              <td><span class="status status--success">Active</span></td>
              <td>
                <button class="btn btn--sm btn--outline" onclick="showToast('Edit user feature')">Edit</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// ==================== SETTINGS ====================
function renderSettings() {
  return `
    <h2>System Settings</h2>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-24);">Configure system preferences</p>
    
    <div class="card" style="padding: var(--space-24); margin-bottom: var(--space-16);">
      <h3>SLA Configuration</h3>
      <div class="form-group">
        <label class="form-label">Critical Priority SLA (hours)</label>
        <input type="number" class="form-control" value="4" style="max-width: 200px;">
      </div>
      <div class="form-group">
        <label class="form-label">High Priority SLA (hours)</label>
        <input type="number" class="form-control" value="12" style="max-width: 200px;">
      </div>
      <div class="form-group">
        <label class="form-label">Medium Priority SLA (hours)</label>
        <input type="number" class="form-control" value="24" style="max-width: 200px;">
      </div>
      <button class="btn btn--primary" onclick="showToast('Settings saved')">Save Changes</button>
    </div>
    
    <div class="card" style="padding: var(--space-24);">
      <h3>Email Notifications</h3>
      <div style="display: flex; align-items: center; gap: var(--space-12); margin-bottom: var(--space-12);">
        <input type="checkbox" id="notifNew" checked>
        <label for="notifNew">New complaint assigned</label>
      </div>
      <div style="display: flex; align-items: center; gap: var(--space-12); margin-bottom: var(--space-12);">
        <input type="checkbox" id="notifSLA" checked>
        <label for="notifSLA">SLA breach warning</label>
      </div>
      <div style="display: flex; align-items: center; gap: var(--space-12); margin-bottom: var(--space-12);">
        <input type="checkbox" id="notifResolved" checked>
        <label for="notifResolved">Complaint resolved</label>
      </div>
      <button class="btn btn--primary" onclick="showToast('Notification settings saved')">Save Preferences</button>
    </div>
  `;
}

// ==================== MAIN RENDER FUNCTION ====================
function renderApp() {
  const mainContent = document.getElementById('mainContent');
  const logoutBtn = document.getElementById('logoutBtn');
  
  if (!APP_STATE.currentUser) {
    document.getElementById('sidebar').innerHTML = '';
    logoutBtn.style.display = 'none';
    mainContent.innerHTML = renderLogin();
    return;
  }
  
  logoutBtn.style.display = 'inline-flex';
  renderSidebar();
  
  let content = '';
  
  switch (APP_STATE.currentView) {
    case 'dashboard':
      content = renderDashboard();
      break;
    case 'complaints':
      content = renderComplaintsPage();
      break;
    case 'complaint-detail':
      content = renderComplaintDetail();
      break;
    case 'analytics':
      content = renderAnalytics();
      break;
    case 'knowledge':
      content = renderKnowledgeBase();
      break;
    case 'users':
      content = renderUserManagement();
      break;
    case 'settings':
      content = renderSettings();
      break;
    default:
      content = renderDashboard();
  }
  
  mainContent.innerHTML = content;
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', function() {
    APP_STATE.theme = APP_STATE.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-color-scheme', APP_STATE.theme);
    this.textContent = APP_STATE.theme === 'dark' ? '☀️' : '🌙';
  });
  
  // Sidebar toggle for mobile
  document.getElementById('sidebarToggle').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
  });
  
  // Logout button
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  
  // Initial render
  renderApp();
});
