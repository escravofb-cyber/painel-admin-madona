// Global variables
let currentEditingBlog = null;
let currentEditingVideo = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadDashboard();
    loadBlogs();
    loadVideos();
});

// Tab functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');
    const sections = document.querySelectorAll('.section');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Remove active class from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Dashboard functions
async function loadDashboard() {
    try {
        const [blogsResponse, videosResponse] = await Promise.all([
            fetch('/api/blogs'),
            fetch('/api/videos')
        ]);

        const blogs = await blogsResponse.json();
        const videos = await videosResponse.json();

        document.getElementById('totalBlogs').textContent = blogs.length;
        document.getElementById('totalVideos').textContent = videos.length;
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

// Blog functions
async function loadBlogs() {
    const container = document.getElementById('blogsContainer');
    container.innerHTML = '<div class="loading">Carregando blogs...</div>';

    try {
        const response = await fetch('/api/blogs');
        const blogs = await response.json();

        if (blogs.length === 0) {
            container.innerHTML = '<p>Nenhum blog encontrado. Clique em "Adicionar Blog" para criar o primeiro.</p>';
            return;
        }

        const blogsHTML = blogs.map(blog => `
            <div class="item-card">
                <h3>${blog.title}</h3>
                <p>${blog.content.substring(0, 150)}${blog.content.length > 150 ? '...' : ''}</p>
                <small>Criado em: ${new Date(blog.created_at).toLocaleDateString('pt-BR')}</small>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editBlog(${blog.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="deleteBlog(${blog.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `<div class="items-grid">${blogsHTML}</div>`;
    } catch (error) {
        container.innerHTML = '<div class="error">Erro ao carregar blogs. Tente novamente.</div>';
        console.error('Erro ao carregar blogs:', error);
    }
}

function openBlogModal(blogId = null) {
    const modal = document.getElementById('blogModal');
    const title = document.getElementById('blogModalTitle');
    const form = document.getElementById('blogForm');
    
    if (blogId) {
        title.textContent = 'Editar Blog';
        loadBlogForEdit(blogId);
    } else {
        title.textContent = 'Novo Blog';
        form.reset();
        currentEditingBlog = null;
    }
    
    modal.style.display = 'block';
}

function closeBlogModal() {
    document.getElementById('blogModal').style.display = 'none';
    currentEditingBlog = null;
}

async function loadBlogForEdit(blogId) {
    try {
        const response = await fetch(`/api/blogs/${blogId}`);
        const blog = await response.json();
        
        document.getElementById('blogTitle').value = blog.title;
        document.getElementById('blogContent').value = blog.content;
        currentEditingBlog = blogId;
    } catch (error) {
        showMessage('Erro ao carregar blog para edição', 'error');
        console.error('Erro ao carregar blog:', error);
    }
}

async function editBlog(blogId) {
    openBlogModal(blogId);
}

async function deleteBlog(blogId) {
    if (!confirm('Tem certeza que deseja excluir este blog?')) {
        return;
    }

    try {
        const response = await fetch(`/api/blogs/${blogId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Blog excluído com sucesso!', 'success');
            loadBlogs();
            loadDashboard();
        } else {
            throw new Error('Erro ao excluir blog');
        }
    } catch (error) {
        showMessage('Erro ao excluir blog', 'error');
        console.error('Erro ao excluir blog:', error);
    }
}

// Video functions
async function loadVideos() {
    const container = document.getElementById('videosContainer');
    container.innerHTML = '<div class="loading">Carregando vídeos...</div>';

    try {
        const response = await fetch('/api/videos');
        const videos = await response.json();

        if (videos.length === 0) {
            container.innerHTML = '<p>Nenhum vídeo encontrado. Clique em "Adicionar Vídeo" para criar o primeiro.</p>';
            return;
        }

        const videosHTML = videos.map(video => `
            <div class="item-card">
                <h3>${video.title}</h3>
                <p>${video.description.substring(0, 150)}${video.description.length > 150 ? '...' : ''}</p>
                <p><strong>URL:</strong> <a href="${video.url}" target="_blank">${video.url}</a></p>
                ${video.duration ? `<p><strong>Duração:</strong> ${video.duration}</p>` : ''}
                <small>Criado em: ${new Date(video.created_at).toLocaleDateString('pt-BR')}</small>
                <div class="item-actions">
                    <button class="btn-edit" onclick="editVideo(${video.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="deleteVideo(${video.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `).join('');

        container.innerHTML = `<div class="items-grid">${videosHTML}</div>`;
    } catch (error) {
        container.innerHTML = '<div class="error">Erro ao carregar vídeos. Tente novamente.</div>';
        console.error('Erro ao carregar vídeos:', error);
    }
}

function openVideoModal(videoId = null) {
    const modal = document.getElementById('videoModal');
    const title = document.getElementById('videoModalTitle');
    const form = document.getElementById('videoForm');
    
    if (videoId) {
        title.textContent = 'Editar Vídeo';
        loadVideoForEdit(videoId);
    } else {
        title.textContent = 'Novo Vídeo';
        form.reset();
        currentEditingVideo = null;
    }
    
    modal.style.display = 'block';
}

function closeVideoModal() {
    document.getElementById('videoModal').style.display = 'none';
    currentEditingVideo = null;
}

async function loadVideoForEdit(videoId) {
    try {
        const response = await fetch(`/api/videos/${videoId}`);
        const video = await response.json();
        
        document.getElementById('videoTitle').value = video.title;
        document.getElementById('videoDescription').value = video.description;
        document.getElementById('videoUrl').value = video.url;
        document.getElementById('videoDuration').value = video.duration || '';
        currentEditingVideo = videoId;
    } catch (error) {
        showMessage('Erro ao carregar vídeo para edição', 'error');
        console.error('Erro ao carregar vídeo:', error);
    }
}

async function editVideo(videoId) {
    openVideoModal(videoId);
}

async function deleteVideo(videoId) {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) {
        return;
    }

    try {
        const response = await fetch(`/api/videos/${videoId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            showMessage('Vídeo excluído com sucesso!', 'success');
            loadVideos();
            loadDashboard();
        } else {
            throw new Error('Erro ao excluir vídeo');
        }
    } catch (error) {
        showMessage('Erro ao excluir vídeo', 'error');
        console.error('Erro ao excluir vídeo:', error);
    }
}

// Form submissions
document.getElementById('blogForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const title = document.getElementById('blogTitle').value;
    const content = document.getElementById('blogContent').value;
    
    const blogData = { title, content };
    
    try {
        let response;
        if (currentEditingBlog) {
            response = await fetch(`/api/blogs/${currentEditingBlog}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData)
            });
        } else {
            response = await fetch('/api/blogs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData)
            });
        }
        
        if (response.ok) {
            showMessage(currentEditingBlog ? 'Blog atualizado com sucesso!' : 'Blog criado com sucesso!', 'success');
            closeBlogModal();
            loadBlogs();
            loadDashboard();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao salvar blog');
        }
    } catch (error) {
        showMessage('Erro ao salvar blog: ' + error.message, 'error');
        console.error('Erro ao salvar blog:', error);
    }
});

