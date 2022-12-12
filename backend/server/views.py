#models
from .models import StructureFileModel,JobModel,TrajectoryFileModel
#serializers
from .serializers import TrajectoryFileModelSerializer,StructureFileModelSerializer,JobSerializer,JobIdSerializer
#viewsets-ModelViewSet
from rest_framework.viewsets import ModelViewSet
#response
from rest_framework.response import Response
#action
from rest_framework.decorators import action
from rest_framework.parsers import FileUploadParser,MultiPartParser, FormParser
import time,os
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
scheduler = BackgroundScheduler()
scheduler.add_jobstore(DjangoJobStore(), 'default')
register_events(scheduler)
scheduler.start()

def preditct(trajfilepath,email,jobid,epochs,batchsize,encoder,decoder,lr):
    print(type(epochs))
    jobfolder='ml/jobs/{}'.format(jobid)
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
    #job.SavePath=savepath
    job.save()
    mail.send_mail(
    subject='submit',
    message='your job has finished, job id is {}'.format(jobid),
    from_email='2938225901@qq.com',
    recipient_list=['{}'.format(email)]
    )

#view: upload trajectory file 
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
        filepath = settings.MEDIA_ROOT+"files/"+filename
        with open(filepath, 'wb+') as destination:
            for chunk in request.data['file'].chunks():
                destination.write(chunk)
        destination.close()
        dict_data={"TrajectoryFile":filepath}
        TrajectoryFileModel.objects.create(**dict_data)
        f = open(filepath,"r").readlines()
        nd=[]
        for line in f:
            if line.startswith("ATOM"):
                nd.append(int(line.split()[1]))
        ns=set(nd)
        amount_residues = max(ns)
        if amount_residues > 100:
            return Response({"length_valid":False,"amount_residues":amount_residues,'TrajFilePath':filepath})
        return Response({"length_valid":True,'TrajFilePath':filepath,"amount_residues":amount_residues,})

#view: upload protein structure file 
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
        filepath = settings.MEDIA_ROOT+"strucFiles/"+filename
        with open(filepath, 'wb+') as destination:
            for chunk in request.data['file'].chunks():
                destination.write(chunk)
        destination.close()
        dict_data={"StructureFile":filepath}
        StructureFileModel.objects.create(**dict_data)
        return Response({'StrucFilePath':filepath})

#view: upload job
class JobAPIView(APIView):
    def get(self,request):
        file = JobModel.objects.all()
        serializer = JobSerializer(instance=file,many=True)
        return Response(serializer.data)
    def post(self,request):
        data_dict = request.data
        serializer = JobSerializer(data=data_dict)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        print(serializer.data)
        scheduler.add_job(preditct,args=[serializer.data['TrajFilePath'],serializer.data['Email'],serializer.data['JobId']
                                        ,serializer.data['Epochs'],serializer.data['BatchSize'],serializer.data['Encoder'],serializer.data['Decoder']
                                        ,serializer.data['Lr'],
                                        ])
        print('ok')
        return Response(serializer.data)
           
#view: get result
import base64
class ResultAPIView(APIView):
    def get(self, request):
        print(request.GET)
        JobId = request.GET.get('JobId')
        try:
            job = JobModel.objects.get(JobId=JobId)
            serializer = JobSerializer (instance=job)
            if serializer.data['JobStatus']==True:
                request.img_list = []
                find(JobId, request)
                # for i in request.img_list:
                #     print(i['file_name'])
                path = path = settings.MEDIA_ROOT+f'/jobs/{JobId}/analysis/source46.txt'
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
        except:
            return Response('NotExist')
def find(dir_name, request):
    path = settings.MEDIA_ROOT+f'/jobs/{dir_name}/analysis'
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

# #delete
# class JobIdAPIView(APIView):
#     def get(self,request,JobId):
#         job = JobModel.objects.get(JobId=JobId)
#         serializer = JobSerializer (instance=job)
#         print(serializer.data)
#         if serializer.data['PredictStatu']==False:
#             return Response('Sorry, still runing')
#         return Response(serializer.data)
#     def post(self,request):
#         print(request.data)
# #delete
# class JobDetailAPIView(APIView):
#     def get(self,request,JobId): 
#         job = JobModel.objects.get(JobId=JobId)
#         serializer = JobSerializer (instance=job)
#         print(serializer.data)
#         if serializer.data['PredictStatu']==False:
#             return Response('Sorry, still runing')
#         return Response(serializer.data)
#     def put(self,request,pk): 
#         data_dict = request.data
#         book = JobModel.objects.get(pk=pk)
#         serializer = JobSerializer (instance=book,data=data_dict)
#         serializer.is_valid(raise_exception=True)
#         serializer.save()
#         return Response(serializer.data,status=status.HTTP_201_CREATED)
#     def delete(self,request,pk): #删除
#         book = JobModel.objects.get(pk=pk)
#         book.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

