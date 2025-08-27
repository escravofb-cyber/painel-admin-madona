let currentEditingBlog = null;
let currentEditingVideo = null;
let currentEditingService = null;
let currentEditingSolution = null;
let currentEditingTestimonial = null;
let currentEditingCourse = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    loadDashboard();
    loadBlogs();
    loadVideos();
    loadServices();
    loadSolutions();
    loadTestimonials();
    loadCourses();
    loadContactInfo();
    loadSiteConfig();
});

// Tab functionality
function initializeTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.section');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and sections
            tabBtns.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding section
            this.classList.add('active');
            document.getElementById(targetTab + '-section').classList.add('active');
            
            // Load data for the selected tab
            switch(targetTab) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'blogs':
                    loadBlogs();
                    break;
                case 'videos':
                    loadVideos();
                    break;
                case 'services':
                    loadServices();
                    break;
                case 'solutions':
                    loadSolutions();
                    break;
                case 'testimonials':
                    loadTestimonials();
                    break;
                case 'courses':
                    loadCourses();
                    break;
                case 'contact':
                    loadContactInfo();
                    break;
                case 'site-config':
                    loadSiteConfig();
                    break;
            }
        });
    });
}

// Dashboard functions
async function loadDashboard() {
    try {
        const [blogsResponse, videosResponse, servicesResponse, solutionsResponse, testimonialsResponse, coursesResponse] = await Promise.all([
            fetch('/api/blogs'),
            fetch('/api/videos'),
            fetch('/api/services'),
            fetch('/api/solutions'),
            fetch('/api/testimonials'),
            fetch('/api/courses')
        ]);

        const blogs = await blogsResponse.json();
        const videos = await videosResponse.json();
        const services = await servicesResponse.json();
        const solutions = await solutionsResponse.json();
        const testimonials = await testimonialsResponse.json();
        const courses = await coursesResponse.json();

        // Update dashboard stats
        document.getElementById('totalBlogs').textContent = blogs.length;
        document.getElementById('totalVideos').textContent = videos.length;
        
        // Add new stats if elements exist
        const totalServicesEl = document.getElementById('totalServices');
        if (totalServicesEl) totalServicesEl.textContent = services.length;
        
        const totalSolutionsEl = document.getElementById('totalSolutions');
        if (totalSolutionsEl) totalSolutionsEl.textContent = solutions.length;
        
        const totalTestimonialsEl = document.getElementById('totalTestimonials');
        if (totalTestimonialsEl) totalTestimonialsEl.textContent = testimonials.length;
        
        const totalCoursesEl = document.getElementById('totalCourses');
        if (totalCoursesEl) totalCoursesEl.textContent = courses.length;
        
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

// Services functions
async function loadServices() {
    try {
        const response = await fetch('/api/services');
        const services = await response.json();
        
        const container = document.getElementById('services-list');
        if (!container) return;
        
        container.innerHTML = services.map(service => `
            <div class="item-card">
                <div class="item-header">
                    <h3><i class="${service.icon}"></i> ${service.title}</h3>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editService(${service.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="deleteService(${service.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
                <p>${service.description}</p>
                <small>Criado em: ${new Date(service.created_at).toLocaleDateString('pt-BR')}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
    }
}

async function createService() {
    const title = document.getElementById('service-title').value;
    const description = document.getElementById('service-description').value;
    const icon = document.getElementById('service-icon').value || 'fas fa-cogs';
    
    if (!title || !description) {
        alert('Título e descrição são obrigatórios');
        return;
    }
    
    try {
        const response = await fetch('/api/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, icon })
        });
        
        if (response.ok) {
            document.getElementById('service-form').reset();
            loadServices();
            alert('Serviço criado com sucesso!');
        } else {
            alert('Erro ao criar serviço');
        }
    } catch (error) {
        console.error('Erro ao criar serviço:', error);
        alert('Erro ao criar serviço');
    }
}

async function editService(id) {
    try {
        const response = await fetch(`/api/services`);
        const services = await response.json();
        const service = services.find(s => s.id === id);
        
        if (service) {
            document.getElementById('service-title').value = service.title;
            document.getElementById('service-description').value = service.description;
            document.getElementById('service-icon').value = service.icon;
            currentEditingService = id;
            
            const submitBtn = document.querySelector('#services-section .btn-primary');
            submitBtn.textContent = 'Atualizar Serviço';
            submitBtn.onclick = updateService;
        }
    } catch (error) {
        console.error('Erro ao carregar serviço:', error);
    }
}

async function updateService() {
    const title = document.getElementById('service-title').value;
    const description = document.getElementById('service-description').value;
    const icon = document.getElementById('service-icon').value;
    
    try {
        const response = await fetch(`/api/services/${currentEditingService}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, icon })
        });
        
        if (response.ok) {
            document.getElementById('service-form').reset();
            currentEditingService = null;
            loadServices();
            
            const submitBtn = document.querySelector('#services-section .btn-primary');
            submitBtn.textContent = 'Adicionar Serviço';
            submitBtn.onclick = createService;
            
            alert('Serviço atualizado com sucesso!');
        } else {
            alert('Erro ao atualizar serviço');
        }
    } catch (error) {
        console.error('Erro ao atualizar serviço:', error);
        alert('Erro ao atualizar serviço');
    }
}

