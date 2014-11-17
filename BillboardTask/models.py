from django.contrib.admin import widgets
from django.contrib.auth import authenticate
from django.db import models
from django.forms import ModelForm
from django import forms
from django.contrib.auth.models import User
from django.forms.extras.widgets import SelectDateWidget

# Create your models here.



class Report(models.Model):
    text = models.TextField(max_length=300)
    id_advert = models.ForeignKey('Advert')
    def __unicode__(self):
        return str(self.id_advert)


class Advert(models.Model):
    id_user = models.ForeignKey(User)
    title = models.CharField(max_length=50)
    text = models.TextField(max_length=1000)
    price = models.IntegerField()
    date = models.DateField()
    address = models.TextField(max_length=300)
    phone = models.CharField(max_length=11)
    categories = models.ManyToManyField('Category')
    image = models.TextField(max_length=300)
    def __unicode__(self):
        return '%s. %s' % (self.id, self.title)

class Category(models.Model):
    name = models.CharField(max_length=30, unique=True)
    image = models.TextField(max_length=300)
    def __unicode__(self):
        return str(self.id) + ". " + str(self.name)



class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=30)
    password1 = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(widget=forms.PasswordInput)
    email = forms.EmailField(max_length=50)

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username__exact=username).exists():
            raise forms.ValidationError("User already exists")
        return self.cleaned_data.get('username')

    def clean(self):
        #self.cleaned_data = super(RegistrationForm, self).clean()

        if not self.errors:
            pass1 = str(self.cleaned_data['password1'])
            pass2 = str(self.cleaned_data['password2'])
            if pass1 != pass2:
                raise forms.ValidationError("Passwords are not equal")
        return self.cleaned_data


class LoginForm(forms.Form):
    username = forms.CharField(max_length=30)
    password = forms.CharField(max_length=30, widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super(LoginForm, self).clean()
        if not self.errors:
            user = authenticate(username=cleaned_data['username'], password=cleaned_data['password'])
            if user is None:
                raise forms.ValidationError('Login or password incorrect')
            self.user = user
        return cleaned_data

    def get_user(self):
        return self.user or None


class AddAdvertForm(forms.Form):
    title = forms.CharField(max_length=50)
    text = forms.CharField(max_length=1000, min_length=30)
    price = forms.IntegerField()
    #date = forms.DateField(widget=SelectDateWidget)
    address = forms.CharField(max_length=300)
    phone = forms.CharField(max_length=11)
    categories = forms.ModelMultipleChoiceField(queryset=Category.objects.all())
    image = forms.CharField()
