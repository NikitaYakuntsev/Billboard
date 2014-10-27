from django.http import HttpResponse, Http404
from django.shortcuts import render
from BillboardTask.models import Category, CategoryAndAdvert, Advert,RegistrationForm,User
# Create your views here.
def main(request):
    cats = Category.objects.all()
    context = {"all_categories" : cats}
    return render(request, 'index.html', context)

def register(request):
    if request.method == "POST":
        reg_form = RegistrationForm(request.POST)
        if reg_form.is_valid():
            user = reg_form.save()
            User = user
            User.save()
    else:
        reg_form = RegistrationForm()
    return render(request,'register.html', {'reg_form': reg_form})

def category_view(request, cname):
    #id of category with name = cname
    category = Category.objects.get(name__exact=cname)

    common = CategoryAndAdvert.objects.filter(id_category_id = category.id)
    ads = []
    for adv in common:
        tmp = Advert.objects.get(id = adv.id_advert_id)
        ads.append(tmp)
    context = {"advert_list": ads,
               "catname": cname}
    return render(request, 'category.html', context)

def advert_view(request, cname, advid):

    category = Category.objects.get(name__exact=cname)

    #protection if user tries to change addres with wrong id
    if not CategoryAndAdvert.objects.filter(id_category_id = category.id).filter(id_advert_id = advid).exists():
        raise Http404
    else:
        adv = Advert.objects.get(pk=advid)

        advert = {"name" : adv.title,
                  "price" : adv.price,
                  "text" : adv.text,
                  "date" : adv.date,
                  "catname" : cname}
        return render(request, 'advert.html', advert) #check if you can give an object