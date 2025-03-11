from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


from Users.views import RegisterUser, LoginUser, GetUserByAccess, GetUserDetail, GetUserMedalsView, UpdateEquippedView

urlpatterns = [
    path('register/', RegisterUser.as_view(), name='register'),
    path('login/', LoginUser.as_view(), name='login'),
    path('userInfo/', GetUserByAccess.as_view(), name='userInfo'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('detailUserInfo/', GetUserDetail.as_view(), name='detail_user_info'),
    path('getUserMedals/', GetUserMedalsView.as_view(), name='get_user_medals'),
    path('updateEquippedMedals/', UpdateEquippedView.as_view(), name='updateEquippedMedals')
]