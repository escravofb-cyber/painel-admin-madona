from .user import db
from datetime import datetime

class ContactInfo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(200), nullable=False)
    address = db.Column(db.Text, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    whatsapp = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    instagram = db.Column(db.String(100), nullable=True)
    facebook = db.Column(db.String(100), nullable=True)
    working_hours = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'company_name': self.company_name,
            'address': self.address,
            'phone': self.phone,
            'whatsapp': self.whatsapp,
            'email': self.email,
            'instagram': self.instagram,
            'facebook': self.facebook,
            'working_hours': self.working_hours,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

