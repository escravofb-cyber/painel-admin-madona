from flask import Blueprint, request, jsonify
from models.site_config import SiteConfig, db

site_config_bp = Blueprint('site_config', __name__)

@site_config_bp.route('/site-config', methods=['GET'])
def get_site_config():
    configs = SiteConfig.query.all()
    return jsonify([config.to_dict() for config in configs])

@site_config_bp.route('/site-config/section/<section>', methods=['GET'])
def get_config_by_section(section):
    configs = SiteConfig.query.filter_by(section=section).all()
    return jsonify([config.to_dict() for config in configs])

@site_config_bp.route('/site-config', methods=['POST'])
def create_config():
    data = request.get_json()
    
    if not data or 'key' not in data or 'value' not in data:
        return jsonify({'error': 'Chave e valor são obrigatórios'}), 400
    
    # Verificar se a chave já existe
    existing_config = SiteConfig.query.filter_by(key=data['key']).first()
    if existing_config:
        return jsonify({'error': 'Chave já existe'}), 400
    
    config = SiteConfig(
        key=data['key'],
        value=data['value'],
        description=data.get('description'),
        section=data.get('section')
    )
    
    try:
        db.session.add(config)
        db.session.commit()
        return jsonify(config.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@site_config_bp.route('/site-config/<int:config_id>', methods=['PUT'])
def update_config(config_id):
    config = SiteConfig.query.get_or_404(config_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Dados não fornecidos'}), 400
    
    config.value = data.get('value', config.value)
    config.description = data.get('description', config.description)
    config.section = data.get('section', config.section)
    
    try:
        db.session.commit()
        return jsonify(config.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@site_config_bp.route('/site-config/key/<key>', methods=['PUT'])
def update_config_by_key(key):
    config = SiteConfig.query.filter_by(key=key).first_or_404()
    data = request.get_json()
    
    if not data or 'value' not in data:
        return jsonify({'error': 'Valor é obrigatório'}), 400
    
    config.value = data['value']
    config.description = data.get('description', config.description)
    
    try:
        db.session.commit()
        return jsonify(config.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@site_config_bp.route('/site-config/<int:config_id>', methods=['DELETE'])
def delete_config(config_id):
    config = SiteConfig.query.get_or_404(config_id)
    
    try:
        db.session.delete(config)
        db.session.commit()
        return jsonify({'message': 'Configuração excluída com sucesso'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

