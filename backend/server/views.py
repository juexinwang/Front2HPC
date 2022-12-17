#models
from .models import StructureFileModel,JobModel,TrajectoryFileModel
#serializers
from .serializers import TrajectoryFileModelSerializer,StructureFileModelSerializer,JobSerializer,JobIdSerializer
#viewsets-ModelViewSet
from rest_framework.viewsets import ModelViewSet
#response
from rest_framework.response import Response
from django.http import FileResponse
from hashlib import md5, sha1
from django.http import HttpResponse
#action
from rest_framework.decorators import action
from rest_framework.parsers import FileUploadParser,MultiPartParser, FormParser
import time,os,datetime
from rest_framework import status
from rest_framework.exceptions import APIException
from django.conf import settings
#ml
from rest_framework.views import APIView
from ml.algorithm.convert_dataset import Convert
from ml.algorithm.main import Compute
from ml.algorithm.postanalysis_path import AnalysisPath
from ml.algorithm.postanalysis_visual import AnalysisVisual

from django.core import mail
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job
import os

#auto configration 
# StorageFolder= "/home/hy/Desktop/websever/store/v1/backend/ml/"
StorageFolder= "/media/volume/sdb/jobs/"
JobsFolder = StorageFolder+"jobs/"
TrajFileFolder= StorageFolder+"files/"
StrucFileFolder= StorageFolder+"strucFiles/"
COMPUTE_LOCALHOST = False

if COMPUTE_LOCALHOST:
    scheduler = BackgroundScheduler()
    scheduler.add_jobstore(DjangoJobStore(), 'default')
    register_events(scheduler)
    scheduler.start()

def preditctLocalHost(trajfilepath,email,jobid,epochs,batchsize,encoder,decoder,lr):
    jobfolder=JobsFolder+jobid
    os.mkdir(jobfolder)
    os.mkdir(jobfolder+'/data')
    Convert().convert(MDfolder=trajfilepath,save_folder=jobfolder+'/data')
    print("convert complete")
    os.mkdir(jobfolder+'/logs')
    Compute().compute(epochs=epochs,batch_size=batchsize,args_encoder=encoder,args_decoder=decoder,lr=lr,save_folder=jobfolder+'/logs',dataset_folder=jobfolder)
    print("predict complete")
    os.mkdir(jobfolder+'/analysis')
    AnalysisPath().path(uploadfile_path=trajfilepath,save_folder=jobfolder,)
    AnalysisVisual().visual(save_folder=jobfolder)
    print("analysis complete")
    job = JobModel.objects.get(JobId=jobid)
    job.JobStatus=True
    job.save()
    mail.send_mail(
    subject='submit',
    message='your job has finished, job id is {}'.format(jobid),
    from_email='2938225901@qq.com',
    recipient_list=['{}'.format(email)]
    )

#===========================view: upload trajectory file ===========================
def getSha1(filepath): 
    """compute sha1 for filename"""
    sha1Obj = sha1()
    with open(filepath, 'rb') as f:
        sha1Obj.update(f.read())
    return sha1Obj.hexdigest()
def validate_param(filepath):
    '''Validate params'''
    num_residues = 100000
    oriResiNum = -1
    totalModelNum = 0
    with open(filepath) as f:
        lines = f.readlines()
        for line in lines:
            line = line.strip()
            words = line.split()
            if(line.startswith("MODEL")):
                modelNum = int(words[1])
                totalModelNum = modelNum
                if modelNum == 1:
                    # Do nothing
                    pass                    
                else:
                    oriResiNum = -1
                    if modelNum == 2:
                        num_residues = resiNum
                    else:
                        if not resiNum == num_residues:
                            print('Model error exists in the input:'+str(modelNum))
            elif(line.startswith("ATOM") and words[2] == "CA"):
                resiNum = int(words[1])
                if resiNum > num_residues or resiNum <= oriResiNum:
                    print('Residue error exists in the input model:'+str(modelNum))
                    return
                else:
                    oriResiNum = resiNum
    return num_residues, totalModelNum
class TrajectoryFileAPIView(APIView):
    def get(self,request):
        file = TrajectoryFileModel.objects.all()
        serializer = TrajectoryFileModelSerializer(instance=file,many=True)
        return Response(serializer.data)
    def post(self,request):
        file=request.data['file']
        filename = str(file.name)
        times = str(time.time()).split('.').pop()
        filename = times + '_'+filename
        filepath = TrajFileFolder+filename
        with open(filepath, 'wb+') as destination:
            for chunk in request.data['file'].chunks():
                destination.write(chunk)
        destination.close()
        dict_data={"TrajectoryFile":filepath}
        TrajectoryFileModel.objects.create(**dict_data)
        num_residues, totalModelNum = validate_param(filepath)
        sha1value = getSha1(filepath) 
        return Response({"length_valid":num_residues< 200,'TrajFilePath':filepath,"NumResidues":num_residues,"NumFrames":totalModelNum,"sha1":sha1value})

