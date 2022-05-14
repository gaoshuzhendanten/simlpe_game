from django.urls import path,include
from home.views.settings.getinfo import getinfo
from home.views.settings.login import signin
from home.views.settings.logout import signout
from home.views.settings.register import register

urlpatterns = [
    path("getinfo/",getinfo,name="settings_getinfo"),
    path("login/",signin,name="setting_login"),
    path("logout/",signout,name="setting_logout"),
    path("register/",register,name="setting_register"),
]

