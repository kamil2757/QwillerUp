from rest_framework import serializers

from HonorBoard.models import HonorBoard


class HonorBoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = HonorBoard
        fields = '__all__'