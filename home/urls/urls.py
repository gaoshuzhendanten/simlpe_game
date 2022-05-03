from django.urls import path
from home.views.views import index
urlpatterns = [
    path("",index),
]