async function deleteService(id) {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) return;
    
    try {
        const response = await fetch(`/api/services/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadServices();
            alert('Serviço excluído com sucesso!');
        } else {
            alert('Erro ao excluir serviço');
        }
    } catch (error) {
        console.error('Erro ao excluir serviço:', error);
        alert('Erro ao excluir serviço');
    }
}

// Solutions functions
async function loadSolutions() {
    try {
        const response = await fetch('/api/solutions');
        const solutions = await response.json();
        
        const container = document.getElementById('solutions-list');
        if (!container) return;
        
        container.innerHTML = solutions.map(solution => `
            <div class="item-card">
                <div class="item-header">
                    <h3><i class="${solution.icon}"></i> ${solution.title}</h3>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editSolution(${solution.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="deleteSolution(${solution.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
                <p>${solution.description}</p>
                <small>Criado em: ${new Date(solution.created_at).toLocaleDateString('pt-BR')}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar soluções:', error);
    }
}

// Testimonials functions
async function loadTestimonials() {
    try {
        const response = await fetch('/api/testimonials');
        const testimonials = await response.json();
        
        const container = document.getElementById('testimonials-list');
        if (!container) return;
        
        container.innerHTML = testimonials.map(testimonial => `
            <div class="item-card">
                <div class="item-header">
                    <h3>${testimonial.name}</h3>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editTestimonial(${testimonial.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="deleteTestimonial(${testimonial.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
                <p><strong>${testimonial.position}</strong>${testimonial.company ? ` - ${testimonial.company}` : ''}</p>
                <p>"${testimonial.message}"</p>
                <div class="rating">${'★'.repeat(testimonial.rating || 5)}</div>
                <small>Criado em: ${new Date(testimonial.created_at).toLocaleDateString('pt-BR')}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar depoimentos:', error);
    }
}

// Courses functions
async function loadCourses() {
    try {
        const response = await fetch('/api/courses');
        const courses = await response.json();
        
        const container = document.getElementById('courses-list');
        if (!container) return;
        
        container.innerHTML = courses.map(course => `
            <div class="item-card">
                <div class="item-header">
                    <h3><i class="${course.icon}"></i> ${course.title}</h3>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editCourse(${course.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="deleteCourse(${course.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
                <p>${course.description}</p>
                <div class="course-price">R$ ${course.price.toFixed(2)}</div>
                <span class="course-category">${course.category}</span>
                <small>Criado em: ${new Date(course.created_at).toLocaleDateString('pt-BR')}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
    }
}

// Contact Info functions
async function loadContactInfo() {
    try {
        const response = await fetch('/api/contact-info');
        const contact = await response.json();
        
        if (contact && contact.company_name) {
            document.getElementById('contact-company-name').value = contact.company_name;
            document.getElementById('contact-address').value = contact.address;
            document.getElementById('contact-phone').value = contact.phone;
            document.getElementById('contact-whatsapp').value = contact.whatsapp;
            document.getElementById('contact-email').value = contact.email;
            document.getElementById('contact-instagram').value = contact.instagram || '';
            document.getElementById('contact-facebook').value = contact.facebook || '';
            document.getElementById('contact-working-hours').value = contact.working_hours || '';
        }
    } catch (error) {
        console.error('Erro ao carregar informações de contato:', error);
    }
}

async function updateContactInfo() {
    const contactData = {
        company_name: document.getElementById('contact-company-name').value,
        address: document.getElementById('contact-address').value,
        phone: document.getElementById('contact-phone').value,
        whatsapp: document.getElementById('contact-whatsapp').value,
        email: document.getElementById('contact-email').value,
        instagram: document.getElementById('contact-instagram').value,
        facebook: document.getElementById('contact-facebook').value,
        working_hours: document.getElementById('contact-working-hours').value
    };
    
    try {
        const response = await fetch('/api/contact-info', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contactData)
        });
        
        if (response.ok) {
            alert('Informações de contato atualizadas com sucesso!');
        } else {
            alert('Erro ao atualizar informações de contato');
        }
    } catch (error) {
        console.error('Erro ao atualizar informações de contato:', error);
        alert('Erro ao atualizar informações de contato');
    }
}

// Site Config functions
async function loadSiteConfig() {
    try {
        const response = await fetch('/api/site-config');
        const configs = await response.json();
        
        const container = document.getElementById('site-config-list');
        if (!container) return;
        
        container.innerHTML = configs.map(config => `
            <div class="config-item">
                <div class="config-header">
                    <h4>${config.key}</h4>
                    <span class="config-section">${config.section || 'Geral'}</span>
                </div>
                <p class="config-description">${config.description || ''}</p>
                <textarea class="config-value" data-config-id="${config.id}">${config.value}</textarea>
                <button class="btn-primary" onclick="updateConfig(${config.id})">Atualizar</button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar configurações do site:', error);
    }
}

async function updateConfig(configId) {
    const textarea = document.querySelector(`textarea[data-config-id="${configId}"]`);
    const value = textarea.value;
    
    try {
        const response = await fetch(`/api/site-config/${configId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value })
        });
        
        if (response.ok) {
            alert('Configuração atualizada com sucesso!');
        } else {
            alert('Erro ao atualizar configuração');
        }
    } catch (error) {
        console.error('Erro ao atualizar configuração:', error);
        alert('Erro ao atualizar configuração');
    }
}

// Blog functions (existing)
async function loadBlogs() {
    try {
        const response = await fetch('/api/blogs');
        const blogs = await response.json();
        
        const container = document.getElementById('blogs-list');
        if (!container) return;
        
        container.innerHTML = blogs.map(blog => `
            <div class="item-card">
                <div class="item-header">
                    <h3>${blog.title}</h3>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editBlog(${blog.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="deleteBlog(${blog.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
                <p>${blog.content.substring(0, 150)}...</p>
                <small>Criado em: ${new Date(blog.created_at).toLocaleDateString('pt-BR')}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar blogs:', error);
    }
}

// Video functions (existing)
async function loadVideos() {
    try {
        const response = await fetch('/api/videos');
        const videos = await response.json();
        
        const container = document.getElementById('videos-list');
        if (!container) return;
        
        container.innerHTML = videos.map(video => `
            <div class="item-card">
                <div class="item-header">
                    <h3>${video.title}</h3>
                    <div class="item-actions">
                        <button class="btn-edit" onclick="editVideo(${video.id})">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="deleteVideo(${video.id})">
                            <i class="fas fa-trash"></i> Excluir
                        </button>
                    </div>
                </div>
                <p>${video.description}</p>
                <p><strong>URL:</strong> <a href="${video.url}" target="_blank">${video.url}</a></p>
                <p><strong>Duração:</strong> ${video.duration}</p>
                <small>Criado em: ${new Date(video.created_at).toLocaleDateString('pt-BR')}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar vídeos:', error);
    }
}



// Additional functions for Solutions
async function createSolution() {
    const title = document.getElementById('solution-title').value;
    const description = document.getElementById('solution-description').value;
    const icon = document.getElementById('solution-icon').value || 'fas fa-lightbulb';
    
    if (!title || !description) {
        alert('Título e descrição são obrigatórios');
        return;
    }
    
    try {
        const response = await fetch('/api/solutions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, icon })
        });
        
        if (response.ok) {
            document.getElementById('solution-form').reset();
            loadSolutions();
            alert('Solução criada com sucesso!');
        } else {
            alert('Erro ao criar solução');
        }
    } catch (error) {
        console.error('Erro ao criar solução:', error);
        alert('Erro ao criar solução');
    }
}

async function editSolution(id) {
    try {
        const response = await fetch(`/api/solutions`);
        const solutions = await response.json();
        const solution = solutions.find(s => s.id === id);
        
        if (solution) {
            document.getElementById('solution-title').value = solution.title;
            document.getElementById('solution-description').value = solution.description;
            document.getElementById('solution-icon').value = solution.icon;
            currentEditingSolution = id;
            
            const submitBtn = document.querySelector('#solutions-section .btn-primary');
            submitBtn.textContent = 'Atualizar Solução';
            submitBtn.onclick = updateSolution;
        }
    } catch (error) {
        console.error('Erro ao carregar solução:', error);
    }
}

async function updateSolution() {
    const title = document.getElementById('solution-title').value;
    const description = document.getElementById('solution-description').value;
    const icon = document.getElementById('solution-icon').value;
    
    try {
        const response = await fetch(`/api/solutions/${currentEditingSolution}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, icon })
        });
        
        if (response.ok) {
            document.getElementById('solution-form').reset();
            currentEditingSolution = null;
            loadSolutions();
            
            const submitBtn = document.querySelector('#solutions-section .btn-primary');
            submitBtn.textContent = 'Adicionar Solução';
            submitBtn.onclick = createSolution;
            
            alert('Solução atualizada com sucesso!');
        } else {
            alert('Erro ao atualizar solução');
        }
    } catch (error) {
        console.error('Erro ao atualizar solução:', error);
        alert('Erro ao atualizar solução');
    }
}

async function deleteSolution(id) {
    if (!confirm('Tem certeza que deseja excluir esta solução?')) return;
    
    try {
        const response = await fetch(`/api/solutions/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadSolutions();
            alert('Solução excluída com sucesso!');
        } else {
            alert('Erro ao excluir solução');
        }
    } catch (error) {
        console.error('Erro ao excluir solução:', error);
        alert('Erro ao excluir solução');
    }
}

// Additional functions for Testimonials
async function createTestimonial() {
    const name = document.getElementById('testimonial-name').value;
    const position = document.getElementById('testimonial-position').value;
    const company = document.getElementById('testimonial-company').value;
    const message = document.getElementById('testimonial-message').value;
    const rating = document.getElementById('testimonial-rating').value;
    
    if (!name || !position || !message) {
        alert('Nome, cargo e depoimento são obrigatórios');
        return;
    }
    
    try {
        const response = await fetch('/api/testimonials', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, position, company, message, rating: parseInt(rating) })
        });
        
        if (response.ok) {
            document.getElementById('testimonial-form').reset();
            loadTestimonials();
            alert('Depoimento criado com sucesso!');
        } else {
            alert('Erro ao criar depoimento');
        }
    } catch (error) {
        console.error('Erro ao criar depoimento:', error);
        alert('Erro ao criar depoimento');
    }
}