#===========================view: upload protein structure file===========================
class StructureFileAPIView(APIView):
    def get(self,request):
        file = StructureFileModel.objects.all()
        serializer = StructureFileModelSerializer(instance=file,many=True)
        return Response(serializer.data)
    def post(self,request):
        file=request.data['file']
        filename = str(file.name)
        times = str(time.time()).split('.').pop()
        filename = times + '_'+filename
        filepath = StrucFileFolder+filename
        with open(filepath, 'wb+') as destination:
            for chunk in request.data['file'].chunks():
                destination.write(chunk)
        destination.close()
        dict_data={"StructureFile":filepath}
        StructureFileModel.objects.create(**dict_data)
        return Response({'StrucFilePath':filepath})

#===========================view: upload job===========================
def ten2TwentySix(num,lenth):
    sequence = list(map(lambda x: chr(x), range(ord('A'), ord('Z') + 1)))
    # print(sequence)
    L = []
    if num > 25:
        while True:
            d = int(num / 26)
            remainder = num % 26
            if d <= 25:
                L.insert(0, sequence[remainder])
                print("1",L)
                L.insert(0, sequence[d])
                print("2",L)
                break
            else:
                L.insert(0, sequence[remainder])
                print("3",L)
                num = d
    else:
        L.append(sequence[num])
    fill = (lenth-len(L))*"A"
    return fill+"".join(L)
def TwentySix2Ten(string):
    sequence = list(map(lambda x: chr(x), range(ord('A'), ord('Z') + 1)))
    Ten=0
    for i in range(4):
        number=sequence.index(string[i])
        Ten+=number*(26**(3-i))
    return Ten

class JobAPIView(APIView):
    def get(self,request):
        file = JobModel.objects.all()
        serializer = JobSerializer(instance=file,many=True)
        return Response(serializer.data)
    def post(self,request):
        data_dict = request.data
        filepath=data_dict['TrajFilePath']
        serializer = JobSerializer(data=data_dict)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        job = JobModel.objects.get(TrajFilePath=filepath)
        pk = job.id
        if pk==1:
            print('firstjob')
            time = datetime.datetime.now().strftime("%m%d") 
            jobid = time+ten2TwentySix(1,4)
        else:   
            while True:
                pk-=1
                lastjob = JobModel.objects.get(id=pk)
                if lastjob.JobId != None:
                    lastjobid = lastjob.JobId
                    print(lastjobid)
                    break
            time = datetime.datetime.now().strftime("%m%d") 
            if lastjobid[:4] == time:
                print('lastjob is today',lastjobid[:4])
                todayid = TwentySix2Ten(lastjobid[4:])
                jobid = time+ten2TwentySix(todayid+1,4)
            else:
                print('lastjob is yesterday',lastjobid[:4])
                jobid = time+ten2TwentySix(1,4)
        job.JobId= jobid
        head,tail =os.path.split(filepath)
        print(head,tail)
        newpath = head+"/{}_{}_{}.pdb".format(jobid,str(job.NumResidues),job.NumFrames)
        os.rename(filepath, newpath)
        job.TrajFilePath= newpath
        print('1111',job.TrajFilePath)
        job.save()
        serializer=JobSerializer(instance=job)
        print(serializer.data)
        #=========================compute in LocalHost========================
        if COMPUTE_LOCALHOST:
            scheduler.add_job(preditctLocalHost,args=[serializer.data['TrajFilePath'],serializer.data['Email'],serializer.data['JobId']
                                            ,serializer.data['Epochs'],serializer.data['BatchSize'],serializer.data['Encoder'],serializer.data['Decoder']
                                            ,serializer.data['Lr'],
                                            ])
        #=========================compute in HPC========================
        else:
            jobid = serializer.data["JobId"]
            head,tail=os.path.split(serializer.data['TrajFilePath'])
            filename = tail
            params={
                'start':serializer.data["Start"], # start from 1
                'end':serializer.data["End"],  # start from 1
                'timestep_size':serializer.data["TimestepSize"],
                'train_interval':serializer.data["TrainInterval"],
                'validate_interval':serializer.data["ValidateInterval"],
                'test_interval':serializer.data["TestInterval"],
                'seed':serializer.data["Seed"],
                'epochs':serializer.data["Epochs"],
                'lr':serializer.data["Lr"],
                'encoder_hidden':serializer.data["EncoderHidden"],
                'decoder_hidden':serializer.data["DecoderHidden"],
                'encoder':serializer.data["Encoder"],
                'decoder':serializer.data["Decoder"],
                'encoder_dropout':serializer.data["DecoderDropout"],
                'decoder_dropout':serializer.data["EncoderDropout"],
                'lr_decay':serializer.data["LrDecay"],
                'gamma':serializer.data["Gamma"],
                'var':serializer.data["Var"],
                # postanalysis_path.py
                'dist_threshold':serializer.data["DistThreshold"], # default is end-start+1
                'source_node':serializer.data["SourceNode"], # start from 0
                'target_node':serializer.data["TargetNode"], # start from 0
                # postanalysis_visual.py
                'threshold':serializer.data["VisualThreshold"],
                'domainInput':serializer.data["Domain"],
                #'domainInput':'A_0_40,B_41_70,C_71_76', # default: ',', # start from 0
            }
            #TODO
            # bj = BackJobsRunner(jobid = jobid, filename = filename, params = params)
            # print('Submit:')
            # bj.submit()
            # print('Submit finished.')
        return Response(serializer.data)
           
