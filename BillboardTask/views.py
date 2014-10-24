from django.http import HttpResponse
from django.shortcuts import render
from BillboardTask.models import Category, CategoryAndAdvert, Advert

# Create your views here.
def main(request):
    cats = Category.objects.all()
    context = {"all_categories" : cats}
    return render(request, 'index.html', context)


def category_view(request, cname):
    #id of category with name = cname
    category = Category.objects.get(name__exact=cname)

    adverts = Category.objects.all().filter(CategoryAndAdvert.id_category__exact == category.id)

    context = {"advert_list" : adverts}
    return render(request, 'category.html', context)

def advert_view(request, advid):
    adv = Advert.objects.get(pk=advid)

    return render(request, 'advert.html', adv) #check if you can give an object

