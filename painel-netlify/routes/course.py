from flask import Blueprint, request, jsonify
from models.course import Course, db
from app import trigger_netlify_build # <--- LINHA ADICIONADA

course_bp = Blueprint("course", __name__)

@course_bp.route("/courses", methods=["GET"])
def get_courses():
    courses = Course.query.order_by(Course.created_at.desc()).all()
    return jsonify([course.to_dict() for course in courses])

@course_bp.route("/courses", methods=["POST"])
def create_course():
    data = request.get_json()
    
    if not data or "title" not in data or "description" not in data or "price" not in data:
        return jsonify({"error": "Título, descrição e preço são obrigatórios"}), 400
    
    course = Course(
        title=data["title"],
        description=data["description"],
        price=float(data["price"]),
        icon=data.get("icon", "fas fa-graduation-cap"),
        category=data.get("category", "curso")
    )
    
    try:
        db.session.add(course)
        db.session.commit()
        trigger_netlify_build() # <--- LINHA ADICIONADA
        return jsonify(course.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@course_bp.route("/courses/<int:course_id>", methods=["PUT"])
def update_course(course_id):
    course = Course.query.get_or_404(course_id)
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Dados não fornecidos"}), 400
    
    course.title = data.get("title", course.title)
    course.description = data.get("description", course.description)
    if "price" in data:
        course.price = float(data["price"])
    course.icon = data.get("icon", course.icon)
    course.category = data.get("category", course.category)
    
    try:
        db.session.commit()
        trigger_netlify_build() # <--- LINHA ADICIONADA
        return jsonify(course.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@course_bp.route("/courses/<int:course_id>", methods=["DELETE"])
def delete_course(course_id):
    course = Course.query.get_or_404(course_id)
    
    try:
        db.session.delete(course)
        db.session.commit()
        trigger_netlify_build() # <--- LINHA ADICIONADA
        return jsonify({"message": "Curso excluído com sucesso"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
