from django.db import models


# Create your models here.
class User(models.Model):
    #id_user = models.IntegerField(primary_key=True)
    login = models.CharField(max_length=30)
    password = models.CharField(max_length=30)
    description = models.TextField(max_length=1000)


class Report(models.Model):
    #id_report = models.IntegerField(primary_key=True)
    text = models.TextField(max_length=300)
    id_advert = models.ForeignKey('Advert')


class Advert(models.Model):
    #id_advert = models.IntegerField(primary_key=True)
    id_user = models.ForeignKey(User)
    title = models.CharField(max_length=50)
    text = models.TextField(max_length=1000)
    price = models.IntegerField()
    date = models.DateField()
    categories = models.ManyToManyField('Category', through='CategoryAndAdvert')

class Category(models.Model):
    #id_category = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=30, unique=True)
    #adverts = models.ManyToManyField(Advert, through=CategoryAndAdvert)


class CategoryAndAdvert(models.Model):
    id_advert = models.ForeignKey(Advert)
    id_category = models.ForeignKey(Category)


