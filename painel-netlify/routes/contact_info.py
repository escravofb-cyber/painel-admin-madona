from flask import Blueprint, request, jsonify
from models.contact_info import ContactInfo, db

contact_info_bp = Blueprint('contact_info', __name__)

@contact_info_bp.route('/contact-info', methods=['GET'])
def get_contact_info():
    contact = ContactInfo.query.first()
    if contact:
        return jsonify(contact.to_dict())
    return jsonify({'message': 'Nenhuma informação de contato encontrada'}), 404

@contact_info_bp.route('/contact-info', methods=['POST'])
def create_contact_info():
    # Verificar se já existe uma configuração de contato
    existing_contact = ContactInfo.query.first()
    if existing_contact:
        return jsonify({'error': 'Informações de contato já existem. Use PUT para atualizar.'}), 400
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Dados não fornecidos'}), 400
    
    required_fields = ['company_name', 'address', 'phone', 'whatsapp', 'email']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Campo {field} é obrigatório'}), 400
    
    contact = ContactInfo(
        company_name=data['company_name'],
        address=data['address'],
        phone=data['phone'],
        whatsapp=data['whatsapp'],
        email=data['email'],
        instagram=data.get('instagram'),
        facebook=data.get('facebook'),
        working_hours=data.get('working_hours')
    )
    
    try:
        db.session.add(contact)
        db.session.commit()
        return jsonify(contact.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@contact_info_bp.route('/contact-info', methods=['PUT'])
def update_contact_info():
    contact = ContactInfo.query.first()
    if not contact:
        return jsonify({'error': 'Nenhuma informação de contato encontrada'}), 404
    
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Dados não fornecidos'}), 400
    
    contact.company_name = data.get('company_name', contact.company_name)
    contact.address = data.get('address', contact.address)
    contact.phone = data.get('phone', contact.phone)
    contact.whatsapp = data.get('whatsapp', contact.whatsapp)
    contact.email = data.get('email', contact.email)
    contact.instagram = data.get('instagram', contact.instagram)
    contact.facebook = data.get('facebook', contact.facebook)
    contact.working_hours = data.get('working_hours', contact.working_hours)
    
    try:
        db.session.commit()
        return jsonify(contact.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

