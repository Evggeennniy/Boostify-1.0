from flask import flash
from flask_admin.contrib.sqla import ModelView
from app.models import db, Service, Object, Bill, Order, User
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.form.upload import FileUploadField
from decimal import Decimal
import os


class ObjectAdmin(ModelView):
    column_list = ('id', 'name')
    form_columns = ('icon', 'name', 'id')
    column_searchable_list = ('name', 'id',)
    column_filters = ()

    form_overrides = {
        'icon': FileUploadField
    }
    form_extra_fields = {
        'icon': FileUploadField('Icon', base_path=os.path.join('app', 'static'), relative_path='icons/')
    }


class ServiceAdmin(ModelView):
    column_list = ('id', 'object_for', 'name', )
    form_columns = ('icon', 'name', 'min_quantity', 'price', 'service_provider', 'service_id', 'object_for')
    column_searchable_list = ('id', 'name', 'service_id')
    column_filters = ('service_provider', 'object_for')

    form_overrides = {
        'icon': FileUploadField
    }
    form_extra_fields = {
        'icon': FileUploadField('Icon', base_path=os.path.join('app', 'static'), relative_path='icons/')
    }


class BillAdmin(ModelView):
    column_list = ('id', 'created', 'status')
    form_columns = ('created', 'status' , "user_id","is_cashback_issued")
    column_searchable_list = ('id', 'created')
    column_filters = ('status',)
    column_default_sort = ('created', True)

    inline_models = [Order,]


    def on_model_change(self, form, model, is_created):
        """Обробка змін статусу замовлення для кешбеку."""
        if not is_created:
            current_status = model.status
            # Повернення кешбеку на 'Обробка Кешбек'
            if current_status == 'Обробка Кешбек':
                total_order_sum = sum(order.price for order in model.orders)
                user = model.user
                user.increase_balance(total_order_sum)

            # Оплата кешбеком на 'Підтверджений Кешбек' та нарахування кешбек
            elif current_status == 'Підтверджений Кешбек' and not model.is_cashback_issued:
                total_order_sum = sum(order.price for order in model.orders)
                user = model.user
                try:
                    user.decrease_balance(total_order_sum)
                    user.increase_balance(total_order_sum * Decimal(0.10))
                    model.is_cashback_issued = True
                except ValueError:
                    flash("Помилка: недостатньо кешбеку для списання! Замовлення відхилено.", "error")
                    model.status = "Відхилений"  # Автоматично змінюємо статус

            # Нарахування кешбеку
            elif current_status == 'Підтверджений' and not model.is_cashback_issued:
                total_order_sum = sum(order.price for order in model.orders)
                cashback_amount = total_order_sum * Decimal(0.10)
                user = model.user
                user.increase_balance(cashback_amount)
                model.is_cashback_issued = True

        return super().on_model_change(form, model, is_created)



class UserAdmin(ModelView):
    column_list = ('id', 'balance_cashback')
    form_columns = ('balance_cashback', 'id')
    column_searchable_list = ('balance_cashback', 'id',)
    column_filters = ()



def init_admin(app, basic_auth):
    class MyAdminIndexView(AdminIndexView):
        @expose('/')
        def index(self):
            if not basic_auth.authenticate():
                return basic_auth.challenge()
            return super(MyAdminIndexView, self).index()

    admin = Admin(name='Admin Panel', template_mode='bootstrap4', index_view=MyAdminIndexView())
    admin.add_view(ObjectAdmin(Object, db.session))
    admin.add_view(ServiceAdmin(Service, db.session))
    admin.add_view(BillAdmin(Bill, db.session))
    admin.add_view(UserAdmin(User, db.session))
    admin.init_app(app)
