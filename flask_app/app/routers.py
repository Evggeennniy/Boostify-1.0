from flask import request, jsonify, abort
from app.models import db, Object, Bill, Order
from config import TG_BOT_API_KEY, TG_GROUP_ID
from decimal import Decimal


def init_routers(app, cache):
    @app.route('/api/services', methods=('GET',))
    def get_services():
        instance_type = request.args.get('instance')
        instance = Object.query.get(instance_type)

        if not instance:
            abort(404)

        instance_services = instance.services
        instance_services = [
            {
                'id': service.id,
                'icon': service.icon,
                'name': service.name,
                'minQuantity': service.min_quantity,
                'pricePerOne': service.price,
                'serviceProvider': service.service_provider,
                'serviceId': service.service_id,
            } for service in instance_services
        ]

        return jsonify({
            'object': {
                'id': instance.id,
                'name': instance.name,
                'icon': instance.icon,
            },
            'services': instance_services,
        })

    @app.route('/api/create_bill', methods=('POST',))
    def create_bill():
        if not request.is_json:
            abort(204)

        data = request.get_json()

        new_bill = Bill(status='Обробка')
        db.session.add(new_bill)
        db.session.commit()

        new_orders = []
        price = Decimal(0)
        for item in data:
            new_order = Order(
                instance=item['instance']['name'],
                service=item['details']['name'],
                quantity=item['details']['quantity'],
                price=item['details']['price'],
                url=item['details']['url'],
                provider=item['details']['serviceProvider'],
                service_id=item['details']['serviceId'],
                assigned_bill=new_bill.id
            )
            new_orders.append(new_order)
            price += Decimal(item['details']['price'])

        db.session.bulk_save_objects(new_orders)
        db.session.commit()

        # TODO SEND MESSAGE TO TG

        return '', 200
