from django.conf.urls import patterns, include, url

from django.contrib import admin
import BillboardTask.views


admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'billboard.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', BillboardTask.views.main),
    #url(r'^(?P<category_name>\d+)/$', views.category, name='category'),
)
