from flask import Blueprint, request, jsonify
from models.solution import Solution, db
from app import trigger_netlify_build # <--- LINHA ADICIONADA

solution_bp = Blueprint("solution", __name__)

@solution_bp.route("/solutions", methods=["GET"])
def get_solutions():
    solutions = Solution.query.order_by(Solution.created_at.desc()).all()
    return jsonify([solution.to_dict() for solution in solutions])

@solution_bp.route("/solutions", methods=["POST"])
def create_solution():
    data = request.get_json()
    
    if not data or "title" not in data or "description" not in data:
        return jsonify({"error": "Título e descrição são obrigatórios"}), 400
    
    solution = Solution(
        title=data["title"],
        description=data["description"],
        icon=data.get("icon", "fas fa-cogs")
    )
    
    try:
        db.session.add(solution)
        db.session.commit()
        trigger_netlify_build() # <--- LINHA ADICIONADA
        return jsonify(solution.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@solution_bp.route("/solutions/<int:solution_id>", methods=["PUT"])
def update_solution(solution_id):
    solution = Solution.query.get_or_404(solution_id)
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Dados não fornecidos"}), 400
    
    solution.title = data.get("title", solution.title)
    solution.description = data.get("description", solution.description)
    solution.icon = data.get("icon", solution.icon)
    
    try:
        db.session.commit()
        trigger_netlify_build() # <--- LINHA ADICIONADA
        return jsonify(solution.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@solution_bp.route("/solutions/<int:solution_id>", methods=["DELETE"])
def delete_solution(solution_id):
    solution = Solution.query.get_or_404(solution_id)
    
    try:
        db.session.delete(solution)
        db.session.commit()
        trigger_netlify_build() # <--- LINHA ADICIONADA
        return jsonify({"message": "Solução excluída com sucesso"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
