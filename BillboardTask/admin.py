from django.contrib import admin
from BillboardTask.models import Category, Advert, CategoryAndAdvert, User


# Register your models here.
admin.site.register(Category)
admin.site.register(Advert)
admin.site.register(CategoryAndAdvert)
admin.site.register(User)