#===========================view: check and get result===========================
import base64
class ResultAPIView(APIView):
    def get(self, request):
        print(request.GET)
        JobId = request.GET.get('JobId')
        try:
            job = JobModel.objects.get(JobId=JobId)
            serializer = JobSerializer (instance=job)
            if COMPUTE_LOCALHOST:
                if serializer.data['JobStatus']==True:
                    request.img_list = []
                    find(JobId, request)
                    # for i in request.img_list:
                    #     print(i['file_name'])
                    path = JobsFolder+f'{JobId}/analysis/source46.txt'
                    source = open(path, 'rb').readlines()
                    newsource=[]
                    for line in source:
                        string=str(line,'utf-8')
                        newsource.append(string.strip())
                    d={}
                    d['data'] = []
                    d['columns'] = [{'title':'Node','dataIndex':'node'},{'title':'Path Name','dataIndex':'pathname'},{'title':'Path','dataIndex':'path'},{'title':'Probability','dataIndex':'probability'}]
                    i=0
                    print(newsource)
                    for line in newsource:
                        if line.startswith('target node'):
                            node = int(line.split(':')[1])
                        else:
                            line.split(':')[1].split('->') 
                            d['data'].append({'key':i,'node':node,'pathname':line.split(':')[0].strip(),'path':line.split(':')[1].strip(),'probability':float(line.split(':')[2])})
                            i+=1
                    print(d)
                    return Response({"JobId":serializer.data['JobId'],"JobStatus":serializer.data['JobStatus'],'file_data': request.img_list,'paths':d})
                return Response(serializer.data)
            else:
                path = JobsFolder+serializer.data['JobId']
                if os.path.exists(path)==True:
                    job.JobStatus=True
                    job.save()
                    #need proecess paths
                    #TODO by Yi HE
                    return Response({"JobId":serializer.data['JobId'],"JobStatus":serializer.data['JobStatus'],'file_data': request.img_list,'paths':d})
                return Response(serializer.data)
        except:
            return Response('NotExist')
def find(dir_name, request):
    path = JobsFolder+f'{dir_name}/analysis'
    dir_list = os.listdir(path)
    for i in dir_list:
        pro = open(path + '//' + i, 'rb')
        data = pro.read()
        request.img_list.append({'file_name': i, 'file_base64': base64.b64encode(data)})
        pro.close()


"""
                for line in newsource:
                    if line.startswith('target node'):
                        key = int(line.split(':')[1])
                        d[key]=[]
                        print(key)
                    else:
                        numbers_arr = [ int(x) for x in line.split(':')[1].split('->') ]
                        d[key].append({line.split(':')[0].strip():numbers_arr,'probability':float(line.split(':')[2])})
"""
#===========================view: get localhost compute path===========================
def Path_localhost(request):
    print(request.GET)
    dist_threshold=request.GET.get('Nodes[DistThreshold]')
    source_node=request.GET.get('Nodes[SourceNode]')
    target_node=request.GET.get('Nodes[TargetNode]')
    print(dist_threshold,source_node,target_node)
    #postanalysis_path.py
    
    #TODO
    return HttpResponse("ok")



#===========================view: get localhost compute visual===========================
def Visual_localhost(request):
    print(request.GET)
    threshold=request.GET.get('Domains[visualThreshold]')
    print(threshold)
    domainInput=request.GET.get('Domains[domains]')
    print(domainInput)
    # postanalysis_visual.py
    #TODO
    return HttpResponse("ok")




#===========================view: download example trajectory===========================
print(settings.STATIC_URL)
print(settings.BASE_DIR)
def download_et(request):
    path=settings.BASE_DIR+settings.STATIC_URL+'pdbs/ca_1.pdb'
    print(path)
    file = open(path, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="ca_1.pdb"'
    return response


#===========================view: download example protein structure file===========================