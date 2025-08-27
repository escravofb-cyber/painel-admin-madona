from flask import Blueprint, request, jsonify
from models.blog import Blog, db

blog_bp = Blueprint('blog', __name__)

@blog_bp.route('/blogs', methods=['GET'])
def get_blogs():
    blogs = Blog.query.order_by(Blog.created_at.desc()).all()
    return jsonify([blog.to_dict() for blog in blogs])

@blog_bp.route('/blogs', methods=['POST'])
def create_blog():
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('content'):
        return jsonify({'error': 'Título e conteúdo são obrigatórios'}), 400
    
    blog = Blog(
        title=data['title'],
        content=data['content']
    )
    
    db.session.add(blog)
    db.session.commit()
    
    return jsonify(blog.to_dict()), 201

@blog_bp.route('/blogs/<int:blog_id>', methods=['GET'])
def get_blog(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    return jsonify(blog.to_dict())

@blog_bp.route('/blogs/<int:blog_id>', methods=['PUT'])
def update_blog(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Dados não fornecidos'}), 400
    
    if 'title' in data:
        blog.title = data['title']
    if 'content' in data:
        blog.content = data['content']
    
    db.session.commit()
    
    return jsonify(blog.to_dict())

@blog_bp.route('/blogs/<int:blog_id>', methods=['DELETE'])
def delete_blog(blog_id):
    blog = Blog.query.get_or_404(blog_id)
    db.session.delete(blog)
    db.session.commit()
    
    return '', 204