document.getElementById('videoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const title = document.getElementById('videoTitle').value;
    const description = document.getElementById('videoDescription').value;
    const url = document.getElementById('videoUrl').value;
    const duration = document.getElementById('videoDuration').value;
    
    const videoData = { title, description, url, duration };
    
    try {
        let response;
        if (currentEditingVideo) {
            response = await fetch(`/api/videos/${currentEditingVideo}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(videoData)
            });
        } else {
            response = await fetch('/api/videos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(videoData)
            });
        }
        
        if (response.ok) {
            showMessage(currentEditingVideo ? 'Vídeo atualizado com sucesso!' : 'Vídeo criado com sucesso!', 'success');
            closeVideoModal();
            loadVideos();
            loadDashboard();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao salvar vídeo');
        }
    } catch (error) {
        showMessage('Erro ao salvar vídeo: ' + error.message, 'error');
        console.error('Erro ao salvar vídeo:', error);
    }
});

// Utility functions
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success, .error');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    // Insert at the top of the content area
    const content = document.querySelector('.content');
    content.insertBefore(messageDiv, content.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Close modals when clicking outside
window.addEventListener('click', function(event) {
    const blogModal = document.getElementById('blogModal');
    const videoModal = document.getElementById('videoModal');
    
    if (event.target === blogModal) {
        closeBlogModal();
    }
    if (event.target === videoModal) {
        closeVideoModal();
    }
});