async function editTestimonial(id) {
    try {
        const response = await fetch(`/api/testimonials`);
        const testimonials = await response.json();
        const testimonial = testimonials.find(t => t.id === id);
        
        if (testimonial) {
            document.getElementById('testimonial-name').value = testimonial.name;
            document.getElementById('testimonial-position').value = testimonial.position;
            document.getElementById('testimonial-company').value = testimonial.company || '';
            document.getElementById('testimonial-message').value = testimonial.message;
            document.getElementById('testimonial-rating').value = testimonial.rating;
            currentEditingTestimonial = id;
            
            const submitBtn = document.querySelector('#testimonials-section .btn-primary');
            submitBtn.textContent = 'Atualizar Depoimento';
            submitBtn.onclick = updateTestimonial;
        }
    } catch (error) {
        console.error('Erro ao carregar depoimento:', error);
    }
}

async function updateTestimonial() {
    const name = document.getElementById('testimonial-name').value;
    const position = document.getElementById('testimonial-position').value;
    const company = document.getElementById('testimonial-company').value;
    const message = document.getElementById('testimonial-message').value;
    const rating = document.getElementById('testimonial-rating').value;
    
    try {
        const response = await fetch(`/api/testimonials/${currentEditingTestimonial}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, position, company, message, rating: parseInt(rating) })
        });
        
        if (response.ok) {
            document.getElementById('testimonial-form').reset();
            currentEditingTestimonial = null;
            loadTestimonials();
            
            const submitBtn = document.querySelector('#testimonials-section .btn-primary');
            submitBtn.textContent = 'Adicionar Depoimento';
            submitBtn.onclick = createTestimonial;
            
            alert('Depoimento atualizado com sucesso!');
        } else {
            alert('Erro ao atualizar depoimento');
        }
    } catch (error) {
        console.error('Erro ao atualizar depoimento:', error);
        alert('Erro ao atualizar depoimento');
    }
}

async function deleteTestimonial(id) {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) return;
    
    try {
        const response = await fetch(`/api/testimonials/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadTestimonials();
            alert('Depoimento excluído com sucesso!');
        } else {
            alert('Erro ao excluir depoimento');
        }
    } catch (error) {
        console.error('Erro ao excluir depoimento:', error);
        alert('Erro ao excluir depoimento');
    }
}

