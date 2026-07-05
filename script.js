// Team Nexus - Main Application JavaScript

// Sample Data Store
let appData = {
    currentUser: {
        id: 1,
        name: 'Admin User',
        role: 'admin',
        avatar: '👤',
        joinDate: '2024-01-01',
        groups: [],
        followers: [],
        following: [],
        points: 1250
    },
    users: [
        { id: 1, name: 'Admin User', role: 'admin', points: 1250, avatar: '👤' },
        { id: 2, name: 'Team Leader', role: 'leader', points: 980, avatar: '👨‍💼' },
        { id: 3, name: 'Co-Leader One', role: 'coleader', points: 850, avatar: '👩‍💼' },
        { id: 4, name: 'Member One', role: 'member', points: 650, avatar: '👨‍💻' },
        { id: 5, name: 'Member Two', role: 'member', points: 520, avatar: '👩‍💻' },
        { id: 6, name: 'Member Three', role: 'member', points: 430, avatar: '🧑‍💻' }
    ],
    groups: [
        { id: 1, name: 'Development Team', description: 'Core development team for project X', privacy: 'public', members: 15, leader: 'Team Leader', createdAt: '2024-01-15' },
        { id: 2, name: 'Design Squad', description: 'UI/UX design team', privacy: 'public', members: 8, leader: 'Co-Leader One', createdAt: '2024-02-01' },
        { id: 3, name: 'Strategy Group', description: 'Private strategy planning group', privacy: 'private', members: 5, leader: 'Admin User', createdAt: '2024-01-20' }
    ],
    polls: [
        { id: 1, question: 'Which feature should we prioritize?', options: [
            { text: 'Real-time Chat', votes: 12 },
            { text: 'File Sharing', votes: 8 },
            { text: 'Video Calls', votes: 5 }
        ], totalVotes: 25, status: 'active' },
        { id: 2, question: 'Best team building activity?', options: [
            { text: 'Gaming Session', votes: 15 },
            { text: 'Virtual Coffee', votes: 7 },
            { text: 'Coding Challenge', votes: 10 }
        ], totalVotes: 32, status: 'active' }
    ],
    activities: [
        { user: 'Team Leader', action: 'created a new group', target: 'Development Team', time: '2 hours ago' },
        { user: 'Member One', action: 'voted on', target: 'Feature Priority Poll', time: '3 hours ago' },
        { user: 'Co-Leader One', action: 'joined', target: 'Design Squad', time: '5 hours ago' }
    ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateDashboard();
    loadGroups();
    loadLeaderboard();
    loadMembers();
    loadPolls();
    loadProfile();
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    // Update navigation active state
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Dashboard Functions
function updateDashboard() {
    // Update stats
    document.getElementById('totalMembers').textContent = appData.users.length;
    document.getElementById('activeGroups').textContent = appData.groups.length;
    document.getElementById('activePolls').textContent = appData.polls.filter(p => p.status === 'active').length;
    document.getElementById('topPerformers').textContent = '3';
    
    // Recent Activity
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = appData.activities.map(activity => `
        <div class="activity-item" style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">
            <strong>${activity.user}</strong> ${activity.action} <strong>${activity.target}</strong>
            <br><small style="color: var(--text-secondary);">${activity.time}</small>
        </div>
    `).join('');
    
    // Dashboard Groups
    const dashboardGroups = document.getElementById('dashboardGroups');
    dashboardGroups.innerHTML = appData.groups.slice(0, 3).map(group => `
        <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${group.name}</strong>
                <br><small style="color: var(--text-secondary);">${group.privacy} • ${group.members} members</small>
            </div>
            <span class="role-badge role-${group.privacy === 'public' ? 'member' : 'leader'}">
                ${group.privacy}
            </span>
        </div>
    `).join('');
    
    // Dashboard Leaderboard
    const dashboardLeaderboard = document.getElementById('dashboardLeaderboard');
    const sortedUsers = [...appData.users].sort((a, b) => b.points - a.points);
    dashboardLeaderboard.innerHTML = sortedUsers.slice(0, 5).map((user, index) => `
        <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-color); display: flex; align-items: center; gap: 1rem;">
            <span class="rank rank-${index + 1}" style="font-size: 1.2rem;">#${index + 1}</span>
            <span>${user.avatar}</span>
            <div style="flex: 1;">
                <strong>${user.name}</strong>
                <br><small style="color: var(--text-secondary);">${user.points} points</small>
            </div>
        </div>
    `).join('');
}

// Groups Functions
function loadGroups(filter = 'all') {
    const groupsGrid = document.getElementById('groupsGrid');
    let filteredGroups = appData.groups;
    
    if (filter === 'public') {
        filteredGroups = appData.groups.filter(g => g.privacy === 'public');
    } else if (filter === 'private') {
        filteredGroups = appData.groups.filter(g => g.privacy === 'private');
    }
    
    groupsGrid.innerHTML = filteredGroups.map(group => `
        <div class="group-card">
            <h3>${group.name}</h3>
            <p>${group.description}</p>
            <div class="group-meta">
                <span><i class="fas fa-users"></i> ${group.members} members</span>
                <span><i class="fas fa-${group.privacy === 'public' ? 'globe' : 'lock'}"></i> ${group.privacy}</span>
                <span><i class="fas fa-crown"></i> ${group.leader}</span>
            </div>
            <div class="group-actions">
                <button class="btn btn-primary" onclick="joinGroup(${group.id})">
                    <i class="fas fa-plus"></i> Join
                </button>
                <button class="btn btn-secondary" onclick="viewGroup(${group.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        </div>
    `).join('');
}

function filterGroups(filter) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    loadGroups(filter);
}

function openCreateGroupModal() {
    document.getElementById('createGroupModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function createGroup(event) {
    event.preventDefault();
    const name = document.getElementById('groupName').value;
    const description = document.getElementById('groupDescription').value;
    const privacy = document.getElementById('groupPrivacy').value;
    
    const newGroup = {
        id: appData.groups.length + 1,
        name: name,
        description: description,
        privacy: privacy,
        members: 1,
        leader: appData.currentUser.name,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    appData.groups.push(newGroup);
    closeModal('createGroupModal');
    loadGroups();
    updateDashboard();
    
    // Add activity
    appData.activities.unshift({
        user: appData.currentUser.name,
        action: 'created a new group',
        target: name,
        time: 'Just now'
    });
}

function joinGroup(groupId) {
    alert('Joined group successfully!');
    const group = appData.groups.find(g => g.id === groupId);
    if (group) {
        group.members++;
        loadGroups();
        updateDashboard();
    }
}

function viewGroup(groupId) {
    alert('Viewing group details...');
}

// Leaderboard Functions
function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    const sortedUsers = [...appData.users].sort((a, b) => b.points - a.points);
    
    leaderboardList.innerHTML = sortedUsers.map((user, index) => `
        <div class="leaderboard-item">
            <span class="rank rank-${index + 1}">#${index + 1}</span>
            <span style="font-size: 2rem;">${user.avatar}</span>
            <div style="flex: 1;">
                <h3>${user.name}</h3>
                <span class="role-badge role-${user.role}">${user.role}</span>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">${user.points}</div>
                <small style="color: var(--text-secondary);">points</small>
            </div>
        </div>
    `).join('');
}

// Members Functions
function loadMembers() {
    const membersGrid = document.getElementById('membersGrid');
    
    membersGrid.innerHTML = appData.users.map(user => `
        <div class="member-card">
            <div class="member-avatar">${user.avatar}</div>
            <div class="member-info">
                <h3>${user.name}</h3>
                <span class="role-badge role-${user.role}">${user.role}</span>
            </div>
            ${user.id !== appData.currentUser.id ? `
                <button class="follow-btn ${appData.currentUser.following.includes(user.id) ? 'following' : ''}" 
                        onclick="toggleFollow(${user.id})">
                    ${appData.currentUser.following.includes(user.id) ? 'Following' : 'Follow'}
                </button>
            ` : ''}
        </div>
    `).join('');
}

function toggleFollow(userId) {
    const index = appData.currentUser.following.indexOf(userId);
    if (index > -1) {
        appData.currentUser.following.splice(index, 1);
    } else {
        appData.currentUser.following.push(userId);
    }
    loadMembers();
    updateDashboard();
}

function searchMembers() {
    const searchTerm = document.getElementById('memberSearch').value.toLowerCase();
    const membersGrid = document.getElementById('membersGrid');
    const filteredUsers = appData.users.filter(user => 
        user.name.toLowerCase().includes(searchTerm)
    );
    
    membersGrid.innerHTML = filteredUsers.map(user => `
        <div class="member-card">
            <div class="member-avatar">${user.avatar}</div>
            <div class="member-info">
                <h3>${user.name}</h3>
                <span class="role-badge role-${user.role}">${user.role}</span>
            </div>
        </div>
    `).join('');
}

// Voting Functions
function loadPolls() {
    const pollsGrid = document.getElementById('pollsGrid');
    
    pollsGrid.innerHTML = appData.polls.map(poll => `
        <div class="poll-card">
            <div class="poll-question">${poll.question}</div>
            ${poll.options.map(option => `
                <div class="poll-option-item" onclick="votePoll(${poll.id}, '${option.text}')">
                    <span>${option.text}</span>
                    <span class="vote-count">${option.votes} votes</span>
                </div>
                <div class="vote-bar" style="width: ${(option.votes / poll.totalVotes * 100)}%"></div>
            `).join('')}
            <div style="margin-top: 1rem; color: var(--text-secondary);">
                Total votes: ${poll.totalVotes}
            </div>
        </div>
    `).join('');
}

function openCreatePollModal() {
    document.getElementById('createPollModal').classList.add('active');
}

function addPollOption() {
    const pollOptions = document.getElementById('pollOptions');
    const optionCount = pollOptions.children.length + 1;
    const newOption = document.createElement('input');
    newOption.type = 'text';
    newOption.placeholder = `Option ${optionCount}`;
    newOption.className = 'poll-option';
    newOption.required = true;
    pollOptions.appendChild(newOption);
}

function createPoll(event) {
    event.preventDefault();
    const question = document.getElementById('pollQuestion').value;
    const options = Array.from(document.getElementsByClassName('poll-option'))
        .map(input => ({ text: input.value, votes: 0 }));
    
    const newPoll = {
        id: appData.polls.length + 1,
        question: question,
        options: options,
        totalVotes: 0,
        status: 'active'
    };
    
    appData.polls.push(newPoll);
    closeModal('createPollModal');
    loadPolls();
    updateDashboard();
}

function votePoll(pollId, optionText) {
    const poll = appData.polls.find(p => p.id === pollId);
    if (poll) {
        const option = poll.options.find(o => o.text === optionText);
        if (option) {
            option.votes++;
            poll.totalVotes++;
            loadPolls();
            
            // Add points to current user
            appData.currentUser.points += 10;
            const user = appData.users.find(u => u.id === appData.currentUser.id);
            if (user) {
                user.points += 10;
            }
            updateDashboard();
            loadLeaderboard();
        }
    }
}

// Profile Functions
function loadProfile() {
    document.getElementById('profileName').textContent = appData.currentUser.name;
    document.getElementById('profileRole').textContent = appData.currentUser.role;
    document.getElementById('profileJoinDate').textContent = `Member since: ${new Date(appData.currentUser.joinDate).toLocaleDateString()}`;
    document.getElementById('profileGroups').textContent = appData.currentUser.groups.length || '0';
    document.getElementById('profileFollowers').textContent = appData.currentUser.followers.length || '0';
    document.getElementById('profileFollowing').textContent = appData.currentUser.following.length || '0';
    document.getElementById('profilePoints').textContent = appData.currentUser.points;
}

function editProfile() {
    const newName = prompt('Enter new name:', appData.currentUser.name);
    if (newName) {
        appData.currentUser.name = newName;
        const user = appData.users.find(u => u.id === appData.currentUser.id);
        if (user) {
            user.name = newName;
        }
        loadProfile();
        updateDashboard();
        loadMembers();
    }
}

function logout() {
    alert('Logged out successfully!');
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
                }
