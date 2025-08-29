from flask import Blueprint, request, jsonify
from models.service import Service, db
from app import trigger_netlify_build # <--- LINHA ADICIONADA

service_bp = Blueprint("service", __name__)

@service_bp.route("/services", methods=["GET"])
def get_services():
    services = Service.query.order_by(Service.created_at.desc()).all()
    return jsonify([service.to_dict() for service in services])

@service_bp.route("/services", methods=["POST"])
def create_service():
    data = request.get_json()
    
    if not data or "title" not in data or "description" not in data:
        return jsonify({"error": "Título e descrição são obrigatórios"}), 400
    
    service = Service(
        title=data["title"],
        description=data["description"],
        icon=data.get("icon", "fas fa-cogs")
    )
    
    try:
        db.session.add(service)
        db.session.commit()
        trigger_netlify_build() # <--- LINHA ADICIONADA
        return jsonify(service.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@service_bp.route("/services/<int:service_id>", methods=["PUT"])
def update_service(service_id):
    service = Service.query.get_or_404(service_id)
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Dados não fornecidos"}), 400
    
    service.title = data.get("title", service.title)
    service.description = data.get("description", service.description)
    service.icon = data.get("icon", service.icon)
    
    try:
        db.session.commit()
        trigger_netlify_build() # <--- LINHA ADICIONADA
        return jsonify(service.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@service_bp.route("/services/<int:service_id>", methods=["DELETE"])
def delete_service(service_id):
    service = Service.query.get_or_404(service_id)
    
    try:
        db.session.delete(service)
        db.session.commit()
        trigger_netlify_build() # <--- LINHA ADICIONADA
        return "", 204 # <--- Adicionado retorno para a rota DELETE
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

