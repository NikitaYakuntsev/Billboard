from django.conf.urls import patterns, include, url

from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
import BillboardTask
from BillboardTask import views



admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'billboard.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^register/', views.register, name='Registration'),
    url(r'^login/', views.login_view, name='Login'),
    url(r'^logout/', views.logout_view, name='Logout'),
    url(r'^$', BillboardTask.views.main, name='Main'),
    url(r'^(?P<cname>[A-Za-z]{1,})/$', views.category_view, name = 'Category.name'), # /<cat_name>/
    url(r'^(?P<cname>[A-Za-z]{1,})/(?P<advid>\d+)/$', views.advert_view, name = 'Advert.id'), # /<cat_name>/<adv_id>
)

urlpatterns += staticfiles_urlpatterns()