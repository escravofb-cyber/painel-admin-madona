from .user import db
from datetime import datetime

class Testimonial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    company = db.Column(db.String(100), nullable=True)
    message = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=True, default=5)  # 1-5 stars
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'position': self.position,
            'company': self.company,
            'message': self.message,
            'rating': self.rating,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

