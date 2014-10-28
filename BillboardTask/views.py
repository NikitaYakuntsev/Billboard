from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from django.shortcuts import render
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from BillboardTask.models import Category, CategoryAndAdvert, Advert,RegistrationForm, User


# Create your views here.
def main(request):
    cats = Category.objects.all()
    context = {"all_categories" : cats}
    return render(request, 'index.html', context)

def login_view(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponse('Success ' + str(user))
        else:
            return HttpResponse('Disabled account ' + str(user))
    else:
        return HttpResponse('Invaild login ')

def logout_view(request):
    logout(request)

def register(request):
    reg_form = RegistrationForm()
    if request.method=='POST':
        reg_form = RegistrationForm(request.POST)
        if reg_form.is_valid():
            log = request.POST.get("login")
            passw = request.POST.get("password")
            e_mail = request.POST.get("email")
            user = User(login=log, password=passw, email=e_mail)
            if User.objects.filter(login=log).count() == 0:
                user.save()
                return HttpResponse('Success ' + str(user))
            else:
                return HttpResponse('Nickname already used ' + str(user))
    return render(request, 'register.html', {'reg_form': reg_form})

def category_view(request, cname):
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
        return render(request, 'advert.html', advert)