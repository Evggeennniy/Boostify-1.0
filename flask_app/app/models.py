import uuid
from decimal import Decimal

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

from app.errors import OrderErrorModerator
from app.service import add_order

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
        db.Enum('Обробка', 'Виконаний', 'Обробка Кешбек', 'Підтверджений', 'Підтверджений Кешбек', 'Відхилений', name='bill_status'),
        default='Обробка',
        nullable=False
    )
    is_cashback_issued = db.Column(db.Boolean, default=False)
    is_service_start_issued = db.Column(db.Boolean, default=False)
    created = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship('User', backref='bills')

    user_id = db.Column(db.String, db.ForeignKey('users.id'))

    orders = db.relationship(
        'Order', backref='bill', lazy=False, cascade="all, delete-orphan"
    )

    @property
    def total_order_sum(self):
        return sum(order.price for order in self.orders)

    def cashback_accrual(self):
        """Нарахування кешбеку"""
        cashback_amount = self.total_order_sum * Decimal(0.10)
        self.user.increase_balance(cashback_amount)
        self.is_cashback_issued = True

    def cashback_return(self):
        """Повернення кешбеку"""
        self.user.increase_balance(self.total_order_sum)
        self.is_cashback_issued = False

    def cashback_pay(self):
        """Оплата кешбеку"""
        total_order_sum= self.total_order_sum
        try:
            self.user.decrease_balance(total_order_sum) # -
            self.user.increase_balance(total_order_sum * Decimal(0.10)) # +
            self.is_cashback_issued = True
        except OrderErrorModerator as e:
            self.status = "Відхилений"
            raise e

    def start_bill(self):
        for order in self.orders:
            order.start_order()
        self.is_service_start_issued = True


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
    service_result = db.Column(db.String(100))

    def __repr__(self):
        return f'<{self.instance} {self.service}>'

    def start_order(self):
        self.service_result = add_order(self.service_id, self.quantity, self.url)



class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    balance_cashback = db.Column(db.DECIMAL(5, 2), default=0)

    def increase_balance(self, amount):
        """Збільшує баланс на задану суму."""
        self.balance_cashback += amount
        db.session.commit()

    def decrease_balance(self, amount):
        """Зменшує баланс на задану суму, якщо коштів достатньо."""
        if self.balance_cashback >= amount:
            self.balance_cashback -= amount
            db.session.flush()  # Примусове оновлення в базі перед комітом
            db.session.commit()
        else:
            raise OrderErrorModerator("Недостатньо коштів на кешбек-рахунку")


    @classmethod
    def get_cashback(cls, user_id):
        """Отримує користувача або створює нового, якщо його немає."""
        user = db.session.get(cls, str(user_id))  # SQLAlchemy 2.0
        if not user:
            user = cls(id=str(user_id), balance_cashback=0)
            db.session.add(user)
            db.session.commit()
        return user.balance_cashback

    def __repr__(self):
        return f'<{self.id} {self.service}>'
