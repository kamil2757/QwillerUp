from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from HonorBoard.views import GetHonorBoardView

urlpatterns = [
    path('get-messages/', GetHonorBoardView.as_view(), name='register'),
]