from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from Users.views import RegisterUser, LoginUser

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register'),
    path('login/', LoginUser.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]