from django.http import HttpResponse
from django.shortcuts import render
from BillboardTask.models import Category

# Create your views here.
def main(request):
    cats = Category.objects.all()
    context = {"all_categories" : cats}
    return render(request, 'index.html', context)


def category_view(request, cname):
    category_list = Category.objects.filter(name = cname)
    return render(request, 'category.html', category_list)

