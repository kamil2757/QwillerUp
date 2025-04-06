from rest_framework import serializers

from HonorBoard.models import HonorBoard


class HonorBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = HonorBoard
        fields = "__all__"

# class HonorBoardSerializer(serializers.ModelSerializer):
#     photo = serializers.CharField(source='user.photo', read_only=True)
#
#     class Meta:
#         model = HonorBoard
#         fields = ['entries', 'date', 'photo']