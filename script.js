// Team Nexus - Complete Platform with Messaging System

// Data Store
let appData = {
    currentUser: {
        id: 1,
        name: 'Admin User',
        role: 'admin',
        avatar: '👤',
        joinDate: '2024-01-01',
        groups: [1, 2],
        followers: [2, 3],
        following: [2, 3, 4],
        points: 1250
    },
    users: [
        { id: 1, name: 'Admin User', role: 'admin', points: 1250, avatar: '👤', online: true },
        { id: 2, name: 'Team Leader', role: 'leader', points: 980, avatar: '👨‍💼', online: true },
        { id: 3, name: 'Co-Leader One', role: 'coleader', points: 850, avatar: '👩‍💼', online: false },
        { id: 4, name: 'Member One', role: 'member', points: 650, avatar: '👨‍💻', online: true },
        { id: 5, name: 'Member Two', role: 'member', points: 520, avatar: '👩‍💻', online: false },
        { id: 6, name: 'Member Three', role: 'member', points: 430, avatar: '🧑‍💻', online: true }
    ],
    groups: [
        { 
            id: 1, 
            name: 'Development Team', 
            description: 'Core development team for project X', 
            privacy: 'public', 
            members: [1, 2, 4], 
            leader: 2, 
            createdAt: '2024-01-15',
            messages: [
                { id: 1, sender: 2, text: 'Welcome to the Development Team! 🚀', time: '2024-01-15 10:00' },
                { id: 2, sender: 4, text: 'Thanks! Excited to be here.', time: '2024-01-15 10:05' }
            ]
        },
        { 
            id: 2, 
            name: 'Design Squad', 
            description: 'UI/UX design team', 
            privacy: 'public', 
            members: [1, 3, 5], 
            leader: 3, 
            createdAt: '2024-02-01',
            messages: [
                { id: 1, sender: 3, text: 'Design meeting at 3 PM today', time: '2024-02-01 14:00' }
            ]
        },
        { 
            id: 3, 
            name: 'Strategy Group', 
            description: 'Private strategy planning group', 
            privacy: 'private', 
            members: [1, 2], 
            leader: 1, 
            createdAt: '2024-01-20',
            messages: []
        }
    ],
    polls: [
        { id: 1, question: 'Which feature should we prioritize?', groupId: null, options: [
            { text: 'Real-time Chat', votes: 12 },
            { text: 'File Sharing', votes: 8 },
            { text: 'Video Calls', votes: 5 }
        ], totalVotes: 25, status: 'active' },
        { id: 2, question: 'Best team building activity?', groupId: 1, options: [
            { text: 'Gaming Session', votes: 15 },
            { text: 'Virtual Coffee', votes: 7 },
            { text: 'Coding Challenge', votes: 10 }
        ], totalVotes: 32, status: 'active' }
    ],
    activities: [
        { user: 'Team Leader', action: 'created a new group', target: 'Development Team', time: '2 hours ago' },
        { user: 'Member One', action: 'voted on', target: 'Feature Priority Poll', time: '3 hours ago' },
        { user: 'Co-Leader One', action: 'joined', target: 'Design Squad', time: '5 hours ago' }
    ],
    privateMessages: [
        { id: 1, sender: 1, receiver: 2, text: 'Hey, can you review my code?', time: '2024-01-16 09:00' },
        { id: 2, sender: 2, receiver: 1, text: 'Sure, send it over!', time: '2024-01-16 09:05' }
    ]
};

// Current chat state
let currentChat = {
    type: null, // 'group' or 'private'
    id: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateDashboard();
    loadGroups();
    loadMessages();
    loadLeaderboard();
    loadMembers();
    loadPolls();
    loadProfile();
    updateMessageBadge();
}

// Navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
    });
    
    window.scrollTo(0, 0);
    
    // Reload messages when navigating to messages section
    if (sectionId === 'messages') {
        loadMessages();
    }
}

