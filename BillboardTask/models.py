from django.db import models
from django.forms import ModelForm
from django import forms

# Create your models here.
class User(models.Model):
    #id_user = models.IntegerField(primary_key=True)
    login = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    description = models.EmailField(max_length=1000)
    def __unicode__(self):
        return str(self.id) +". " + str(self.login)


class Report(models.Model):
    #id_report = models.IntegerField(primary_key=True)
    text = models.TextField(max_length=300)
    id_advert = models.ForeignKey('Advert')
    def __unicode__(self):
        return str(id)


class Advert(models.Model):
    #id_advert = models.IntegerField(primary_key=True)
    id_user = models.ForeignKey(User)
    title = models.CharField(max_length=50)
    text = models.TextField(max_length=1000)
    price = models.IntegerField()
    date = models.DateField()
    categories = models.ManyToManyField('Category', through='CategoryAndAdvert')
    def __unicode__(self):
        return str(self.id) + ". " + str(self.title)

class Category(models.Model):
    #id_category = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=30, unique=True)
    #adverts = models.ManyToManyField(Advert, through=CategoryAndAdvert)
    def __unicode__(self):
        return str(self.id) + ". " + str(self.name)


class CategoryAndAdvert(models.Model):
    id_advert = models.ForeignKey(Advert)
    id_category = models.ForeignKey(Category)
    def __unicode__(self):
        return str(self.id_advert_id) + " & " + str(self.id_category_id)


class RegistrationForm(ModelForm):
    class Meta:
        model = User
        fields = ["login","password","description"]
