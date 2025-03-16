from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

db = SQLAlchemy()


class Object(db.Model):
    __tablename__ = 'object'

    id = db.Column(db.String(32), primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    icon = db.Column(db.String(64), nullable=False)

    def __repr__(self):
        return self.name


class Service(db.Model):
    __tablename__ = 'service'

    id = db.Column(db.Integer, primary_key=True)
    icon = db.Column(db.String(64), nullable=False)
    name = db.Column(db.String(32), nullable=False)
    min_quantity = db.Column(db.Integer, nullable=False)
    service_id = db.Column(db.Integer, unique=True, nullable=False)
    price = db.Column(db.DECIMAL(5, 2), nullable=False)
    service_provider = db.Column(
        db.Enum('wiq', 'global', name='service_type'),
        nullable=False
    )
    assigned_object = db.Column(
        db.String(32), db.ForeignKey('object.id'),
        nullable=False
    )
    object_for = db.relationship(
        'Object', backref='services', lazy=False
    )

    def __repr__(self):
        return self.name


class Bill(db.Model):
    __tablename__ = 'bill'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(
        db.Enum('Обробка', 'Виконаний', 'Відхилений', name='bill_status'),
        default='Обробка',
        nullable=False
    )
    created = db.Column(db.DateTime, default=datetime.now)
    orders = db.relationship(
        'Order', backref='bill', lazy=False, cascade="all, delete-orphan"
    )


class Order(db.Model):
    __tablename__ = 'order'

    id = db.Column(db.Integer, primary_key=True)
    instance = db.Column(db.String(32), nullable=False)
    service = db.Column(db.String(32), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.DECIMAL(10, 2), nullable=False)
    url = db.Column(db.String(256), nullable=False)
    status = db.Column(
        db.Enum('Обробка', 'Виконаний', name='order_status'),
        default='Обробка',
        nullable=False
    )
    provider = db.Column(db.String(16), nullable=False)
    service_id = db.Column(db.Integer, nullable=False)
    assigned_bill = db.Column(db.Integer, db.ForeignKey(
        'bill.id', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return f'<{self.instance} {self.service}>'
