from django.conf.urls import patterns, include, url

from django.contrib import admin
import BillboardTask
from BillboardTask import views
from BillboardTask.models import Category


admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'billboard.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', BillboardTask.views.main),
    url(r'^(?P<cname>[A-Za-z]{1,})/$', views.category_view, name = 'Category.name'),
)
