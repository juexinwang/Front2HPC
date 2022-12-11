from rest_framework.views import exception_handler
from rest_framework.response import Response
def notexist_exception_handler(exc,context):
    return Response('not exist')