// Additional functions for Courses
async function createCourse() {
    const title = document.getElementById('course-title').value;
    const description = document.getElementById('course-description').value;
    const price = document.getElementById('course-price').value;
    const category = document.getElementById('course-category').value;
    const icon = document.getElementById('course-icon').value || 'fas fa-graduation-cap';
    
    if (!title || !description || !price) {
        alert('Título, descrição e preço são obrigatórios');
        return;
    }
    
    try {
        const response = await fetch('/api/courses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, price: parseFloat(price), category, icon })
        });
        
        if (response.ok) {
            document.getElementById('course-form').reset();
            loadCourses();
            alert('Curso criado com sucesso!');
        } else {
            alert('Erro ao criar curso');
        }
    } catch (error) {
        console.error('Erro ao criar curso:', error);
        alert('Erro ao criar curso');
    }
}

async function editCourse(id) {
    try {
        const response = await fetch(`/api/courses`);
        const courses = await response.json();
        const course = courses.find(c => c.id === id);
        
        if (course) {
            document.getElementById('course-title').value = course.title;
            document.getElementById('course-description').value = course.description;
            document.getElementById('course-price').value = course.price;
            document.getElementById('course-category').value = course.category;
            document.getElementById('course-icon').value = course.icon;
            currentEditingCourse = id;
            
            const submitBtn = document.querySelector('#courses-section .btn-primary');
            submitBtn.textContent = 'Atualizar Curso';
            submitBtn.onclick = updateCourse;
        }
    } catch (error) {
        console.error('Erro ao carregar curso:', error);
    }
}

