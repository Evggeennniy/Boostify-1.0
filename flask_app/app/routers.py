import uuid

from flask import request, jsonify, abort

from app.errors import OrderErrorModerator
from app.models import db, Object, Bill, Order, User
from decimal import Decimal

from app.utils import send_message, answer_callback_query, hide_keyboard


def init_routers(app, cache):
    @app.after_request
    def after_request_handler(response):
        # Перевіряємо, чи шлях починається з /api
        if not request.path.startswith('/api'):
            return response

        request_uuid = request.cookies.get('uuid')
        if not request_uuid:
            request_uuid = uuid.uuid4()
            response.set_cookie('uuid', str(request_uuid))
        return response

    @app.route('/api/cashback', methods=('GET',))
    def api_cashback():
        cashback = str(User.get_cashback(request.cookies.get('uuid')))
        return cashback, 200

    @app.route('/bot_handler', methods=('POST',))
    def bot_handler():
        try:
            data = request.json
            if "callback_query" in data:
                callback = data["callback_query"]
                callback_id = callback["id"]
                data_parts = callback["data"].split("_")
                action = data_parts[0]
                message_id = callback["message"]["message_id"]
                order_id = int(data_parts[1])

                # Шукаємо замовлення в базі даних
                bill = db.session.query(Bill).filter(Bill.id == order_id).first()
                if not bill:
                    answer_callback_query(callback_id,"Помилка ❗️❗️")
                    send_message("Помилка:🔍 Замовлення не знайдено❗️❗️")
                    hide_keyboard(message_id)
                    return 'OK', 200

                if action == "acceptCashback" and not bill.is_cashback_issued:
                    try:
                        bill.cashback_pay()
                        bill.status = 'Підтверджений Кешбек'
                        db.session.add(bill)
                        db.session.commit()
                        answer_callback_query(callback_id, "🍾 Оновлено 🦫")
                    except OrderErrorModerator:
                        answer_callback_query(callback_id, "Помилка ❗️❗️")
                        send_message("Помилка: недостатньо 🦫 кешбеку для списання! Замовлення відхилено.❗️❗️")

                elif action == "acceptPay" and not bill.is_cashback_issued:
                    bill.cashback_accrual()
                    bill.status = 'Підтверджений'
                    db.session.add(bill)
                    db.session.commit()
                elif action == "cancel":
                    bill.status = 'Відхилений'
                    db.session.add(bill)
                    db.session.commit()
                elif bill.is_cashback_issued:
                    answer_callback_query(callback_id, "Операція була зроблена раніше")

                if (action == "acceptPay" or action == "acceptCashback") and not bill.is_service_start_issued:
                    bill.start_bill()
                    db.session.add(bill)
                    db.session.commit()
                    answer_callback_query(callback_id, "Запрос до сервера зроблено")

                print(message_id)
                hide_keyboard(message_id)
                answer_callback_query(callback_id, "Дія не знайдена")
        except Exception as e:
            print(e)
        return 'OK', 200

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
        user_id = request.cookies.get('uuid')

        new_bill = Bill(status= "Обробка Кешбек" if data["is_cashback_pay"] else 'Обробка',
                        user_id=user_id)
        db.session.add(new_bill)
        db.session.commit()

        new_orders = []
        price = Decimal(0)
        for item in data["items"]:
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


        if data["is_cashback_pay"]:
            status = "🦫 Оплачено кешбеком"
            button_main = [{"text": "✅ Підтвердити оплату кешбеком🦫", "callback_data": f"acceptCashback_{new_bill.id}"}]
        else:
            status = '💳 Оплачено карткою'
            button_main = [{"text": "✅ Підтвердити оплату картою 💳", "callback_data": f"acceptPay_{new_bill.id}"}]

        keyboard = {
            "inline_keyboard": [
                button_main,
                [{"text": "❌ Відмінити", "callback_data": f"cancel_{new_bill.id}"}]
            ]
        }

        message = f'🔹 Нове замовлення #{new_bill.id}\nТип оплати {status}\nСума {price} грн.'
        send_message(message, keyboard)

        return '', 200


