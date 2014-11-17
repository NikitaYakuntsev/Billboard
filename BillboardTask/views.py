from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, Http404
from django.http import HttpResponseRedirect
from django.shortcuts import render, redirect, render_to_response
from django.contrib.auth import authenticate, login
from django.contrib.auth import logout
import datetime
from BillboardTask.models import Category, Advert, Report, RegistrationForm, LoginForm, AddAdvertForm
from django.contrib.auth.models import User, UserManager

# Create your views here.
def main(request):
    cats = Category.objects.all()
    context = {"all_categories": cats,
               "auth": request.user.is_authenticated(),
               "username": request.user.username}
    return render(request, 'index.html', context)


def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')


def register(request):
    if request.method == 'POST':
        reg_form = RegistrationForm(request.POST)
        if reg_form.is_valid() and reg_form.is_bound:
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
        if form.is_valid() and form.is_bound:
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
        ads.append([Report.objects.filter(id_advert=adv.id).count(), tmp])
    context = {"advert_list": ads,
               "catname": cname,
               "auth": request.user.is_authenticated(),
               "username": request.user.username}
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
                  "phone" : adv.phone,
                  "image": adv.image,
                  "auth": request.user.is_authenticated(),
                  "username": request.user.username}
        return render(request, 'advert.html', advert)


def add_advert(request):
    if request.user.is_authenticated():
        if request.method == 'POST':
            form = AddAdvertForm(request.POST)
            if form.is_valid() and form.is_bound:
                title = form.cleaned_data["title"]
                text = form.cleaned_data["text"]
                price = form.cleaned_data["price"]
                date = datetime.date.today()
                address = form.cleaned_data["address"]
                phone = form.cleaned_data["phone"]
                cats = form.cleaned_data["categories"]
                image = form.cleaned_data["image"]
                advert = Advert(id_user=request.user,
                                title=title,
                                text=text,
                                price=price,
                                date=date,
                                address=address,
                                phone=phone,
                                image=image
                                )
                advert.save()
                for cat in cats:
                    advert.categories.add(cat.id)
                return HttpResponseRedirect('/')
        else:
            form = AddAdvertForm()
    else:
        return HttpResponseRedirect('/login/')
    return render(request, 'add.html', {'form': form,
                                        "auth": request.user.is_authenticated(),
                                        "username": request.user.username})


def abuse(request, cname, advid):
    #get will have no effect
    if request.method == "POST":
        rep = Report(text="", id_advert_id=advid)
        rep.save()
    return HttpResponseRedirect("/")