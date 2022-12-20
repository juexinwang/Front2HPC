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
from django.http import HttpResponse,JsonResponse
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
from ml.algorithm.postanalysis_pathW import AnalysisPathInResult
from ml.algorithm.postanalysis_visualW import AnalysisVisualInResult
from ml.hpc.BackJobsRunner import BackJobsRunner

from django.core import mail
from apscheduler.schedulers.background import BackgroundScheduler
from django_apscheduler.jobstores import DjangoJobStore, register_events, register_job
import os

#auto configration 
# StorageFolder= "/home/hy/Desktop/websever/store/v1/backend/ml/"
StorageFolder= "/media/volume/sdb/jobs/"
JobsFolder = StorageFolder+"jobs/"
TrajFileFolder= StorageFolder+"files/"
StrucFileFolder= "/home/exouser/NRIproject/Front2HPC/pv/pdbs/"
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
            bj = BackJobsRunner(jobid = jobid, filename = filename, params = params)
            print('Submit:')
            bj.submit()
            print('Submit finished.')
        return Response(serializer.data)
class JobDetailAPIView(APIView):
    def get(self,request,JobId):
        job = JobModel.objects.get(JobId=JobId)
        serializer = JobSerializer(instance=job)
        return Response(serializer.data,status=status.HTTP_200_OK)
    def put(self,request,JobId):
        data_dict = request.data
        job = JobModel.objects.get(JobId=JobId)
        serializer = JobSerializer(instance=job,data=data_dict)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data,status=status.HTTP_201_CREATED)
    def delete(self,request,JobId): 
        job = JobModel.objects.get(JobId=JobId)
        job.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)           
#===========================view: check and get result===========================
import base64
class ResultAPIView(APIView):
    def get(self, request):
        print(request.GET)
        JobId = request.GET.get('JobId')
        try:
            job = JobModel.objects.get(JobId=JobId)
            serializer = JobSerializer (instance=job)
            print(serializer.data)
            if COMPUTE_LOCALHOST:
                if serializer.data['JobStatus']==True:
                    #visual local
                    imgpaths_list = []
                    result_folder = JobsFolder+JobId+'/analysis/'
                    print(os.path.exists(result_folder+"edges_domain.png"))
                    if os.path.exists(result_folder+"edges_domain.png"):
                        imgpaths_list.append(result_folder+"edges_domain.png")
                    imgpaths_list.append(result_folder+"probs.png")
                    imgs_dict=find(imgpaths_list)
                    #path local
                    path = JobsFolder+f'{JobId}/analysis/source46.txt'
                    source = open(path, 'rb').readlines()
                    newsource=[]
                    for line in source:
                        string=str(line,'utf-8')
                        newsource.append(string.strip())
                    paths = []
                    i=0
                    print(newsource)
                    for line in newsource:
                        if line.startswith('target node'):
                            node = int(line.split(':')[1])
                        else:
                            line.split(':')[1].split('->') 
                            paths.append({'key':i,'pathname':line.split(':')[0].strip(),'path':line.split(':')[1].strip(),'probability':float(line.split(':')[2])})
                            i+=1
                    return Response({"JobId":serializer.data['JobId'],"JobStatus":serializer.data['JobStatus'],'file_data': imgs_dict,'paths':paths,'strucFilePath':serializer.data['StrucFilePath']})
                return Response(serializer.data)
            else:
                jobfolder = JobsFolder+serializer.data['JobId']
                if os.path.exists(jobfolder)==True:
                    job.JobStatus=True
                    job.save()
                    #visual HPC
                    result_folder = JobsFolder+JobId+'/analysis/'
                    imgpaths_list = []
                    imgpaths_list.append(result_folder+"probs.png")
                    if os.path.exists(result_folder+"edges_domain.png"):
                        imgpaths_list.append(result_folder+"edges_domain.png")
                    imgs_dict=find(imgpaths_list)
                    #path HPC
                    path = JobsFolder+f'{JobId}/analysis/paths.txt'
                    source = open(path, 'rb').readlines()
                    newsource=[]
                    for line in source:
                        string=str(line,'utf-8')
                        newsource.append(string.strip())
                    paths = []
                    i=0
                    for line in newsource:
                        if line.startswith('target node'):
                            node = int(line.split(':')[1])
                        else:
                            line.split(':')[1].split('->') 
                            paths.append({'key':i,'pathname':line.split(':')[0].strip(),'path':line.split(':')[1].strip(),'probability':float(line.split(':')[2])})
                            i+=1
                    return Response({"JobId":serializer.data['JobId'],"JobStatus":serializer.data['JobStatus'],'file_data': imgs_dict,'paths':paths})
                return Response(serializer.data)
        except:
            return Response('NotExist')

