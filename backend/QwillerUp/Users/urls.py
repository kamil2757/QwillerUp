from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from Users.views import RegisterUser, LoginUser, GetUserByAccess

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register'),
    path('login/', LoginUser.as_view(), name='login'),
    path('userInfo/', GetUserByAccess.as_view(), name='userInfo'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]