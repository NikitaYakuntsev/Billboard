from django.http import HttpResponse
from django.shortcuts import render
from BillboardTask import models

# Create your views here.
def main(request):
    #return HttpResponse("Hello world")
    cats = models.Category.objects.all()
    return render(request, 'index.html', cats)