// Dashboard Functions
function updateDashboard() {
    document.getElementById('totalMembers').textContent = appData.users.length;
    document.getElementById('activeGroups').textContent = appData.groups.length;
    document.getElementById('activePolls').textContent = appData.polls.filter(p => p.status === 'active').length;
    
    // Count messages today
    const today = new Date().toISOString().split('T')[0];
    let messageCount = 0;
    appData.groups.forEach(group => {
        messageCount += group.messages.filter(m => m.time.startsWith(today)).length;
    });
    appData.privateMessages.forEach(msg => {
        if (msg.time.startsWith(today)) messageCount++;
    });
    document.getElementById('messagesToday').textContent = messageCount;
    
    // Recent Activity
    const activityList = document.getElementById('recentActivity');
    activityList.innerHTML = appData.activities.map(activity => `
        <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-color);">
            <strong>${activity.user}</strong> ${activity.action} <strong>${activity.target}</strong>
            <br><small style="color: var(--text-secondary);">${activity.time}</small>
        </div>
    `).join('');
    
    // Dashboard Groups
    const dashboardGroups = document.getElementById('dashboardGroups');
    const userGroups = appData.groups.filter(g => g.members.includes(appData.currentUser.id));
    dashboardGroups.innerHTML = userGroups.slice(0, 3).map(group => `
        <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${group.name}</strong>
                <br><small style="color: var(--text-secondary);">${group.privacy} • ${group.members.length} members</small>
            </div>
            <button class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;" onclick="openGroupChat(${group.id})">
                <i class="fas fa-comments"></i> Chat
            </button>
        </div>
    `).join('');
    
    // Dashboard Messages
    const dashboardMessages = document.getElementById('dashboardMessages');
    const recentMessages = [...appData.privateMessages]
        .filter(m => m.sender === appData.currentUser.id || m.receiver === appData.currentUser.id)
        .slice(-3);
    
    dashboardMessages.innerHTML = recentMessages.map(msg => {
        const otherUser = msg.sender === appData.currentUser.id ? 
            appData.users.find(u => u.id === msg.receiver) : 
            appData.users.find(u => u.id === msg.sender);
        return `
            <div style="padding: 0.75rem; border-bottom: 1px solid var(--border-color); cursor: pointer;" onclick="openPrivateChat(${otherUser.id})">
                <strong>${otherUser.name}</strong>: ${msg.text.substring(0, 30)}...
                <br><small style="color: var(--text-secondary);">${msg.time}</small>
            </div>
        `;
    }).join('');
    
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
    } else if (filter === 'my') {
        filteredGroups = appData.groups.filter(g => g.members.includes(appData.currentUser.id));
    }
    
    groupsGrid.innerHTML = filteredGroups.map(group => {
        const leader = appData.users.find(u => u.id === group.leader);
        const isMember = group.members.includes(appData.currentUser.id);
        
        return `
            <div class="group-card">
                <h3>${group.name}</h3>
                <p>${group.description}</p>
                <div class="group-meta">
                    <span><i class="fas fa-users"></i> ${group.members.length} members</span>
                    <span><i class="fas fa-${group.privacy === 'public' ? 'globe' : 'lock'}"></i> ${group.privacy}</span>
                    <span><i class="fas fa-crown"></i> ${leader ? leader.name : 'Unknown'}</span>
                </div>
                <div class="group-actions">
                    ${isMember ? `
                        <button class="btn btn-primary" onclick="openGroupChat(${group.id})">
                            <i class="fas fa-comments"></i> Open Chat
                        </button>
                        <button class="btn btn-secondary" onclick="leaveGroup(${group.id})">
                            <i class="fas fa-sign-out-alt"></i> Leave
                        </button>
                    ` : `
                        <button class="btn btn-primary" onclick="joinGroup(${group.id})">
                            <i class="fas fa-plus"></i> Join Group
                        </button>
                    `}
                    <button class="btn btn-secondary" onclick="viewGroupMembers(${group.id})">
                        <i class="fas fa-users"></i> Members
                    </button>
                </div>
            </div>
        `;
    }).join('');
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
        members: [appData.currentUser.id],
        leader: appData.currentUser.id,
        createdAt: new Date().toISOString().split('T')[0],
        messages: []
    };
    
    appData.groups.push(newGroup);
    appData.currentUser.groups.push(newGroup.id);
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
    
    alert('Group created successfully! You can now open the group chat.');
}

function joinGroup(groupId) {
    const group = appData.groups.find(g => g.id === groupId);
    if (group && !group.members.includes(appData.currentUser.id)) {
        group.members.push(appData.currentUser.id);
        appData.currentUser.groups.push(groupId);
        loadGroups();
        updateDashboard();
        alert('Joined group successfully! You can now access the group chat.');
    }
}

function leaveGroup(groupId) {
    const group = appData.groups.find(g => g.id === groupId);
    if (group && group.leader !== appData.currentUser.id) {
        group.members = group.members.filter(id => id !== appData.currentUser.id);
        appData.currentUser.groups = appData.currentUser.groups.filter(id => id !== groupId);
        loadGroups();
        updateDashboard();
        alert('Left the group.');
    } else {
        alert('Group leader cannot leave the group.');
    }
}

function viewGroupMembers(groupId) {
    const group = appData.groups.find(g => g.id === groupId);
    if (group) {
        const members = group.members.map(id => appData.users.find(u => u.id === id));
        const memberList = members.map(m => `${m.avatar} ${m.name} (${m.role})`).join('\n');
        alert(`Group Members:\n\n${memberList}`);
    }
}

