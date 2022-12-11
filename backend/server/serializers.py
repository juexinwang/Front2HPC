
from rest_framework import serializers
from .models import TrajectoryFileModel,JobModel,StructureFileModel
class TrajectoryFileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrajectoryFileModel
        fields = '__all__'

class StructureFileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = StructureFileModel
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobModel
        fields = '__all__'

class JobIdSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobModel
        fields = ['JobId']
