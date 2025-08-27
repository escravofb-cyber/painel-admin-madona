from flask import Blueprint, request, jsonify
from models.video import Video, db

video_bp = Blueprint('video', __name__)

@video_bp.route('/videos', methods=['GET'])
def get_videos():
    videos = Video.query.order_by(Video.created_at.desc()).all()
    return jsonify([video.to_dict() for video in videos])

@video_bp.route('/videos', methods=['POST'])
def create_video():
    data = request.get_json()
    
    if not data or not data.get('title') or not data.get('description') or not data.get('url'):
        return jsonify({'error': 'Título, descrição e URL são obrigatórios'}), 400
    
    video = Video(
        title=data['title'],
        description=data['description'],
        url=data['url'],
        duration=data.get('duration', '')
    )
    
    db.session.add(video)
    db.session.commit()
    
    return jsonify(video.to_dict()), 201

@video_bp.route('/videos/<int:video_id>', methods=['GET'])
def get_video(video_id):
    video = Video.query.get_or_404(video_id)
    return jsonify(video.to_dict())

@video_bp.route('/videos/<int:video_id>', methods=['PUT'])
def update_video(video_id):
    video = Video.query.get_or_404(video_id)
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Dados não fornecidos'}), 400
    
    if 'title' in data:
        video.title = data['title']
    if 'description' in data:
        video.description = data['description']
    if 'url' in data:
        video.url = data['url']
    if 'duration' in data:
        video.duration = data['duration']
    
    db.session.commit()
    
    return jsonify(video.to_dict())

@video_bp.route('/videos/<int:video_id>', methods=['DELETE'])
def delete_video(video_id):
    video = Video.query.get_or_404(video_id)
    db.session.delete(video)
    db.session.commit()
    
    return '', 204

