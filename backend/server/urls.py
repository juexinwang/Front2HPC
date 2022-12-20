from . import views
from rest_framework.routers import DefaultRouter
from django.conf.urls import url
urlpatterns=[
    url(r"^uploadtraj/$", views.TrajectoryFileAPIView.as_view()),
    url(r"^uploadstruc/$", views.StructureFileAPIView.as_view()),
    url(r"^submit/$", views.JobAPIView.as_view()),
    url(r'^submit/(?P<JobId>[0-9]{4}[A-Z]{4})/$',views.JobDetailAPIView.as_view()),
    url(r'^result/$', views.ResultAPIView.as_view()),
    url('download1/',views.download_exampletraj),
    url('download2/',views.download_examplestruc),
    url('download3/',views.download_python),
    url(r'^setvisual/$',views.VisualLocalhost.as_view()), 
    url(r'^setnode/$',views.Path_localhost),
    
    # url(r'^check/$',views.JobIdAPIView.as_view()),
    # url(r'^check/(?P<JobId>[0-9]{14}[A-Z]{4})/$',views.JobDetailAPIView.as_view()),
]
