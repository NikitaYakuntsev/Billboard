from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from django.shortcuts import render, render_to_response
from django.template import RequestContext
from BillboardTask.models import Category, CategoryAndAdvert, Advert,RegistrationForm, User
# Create your views here.
def main(request):
    cats = Category.objects.all()
    context = {"all_categories" : cats}
    return render(request, 'index.html', context)

def register(request):
    reg_form = RegistrationForm()
    return  render(request, 'register.html', {'reg_form': reg_form})

def process_register(request):
    log = request.POST.get("login")
    passw = request.POST.get("password")
    email = request.POST.get("email")
    user = User(login = log, password = passw, description = email)
    user.save()
    return HttpResponse('Success ' + str(user))

def category_view(request, cname):
    #id of category with name = cname
    try:
        category = Category.objects.get(name__exact=cname)
    except ObjectDoesNotExist:
        raise Http404

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