from django.conf.urls import patterns, include, url

from django.contrib import admin
import BillboardTask
from BillboardTask import views



admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'billboard.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^register/', views.register, name='Registration'),
    #url(r'^continue/', views.process_register, name='process_register'),
    url(r'^$', BillboardTask.views.main),
    url(r'^(?P<cname>[A-Za-z]{1,})/$', views.category_view, name = 'Category.name'), # /<cat_name>/
    url(r'^(?P<cname>[A-Za-z]{1,})/(?P<advid>\d+)/$', views.advert_view, name = 'Advert.id'), # /<cat_name>/<adv_id>
)
