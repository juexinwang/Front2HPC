from . import views
from rest_framework.routers import DefaultRouter
from django.conf.urls import url
urlpatterns=[
    url(r"^uploadtraj/$", views.TrajectoryFileAPIView.as_view()),
    url(r"^uploadstruc/$", views.StructureFileAPIView.as_view()),
    url(r"^submit/$", views.JobAPIView.as_view()),
    url(r'^result/$', views.ResultAPIView.as_view()),
    # url(r'^check/$',views.JobIdAPIView.as_view()),
    # url(r'^check/(?P<JobId>[0-9]{14}[A-Z]{4})/$',views.JobDetailAPIView.as_view()),
]
