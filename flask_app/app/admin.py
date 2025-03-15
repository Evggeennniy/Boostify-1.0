from flask_admin.contrib.sqla import ModelView
from app.models import db, Service, Object, Bill, Order
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.form.upload import FileUploadField
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
    form_columns = ('created', 'status')
    column_searchable_list = ('id', 'created')
    column_filters = ('status',)
    column_default_sort = ('created', True)

    inline_models = [Order,]


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
    admin.init_app(app)