async function updateCourse() {
    const title = document.getElementById('course-title').value;
    const description = document.getElementById('course-description').value;
    const price = document.getElementById('course-price').value;
    const category = document.getElementById('course-category').value;
    const icon = document.getElementById('course-icon').value;
    
    try {
        const response = await fetch(`/api/courses/${currentEditingCourse}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, price: parseFloat(price), category, icon })
        });
        
        if (response.ok) {
            document.getElementById('course-form').reset();
            currentEditingCourse = null;
            loadCourses();
            
            const submitBtn = document.querySelector('#courses-section .btn-primary');
            submitBtn.textContent = 'Adicionar Curso';
            submitBtn.onclick = createCourse;
            
            alert('Curso atualizado com sucesso!');
        } else {
            alert('Erro ao atualizar curso');
        }
    } catch (error) {
        console.error('Erro ao atualizar curso:', error);
        alert('Erro ao atualizar curso');
    }
}

async function deleteCourse(id) {
    if (!confirm('Tem certeza que deseja excluir este curso?')) return;
    
    try {
        const response = await fetch(`/api/courses/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadCourses();
            alert('Curso excluído com sucesso!');
        } else {
            alert('Erro ao excluir curso');
        }
    } catch (error) {
        console.error('Erro ao excluir curso:', error);
        alert('Erro ao excluir curso');
    }
}