def find(imgpaths_list):
    imgs_dict={}
    print(imgpaths_list)
    for i in imgpaths_list:
        print(i)
        pro = open(i, 'rb')
        head,tail =os.path.split(i)

        data = pro.read()
        imgs_dict[tail.split('.')[0]]=base64.b64encode(data)
        pro.close()
    return imgs_dict


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
    jobid=request.GET.get('Nodes[JobId]')
    job=JobModel.objects.get(JobId=jobid)
    PDBfilename=job.TrajFilePath
    dist_threshold=int(request.GET.get('Nodes[DistThreshold]'))
    source_node=int(request.GET.get('Nodes[SourceNode]'))
    target_node=int(request.GET.get('Nodes[TargetNode]'))

    print(dist_threshold,source_node,target_node)
    #postanalysis_path.py
    analysispath = AnalysisPathInResult(
                                        dist_threshold=dist_threshold,
                                        filename=JobsFolder+jobid+"/logs/out_probs_train.npy",
                                        source_node=source_node,
                                        target_node=target_node,
                                        PDBfilename=PDBfilename,
                                        outputDir=JobsFolder+jobid+"/analysis/",
                                        )
    strings = analysispath.caculate()
    paths = []
    i=0
    print(paths)
    for line in strings:
        line.split(':')[1].split('->') 
        paths.append({'key':i,'pathname':line.split(':')[0].strip(),'path':line.split(':')[1].strip(),'probability':float(line.split(':')[2])})
        i+=1
    print(paths)
    return JsonResponse({"paths":paths})



#===========================view: get localhost compute visual===========================
class VisualLocalhost(APIView):
    def get(self, request):
        print(request.GET)
        jobid=request.GET.get('Domains[JobId]')
        job=JobModel.objects.get(JobId=jobid)
        threshold=float(request.GET.get('Domains[visualThreshold]'))
        domainInput=request.GET.get('Domains[domains]')
        print(domainInput)
        # postanalysis_visual.py
        num_residues=job.NumResidues
        fileDir=JobsFolder+jobid+"/logs/"
        outputDir=JobsFolder+jobid+"/analysis/"
        analysisvisual = AnalysisVisualInResult(
                                                num_residues=num_residues,
                                                threshold=threshold,
                                                fileDir=fileDir,
                                                outputDir=outputDir,
                                                domainInput=domainInput
                                                )
        imgpaths = analysisvisual.compute()
        imgs_dict=find(imgpaths)
        return Response({'file_data': imgs_dict})


#===========================view: download example trajectory===========================
print(settings.STATIC_URL)
print(settings.BASE_DIR)
def download_exampletraj(request):
    path=settings.BASE_DIR+settings.STATIC_URL+'pdbs/ca_1.pdb'
    print(path)
    file = open(path, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="ca_1.pdb"'
    return response


#===========================view: download example protein structure file===========================
print(settings.STATIC_URL)
print(settings.BASE_DIR)
def download_examplestruc(request):
    path=settings.BASE_DIR+settings.STATIC_URL+'pdbs/sod1.pdb'
    print(path)
    file = open(path, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="ca_1.pdb"'
    return response

#===========================view: download python script===========================
print(settings.STATIC_URL)
print(settings.BASE_DIR)
def download_python(request):
    path=settings.BASE_DIR+settings.STATIC_URL+'scripts/traj2CApdb.rar'
    print(path)
    file = open(path, 'rb')
    response = FileResponse(file)
    response['Content-Type'] = 'application/octet-stream'
    response['Content-Disposition'] = 'attachment;filename="traj2CApdb.rar"'
    return response
