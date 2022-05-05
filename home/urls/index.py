from django.urls import path,include
from home.views.index import index
urlpatterns = [
    path("",index,name="index"),
    path("menu/",include("home.urls.menu.index")),
    path("playground/",include("home.urls.playground.index")),
    path("settings/",include("home.urls.settings.index")),
]