// MESSAGING SYSTEM
function loadMessages() {
    const conversationList = document.getElementById('conversationList');
    let conversations = [];
    
    // Add group conversations
    const userGroups = appData.groups.filter(g => g.members.includes(appData.currentUser.id));
    userGroups.forEach(group => {
        conversations.push({
            type: 'group',
            id: group.id,
            name: group.name,
            avatar: '👥',
            lastMessage: group.messages.length > 0 ? group.messages[group.messages.length - 1] : null,
            unread: 0
        });
    });
    
    // Add private conversations
    const privateChats = new Set();
    appData.privateMessages.forEach(msg => {
        if (msg.sender === appData.currentUser.id || msg.receiver === appData.currentUser.id) {
            const otherId = msg.sender === appData.currentUser.id ? msg.receiver : msg.sender;
            privateChats.add(otherId);
        }
    });
    
    privateChats.forEach(userId => {
        const user = appData.users.find(u => u.id === userId);
        if (user) {
            const messages = appData.privateMessages.filter(
                m => (m.sender === appData.currentUser.id && m.receiver === userId) ||
                     (m.sender === userId && m.receiver === appData.currentUser.id)
            );
            conversations.push({
                type: 'private',
                id: userId,
                name: user.name,
                avatar: user.avatar,
                lastMessage: messages[messages.length - 1],
                unread: messages.filter(m => m.receiver === appData.currentUser.id && !m.read).length
            });
        }
    });
    
    conversationList.innerHTML = conversations.map(conv => `
        <div class="conversation-item ${currentChat.type === conv.type && currentChat.id === conv.id ? 'active' : ''}" 
             onclick="openChat('${conv.type}', ${conv.id})">
            <div class="conversation-avatar">${conv.avatar}</div>
            <div class="conversation-info">
                <h4>${conv.name}</h4>
                <p>${conv.lastMessage ? conv.lastMessage.text.substring(0, 40) + '...' : 'No messages yet'}</p>
            </div>
            <div class="conversation-time">
                ${conv.lastMessage ? conv.lastMessage.time.split(' ')[0] : ''}
                ${conv.unread > 0 ? `<span class="unread-badge">${conv.unread}</span>` : ''}
            </div>
        </div>
    `).join('');
}

function openChat(type, id) {
    currentChat.type = type;
    currentChat.id = id;
    
    const chatHeader = document.getElementById('chatHeader');
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    
    chatInput.style.display = 'flex';
    
    if (type === 'group') {
        const group = appData.groups.find(g => g.id === id);
        if (group) {
            chatHeader.innerHTML = `
                <div class="chat-header-info">
                    <h3>👥 ${group.name}</h3>
                    <p>${group.members.length} members • ${group.privacy} group</p>
                </div>
            `;
            
            chatMessages.innerHTML = group.messages.map(msg => {
                const sender = appData.users.find(u => u.id === msg.sender);
                const isSent = msg.sender === appData.currentUser.id;
                return `
                    <div class="message ${isSent ? 'sent' : 'received'}">
                        ${!isSent ? `<div class="message-sender">${sender.avatar} ${sender.name}</div>` : ''}
                        <div>${msg.text}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                `;
            }).join('');
        }
    } else if (type === 'private') {
        const user = appData.users.find(u => u.id === id);
        if (user) {
            chatHeader.innerHTML = `
                <div class="chat-header-info">
                    <h3>${user.avatar} ${user.name}</h3>
                    <p>${user.online ? '🟢 Online' : '⚫ Offline'} • ${user.role}</p>
                </div>
            `;
            
            const messages = appData.privateMessages.filter(
                m => (m.sender === appData.currentUser.id && m.receiver === id) ||
                     (m.sender === id && m.receiver === appData.currentUser.id)
            );
            
            chatMessages.innerHTML = messages.map(msg => {
                const isSent = msg.sender === appData.currentUser.id;
                return `
                    <div class="message ${isSent ? 'sent' : 'received'}">
                        <div>${msg.text}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                `;
            }).join('');
        }
    }
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    loadMessages();
    
    // Navigate to messages section
    showSection('messages');
}

function openGroupChat(groupId) {
    openChat('group', groupId);
}

function openPrivateChat(userId) {
    // Check if private chat exists, if not create conversation
    openChat('private', userId);
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value.trim();
    
    if (!text || !currentChat.type) return;
    
    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    if (currentChat.type === 'group') {
        const group = appData.groups.find(g => g.id === currentChat.id);
        if (group) {
            const newMessage = {
                id: group.messages.length + 1,
                sender: appData.currentUser.id,
                text: text,
                time: timeString
            };
            group.messages.push(newMessage);
            
            // Add activity
            appData.activities.unshift({
                user: appData.currentUser.name,
                action: 'sent a message in',
                target: group.name,
                time: 'Just now'
            });
        }
    } else if (currentChat.type === 'private') {
        const newMessage = {
            id: appData.privateMessages.length + 1,
            sender: appData.currentUser.id,
            receiver: currentChat.id,
            text: text,
            time: timeString,
            read: false
        };
        appData.privateMessages.push(newMessage);
    }
    
    messageInput.value = '';
    openChat(currentChat.type, currentChat.id);
    updateDashboard();
    updateMessageBadge();
    
    // Add points for activity
    appData.currentUser.points += 5;
}

function handleMessageKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function updateMessageBadge() {
    const unreadCount = appData.privateMessages.filter(
        m => m.receiver === appData.currentUser.id && !m.read
    ).length;
    
    const badge = document.getElementById('messageBadge');
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'inline';
    } else {
        badge.style.display = 'none';
    }
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
            <button class="message-btn" onclick="openPrivateChat(${user.id})">
                <i class="fas fa-comment"></i>
            </button>
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
                <h3>${user.name} ${user.online ? '🟢' : '⚫'}</h3>
                <span class="role-badge role-${user.role}">${user.role}</span>
                <br>
                <small style="color: var(--text-secondary);">${user.points} points</small>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                ${user.id !== appData.currentUser.id ? `
                    <button class="follow-btn ${appData.currentUser.following.includes(user.id) ? 'following' : ''}" 
                            onclick="toggleFollow(${user.id})">
                        ${appData.currentUser.following.includes(user.id) ? 'Following' : 'Follow'}
                    </button>
                    <button class="message-btn" onclick="openPrivateChat(${user.id})">
                        <i class="fas fa-comment"></i> Message
                    </button>
                ` : '<span style="color: var(--text-secondary);">You</span>'}
            </div>
        </div>
    `).join('');
}

function toggleFollow(userId) {
    const index = appData.currentUser.following.indexOf(userId);
    if (index > -1) {
        appData.currentUser.following.splice(index, 1);
    } else {
        appData.currentUser.following.push(userId);
        appData.currentUser.points += 10;
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
            ${user.id !== appData.currentUser.id ? `
                <button class="message-btn" onclick="openPrivateChat(${user.id})">
                    <i class="fas fa-comment"></i> Message
                </button>
            ` : ''}
        </div>
    `).join('');
}

// Voting Functions
function loadPolls() {
    const pollsGrid = document.getElementById('pollsGrid');
    
    pollsGrid.innerHTML = appData.polls.map(poll => `
        <div class="poll-card">
            <div class="poll-question">${poll.question}</div>
            ${poll.groupId ? `<small style="color: var(--text-secondary);">Group: ${appData.groups.find(g => g.id === poll.groupId)?.name}</small>` : ''}
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
    // Load groups into poll group selector
    const pollGroup = document.getElementById('pollGroup');
    pollGroup.innerHTML = '<option value="">General (All Members)</option>' +
        appData.groups.map(g => `<option value="${g.id}">${g.name}</option>`).join('');
    
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
    const groupId = document.getElementById('pollGroup').value;
    const options = Array.from(document.getElementsByClassName('poll-option'))
        .map(input => ({ text: input.value, votes: 0 }));
    
    const newPoll = {
        id: appData.polls.length + 1,
        question: question,
        groupId: groupId ? parseInt(groupId) : null,
        options: options,
        totalVotes: 0,
        status: 'active'
    };
    
    appData.polls.push(newPoll);
    closeModal('createPollModal');
    loadPolls();
    updateDashboard();
    
    appData.activities.unshift({
        user: appData.currentUser.name,
        action: 'created a new poll',
        target: question,
        time: 'Just now'
    });
}

function votePoll(pollId, optionText) {
    const poll = appData.polls.find(p => p.id === pollId);
    if (poll) {
        const option = poll.options.find(o => o.text === optionText);
        if (option) {
            option.votes++;
            poll.totalVotes++;
            loadPolls();
            
            appData.currentUser.points += 10;
            const user = appData.users.find(u => u.id === appData.currentUser.id);
            if (user) user.points += 10;
            
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
    document.getElementById('profileGroups').textContent = appData.currentUser.groups.length;
    document.getElementById('profileFollowers').textContent = appData.currentUser.followers.length;
    document.getElementById('profileFollowing').textContent = appData.currentUser.following.length;
    document.getElementById('profilePoints').textContent = appData.currentUser.points;
}

function editProfile() {
    const newName = prompt('Enter new name:', appData.currentUser.name);
    if (newName) {
        appData.currentUser.name = newName;
        const user = appData.users.find(u => u.id === appData.currentUser.id);
        if (user) user.name = newName;
        loadProfile();
        updateDashboard();
        loadMembers();
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        alert('Logged out successfully!');
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}
