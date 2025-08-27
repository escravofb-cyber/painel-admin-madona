import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from models.user import db
from models.blog import Blog
from models.video import Video
from models.service import Service
from models.testimonial import Testimonial
from models.solution import Solution
from models.course import Course
from models.site_config import SiteConfig
from models.contact_info import ContactInfo
from models.about_section import AboutSection
from routes.user import user_bp
from routes.blog import blog_bp
from routes.video import video_bp
from routes.service import service_bp
from routes.testimonial import testimonial_bp
from routes.solution import solution_bp
from routes.course import course_bp
from routes.site_config import site_config_bp
from routes.contact_info import contact_info_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Enable CORS for all routes
CORS(app)

app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(blog_bp, url_prefix='/api')
app.register_blueprint(video_bp, url_prefix='/api')
app.register_blueprint(service_bp, url_prefix='/api')
app.register_blueprint(testimonial_bp, url_prefix='/api')
app.register_blueprint(solution_bp, url_prefix='/api')
app.register_blueprint(course_bp, url_prefix='/api')
app.register_blueprint(site_config_bp, url_prefix='/api')
app.register_blueprint(contact_info_bp, url_prefix='/api')

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()
    
    # Add sample data if tables are empty
    if Blog.query.count() == 0:
        sample_blog = Blog(
            title="Como Otimizar Processos Industriais",
            content="A otimização de processos industriais é fundamental para aumentar a eficiência e reduzir custos. Neste artigo, vamos explorar as principais técnicas e metodologias utilizadas na engenharia industrial para melhorar a produtividade das empresas."
        )
        db.session.add(sample_blog)
    
    if Video.query.count() == 0:
        sample_video = Video(
            title="Introdução à Engenharia de Processos",
            description="Este vídeo oferece uma visão geral dos conceitos fundamentais da engenharia de processos e sua aplicação na indústria moderna.",
            url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration="10:30"
        )
        db.session.add(sample_video)
    
    # Adicionar dados de exemplo para Serviços
    if Service.query.count() == 0:
        services = [
            Service(title="Consultoria em Engenharia", description="Análise técnica especializada para otimização de processos industriais e soluções customizadas.", icon="fas fa-tools"),
            Service(title="Projeto e Desenvolvimento", description="Desenvolvimento de projetos de engenharia com foco em inovação e sustentabilidade.", icon="fas fa-drafting-compass"),
            Service(title="Gerenciamento de Obras", description="Gestão completa de obras industriais, garantindo qualidade, prazo e orçamento.", icon="fas fa-hard-hat"),
            Service(title="Treinamento e Capacitação", description="Programas de treinamento para equipes técnicas em processos industriais modernos.", icon="fas fa-chalkboard-teacher")
        ]
        for service in services:
            db.session.add(service)
    
    # Adicionar dados de exemplo para Soluções
    if Solution.query.count() == 0:
        solutions = [
            Solution(title="Automação Industrial", description="Soluções completas para automação de processos industriais, aumentando eficiência e reduzindo custos operacionais.", icon="fas fa-cogs"),
            Solution(title="Melhoria de Processos", description="Análise e otimização de processos produtivos para maximizar a produtividade e minimizar desperdícios.", icon="fas fa-chart-line"),
            Solution(title="Consultoria Técnica", description="Consultoria especializada em engenharia para projetos complexos e desafios técnicos específicos.", icon="fas fa-tools"),
            Solution(title="Gerenciamento de Projetos", description="Gestão completa de projetos de engenharia, desde o planejamento até a execução e entrega.", icon="fas fa-project-diagram")
        ]
        for solution in solutions:
            db.session.add(solution)
    
    # Adicionar dados de exemplo para Depoimentos
    if Testimonial.query.count() == 0:
        testimonials = [
            Testimonial(name="João Silva", position="Diretor Industrial", message="Excelente trabalho! A MADONA PROJETOS superou nossas expectativas com soluções inovadoras.", rating=5),
            Testimonial(name="Maria Santos", position="Gerente de Projetos", message="Profissionalismo e qualidade técnica excepcionais. Recomendo fortemente!", rating=5),
            Testimonial(name="Carlos Oliveira", position="CEO", message="Parceria de longa data. Sempre entregam resultados de alta qualidade.", rating=5)
        ]
        for testimonial in testimonials:
            db.session.add(testimonial)
    
    # Adicionar dados de exemplo para Cursos
    if Course.query.count() == 0:
        courses = [
            Course(title="Automação Industrial", description="Curso completo sobre automação de processos industriais, incluindo teoria e prática.", price=299.00, icon="fas fa-graduation-cap", category="curso"),
            Course(title="Melhoria de Processos", description="Aprenda técnicas avançadas para otimização e melhoria de processos produtivos.", price=249.00, icon="fas fa-cogs", category="curso"),
            Course(title="E-book: Engenharia 4.0", description="Guia completo sobre as tecnologias da Indústria 4.0 e sua aplicação prática.", price=49.00, icon="fas fa-book", category="ebook")
        ]
        for course in courses:
            db.session.add(course)
    
    # Adicionar informações de contato padrão
    if ContactInfo.query.count() == 0:
        contact = ContactInfo(
            company_name="MADONA PROJETOS E CONSULTORIA",
            address="RUA ITAGI,553, PITANGUEIRAS, LAURO DE FREITAS -BA",
            phone="(71) 99916-3467",
            whatsapp="(71) 99916-3467",
            email="COMERCIAL@MPROJETOSBR.COM",
            instagram="@mprojetosbr",
            working_hours="Segunda a Sexta: 08:00 - 17:30"
        )
        db.session.add(contact)
    
    # Adicionar configurações do site
    if SiteConfig.query.count() == 0:
        configs = [
            SiteConfig(key="hero_title", value="Soluções Industriais", description="Título principal da seção hero", section="hero"),
            SiteConfig(key="hero_subtitle", value="Melhoria de Processos", description="Subtítulo da seção hero", section="hero"),
            SiteConfig(key="about_title", value="Sobre a MADONA PROJETOS E CONSULTORIA", description="Título da seção sobre", section="about"),
            SiteConfig(key="newsletter_title", value="Cadastro", description="Título da newsletter", section="newsletter"),
            SiteConfig(key="newsletter_description", value="Ganhe 10% de desconto em sua primeira compra ao se inscrever no nosso boletim informativo!", description="Descrição da newsletter", section="newsletter")
        ]
        for config in configs:
            db.session.add(config)
    
    db.session.commit()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

