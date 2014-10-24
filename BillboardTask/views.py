from django.http import HttpResponse
from django.shortcuts import render
from BillboardTask.models import Category

# Create your views here.
def main(request):
    cats = Category.objects.all()
    context = {"all_categories" : cats}
    return render(request, 'index.html', context)


def category_view(request, cname):
    categories = Category.objects.filter(name = cname)
    context = {"category_list" : categories}
    return render(request, 'category.html', context)

