from django.conf.urls import include, url
from django.contrib import admin
from main.views import *

urlpatterns = [
    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', IndexView.as_view()),
    url(r'^new_game/', NewGameView.as_view()),
    url(r'^example/', example),
]
