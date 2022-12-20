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
    JobId = models.CharField(blank=True,null=True,max_length=20,)
    Email = models.EmailField(max_length=50,blank=True,null=True)
    Epochs = models.IntegerField(default=500,blank=True,null=True)
    Start= models.IntegerField(default=1,blank=True,null=True)
    End = models.IntegerField(default=56,blank=True,null=True) 
    Seed = models.IntegerField(default=42,blank=True,null=True) 
    BatchSize = models.IntegerField(default=1,blank=True,null=True)
    Encoder = models.CharField(default='mlp',max_length=10)
    EncoderDropout = models.FloatField(default=0.0)
    EncoderHidden = models.IntegerField(default=256)
    Decoder = models.CharField(default='rnn',max_length=10)
    DecoderDropout = models.FloatField(default=0.0)
    DecoderHidden = models.IntegerField(default=256)
    VisualThreshold = models.FloatField(default=0.6)
    DistThreshold = models.IntegerField(default=12)
    Lr = models.FloatField(default=0.0005)
    LrDecay = models.IntegerField(default=200)
    TimestepSize  = models.IntegerField(default=50)
    TrainInterval = models.IntegerField(default=60)
    ValidateInterval = models.IntegerField(default=80)
    TestInterval = models.IntegerField(default=100)
    Var = models.FloatField(default=0.00005)
    Gamma = models.FloatField(default=0.5)
    Domain =  models.CharField(default='A_0_40,B_41_70,C_71_76',max_length=100)
    SourceNode = models.IntegerField(default=46)
    TargetNode = models.IntegerField(default=61)
    JobStatus = models.BooleanField(default=False)
    NumResidues = models.IntegerField(default=0)
    NumFrames = models.IntegerField(default=0)
    Created_at = models.DateTimeField(auto_now_add=True,)
    TrajFilePath = models.CharField(max_length=500,blank=True,null=True)
    StrucFilePath = models.CharField(max_length=500,blank=True,null=True)
    DomainImg = models.ImageField(null=True) 
    ProbsImg = models.ImageField(null=True) 
    PathTxt = models.FileField(null=True) 
# {'Name': 'user', 'Email': '', 'JobId': 'jobid', 
# 'TrajFilePath': '/home/hy/media/volume/sdb/files/332395_ca_1.pdb', 'NumResidues': 77,
#  'NumFrames': 3000, 'Start': 1, 'End': 56, 'TimestepSize': 50, 'TrainInterval': 60, 
#  'ValidateInterval': 80, 'TestInterval': 100, 'Epochs': 200, 'Lr': 0.0005, 
#  'LrDecay': 200, 'Gamma': 0.5, 'Var': 5e-05, 'Encoder': 'mlp', 'Decoder': 'rnn', 
#  'EncoderHidden': 256, 'DecoderHidden': 256, 'EncoderDropout': 0, 'DecoderDropout': 0, 
#  'StrucFilePath': '', 'DistThreshold': 12, 'SourceNode': 46, 'TargetNode': 61, 
#  'Domain': 'A_0_40,B_41_70,C_71_76'}