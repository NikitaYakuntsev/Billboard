from django.db import models
from django.forms import ModelForm
from django import forms
from django.contrib.auth.models import User

# Create your models here.



class Report(models.Model):
    text = models.TextField(max_length=300)
    id_advert = models.ForeignKey('Advert')
    def __unicode__(self):
        return str(id)


class Advert(models.Model):
    id_user = models.ForeignKey(User)
    title = models.CharField(max_length=50)
    text = models.TextField(max_length=1000)
    price = models.IntegerField()
    date = models.DateField()
    categories = models.ManyToManyField('Category')#, through='CategoryAndAdvert')
    def __unicode__(self):
        return str(self.id) + ". " + str(self.title)

class Category(models.Model):
    name = models.CharField(max_length=30, unique=True)
    def __unicode__(self):
        return str(self.id) + ". " + str(self.name)



class RegistrationForm(ModelForm):
    class Meta:
        model = User
        fields = ["username", "password", "email"]
    def clean(self):
        super(ModelForm, self).clean()
        mail = self.cleaned_data.get("email")
        if mail is None or mail == "":
            raise forms.ValidationError("Email is empty!")
        return self.cleaned_data


class LoginForm(forms.Form):
    username = forms.CharField(max_length=30)
    password = forms.CharField(max_length=30)