from flask import Blueprint, request, jsonify
from models.testimonial import Testimonial, db

testimonial_bp = Blueprint('testimonial', __name__)

@testimonial_bp.route('/testimonials', methods=['GET'])
def get_testimonials():
    testimonials = Testimonial.query.order_by(Testimonial.created_at.desc()).all()
    return jsonify([testimonial.to_dict() for testimonial in testimonials])

@testimonial_bp.route('/testimonials', methods=['POST'])
def create_testimonial():
    data = request.get_json()
    
    if not data or 'name' not in data or 'message' not in data or 'position' not in data:
        return jsonify({'error': 'Nome, cargo e mensagem são obrigatórios'}), 400
    
    testimonial = Testimonial(
        name=data['name'],
        position=data['position'],
        company=data.get('company'),
        message=data['message'],
        rating=data.get('rating', 5)
    )
    
    try:
        db.session.add(testimonial)
        db.session.commit()
        return jsonify(testimonial.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@testimonial_bp.route('/testimonials/<int:testimonial_id>', methods=['PUT'])
def update_testimonial(testimonial_id):
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Dados não fornecidos'}), 400
    
    testimonial.name = data.get('name', testimonial.name)
    testimonial.position = data.get('position', testimonial.position)
    testimonial.company = data.get('company', testimonial.company)
    testimonial.message = data.get('message', testimonial.message)
    testimonial.rating = data.get('rating', testimonial.rating)
    
    try:
        db.session.commit()
        return jsonify(testimonial.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@testimonial_bp.route('/testimonials/<int:testimonial_id>', methods=['DELETE'])
def delete_testimonial(testimonial_id):
    testimonial = Testimonial.query.get_or_404(testimonial_id)
    
    try:
        db.session.delete(testimonial)
        db.session.commit()
        return jsonify({'message': 'Depoimento excluído com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