// Blog functions
async function createBlog() {
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;
    
    if (!title || !content) {
        alert('Título e conteúdo são obrigatórios');
        return;
    }
    
    try {
        const response = await fetch('/api/blogs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });
        
        if (response.ok) {
            document.getElementById('blog-form').reset();
            loadBlogs();
            alert('Blog criado com sucesso!');
        } else {
            alert('Erro ao criar blog');
        }
    } catch (error) {
        console.error('Erro ao criar blog:', error);
        alert('Erro ao criar blog');
    }
}

async function editBlog(id) {
    try {
        const response = await fetch(`/api/blogs`);
        const blogs = await response.json();
        const blog = blogs.find(b => b.id === id);
        
        if (blog) {
            document.getElementById('blog-title').value = blog.title;
            document.getElementById('blog-content').value = blog.content;
            currentEditingBlog = id;
            
            const submitBtn = document.querySelector('#blogs-section .btn-primary');
            submitBtn.textContent = 'Atualizar Blog';
            submitBtn.onclick = updateBlog;
        }
    } catch (error) {
        console.error('Erro ao carregar blog:', error);
    }
}

async function updateBlog() {
    const title = document.getElementById('blog-title').value;
    const content = document.getElementById('blog-content').value;
    
    try {
        const response = await fetch(`/api/blogs/${currentEditingBlog}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, content })
        });
        
        if (response.ok) {
            document.getElementById('blog-form').reset();
            currentEditingBlog = null;
            loadBlogs();
            
            const submitBtn = document.querySelector('#blogs-section .btn-primary');
            submitBtn.textContent = 'Adicionar Blog';
            submitBtn.onclick = createBlog;
            
            alert('Blog atualizado com sucesso!');
        } else {
            alert('Erro ao atualizar blog');
        }
    } catch (error) {
        console.error('Erro ao atualizar blog:', error);
        alert('Erro ao atualizar blog');
    }
}

async function deleteBlog(id) {
    if (!confirm('Tem certeza que deseja excluir este blog?')) return;
    
    try {
        const response = await fetch(`/api/blogs/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadBlogs();
            alert('Blog excluído com sucesso!');
        } else {
            alert('Erro ao excluir blog');
        }
    } catch (error) {
        console.error('Erro ao excluir blog:', error);
        alert('Erro ao excluir blog');
    }
}

// Video functions
async function createVideo() {
    const title = document.getElementById('video-title').value;
    const description = document.getElementById('video-description').value;
    const url = document.getElementById('video-url').value;
    const duration = document.getElementById('video-duration').value;
    
    if (!title || !description || !url) {
        alert('Título, descrição e URL são obrigatórios');
        return;
    }
    
    try {
        const response = await fetch('/api/videos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, url, duration })
        });
        
        if (response.ok) {
            document.getElementById('video-form').reset();
            loadVideos();
            alert('Vídeo criado com sucesso!');
        } else {
            alert('Erro ao criar vídeo');
        }
    } catch (error) {
        console.error('Erro ao criar vídeo:', error);
        alert('Erro ao criar vídeo');
    }
}

async function editVideo(id) {
    try {
        const response = await fetch(`/api/videos`);
        const videos = await response.json();
        const video = videos.find(v => v.id === id);
        
        if (video) {
            document.getElementById('video-title').value = video.title;
            document.getElementById('video-description').value = video.description;
            document.getElementById('video-url').value = video.url;
            document.getElementById('video-duration').value = video.duration;
            currentEditingVideo = id;
            
            const submitBtn = document.querySelector('#videos-section .btn-primary');
            submitBtn.textContent = 'Atualizar Vídeo';
            submitBtn.onclick = updateVideo;
        }
    } catch (error) {
        console.error('Erro ao carregar vídeo:', error);
    }
}

async function updateVideo() {
    const title = document.getElementById('video-title').value;
    const description = document.getElementById('video-description').value;
    const url = document.getElementById('video-url').value;
    const duration = document.getElementById('video-duration').value;
    
    try {
        const response = await fetch(`/api/videos/${currentEditingVideo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, url, duration })
        });
        
        if (response.ok) {
            document.getElementById('video-form').reset();
            currentEditingVideo = null;
            loadVideos();
            
            const submitBtn = document.querySelector('#videos-section .btn-primary');
            submitBtn.textContent = 'Adicionar Vídeo';
            submitBtn.onclick = createVideo;
            
            alert('Vídeo atualizado com sucesso!');
        } else {
            alert('Erro ao atualizar vídeo');
        }
    } catch (error) {
        console.error('Erro ao atualizar vídeo:', error);
        alert('Erro ao atualizar vídeo');
    }
}

async function deleteVideo(id) {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;
    
    try {
        const response = await fetch(`/api/videos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadVideos();
            alert('Vídeo excluído com sucesso!');
        } else {
            alert('Erro ao excluir vídeo');
        }
    } catch (error) {
        console.error('Erro ao excluir vídeo:', error);
        alert('Erro ao excluir vídeo');
    }
}

