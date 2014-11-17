from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect, render_to_response
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
from BillboardTask.models import Category, Advert, RegistrationForm, LoginForm
from django.contrib.auth.models import User, UserManager

# Create your views here.
def main(request):
    cats = Category.objects.all()
    context = {"all_categories": cats,
               "auth": request.user.is_authenticated()}
    return render(request, 'index.html', context)


def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')


def register(request):
    if request.method == 'POST':
        reg_form = RegistrationForm(request.POST)
        if reg_form.is_valid():
            log = reg_form.cleaned_data["username"]
            passw = request.POST.get("password1")
            e_mail = request.POST.get("email")
            User.objects.create_user(username=log, password=passw, email=e_mail)
            user = authenticate(username=log, password=passw)
            login(request, user)
            return HttpResponseRedirect('/')
    else:
        reg_form = RegistrationForm()
    return render(request, 'register.html', {'reg_form': reg_form})


def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            if form.get_user():
                login(request, form.get_user())
                return HttpResponseRedirect('/')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form})


def category_view(request, cname):
    try:
        category = Category.objects.get(name__exact=cname)
    except ObjectDoesNotExist:
        raise Http404

    common = Advert.objects.filter(categories__id=category.id)
    ads = []
    for adv in common:
        tmp = Advert.objects.get(id=adv.id)
        ads.append(tmp)
    context = {"advert_list": ads,
               "catname": cname,
               "auth": request.user.is_authenticated()}
    return render(request, 'category.html', context)


def advert_view(request, cname, advid):
    category = Category.objects.get(name=cname)

    # protection if user tries to change address with wrong id
    if not Advert.objects.filter(categories=category).filter(id=advid).exists():
        raise Http404
    else:
        adv = Advert.objects.get(pk=advid)

        advert = {"name": adv.title,
                  "price": adv.price,
                  "text": adv.text,
                  "date": adv.date,
                  "catname": cname,
                  "address": adv.address,
                  #"phone" : adv.phone,
                  "image": adv.image,
                  "auth": request.user.is_authenticated()}
        return render(request, 'advert.html', advert)