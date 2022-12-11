from django.db import models
import datetime
from django.utils import crypto
# Create your models here.
class TrajectoryFileModel(models.Model):
    TrajectoryFile = models.FileField(blank=True, null=True)

class StructureFileModel(models.Model):
    StructureFile = models.FileField(blank=True, null=True)

def  unique_job_id():
    length=4
    time = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    #code = ''.join(random.sample(string.ascii_uppercase,4))
    code=crypto.get_random_string(length, allowed_chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ')
    return time+code

# Create your models here.
class JobModel(models.Model):
    Name = models.CharField(max_length=50,blank=True,null=True)
    JobId = models.CharField(max_length=20, default=unique_job_id, unique=True,)
    Email = models.EmailField(max_length=50,blank=True,null=True)
    Epochs = models.IntegerField(default=500)
    BatchSize = models.IntegerField(default=1)
    Encoder = models.CharField(default='mlp',max_length=10)
    Decoder = models.CharField(default='rnn',max_length=10)
    Lr = models.FloatField(default=0.0005)
    JobStatus = models.BooleanField(default=False)
    Created_at = models.DateTimeField(auto_now_add=True)
    TrajFilePath = models.CharField(max_length=500,unique=True,null=True)
    StrucFilePath = models.CharField(max_length=500,blank=True,null=True)
    DomainImg = models.ImageField(null=True) 
    ProbsImg = models.ImageField(null=True) 
    PathTxt = models.FileField(null=True) 