from django.contrib.auth import authenticate
from django import forms
from django.contrib.auth.models import User
from BillboardTask.models import Category

__author__ = 'nikitayakuntsev'


class RegistrationForm(forms.Form):
    username = forms.CharField(max_length=30)
    password1 = forms.CharField(widget=forms.PasswordInput, label="Password")
    password2 = forms.CharField(widget=forms.PasswordInput, label="Confirm")
    email = forms.EmailField(max_length=50)

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if User.objects.filter(username__exact=username).exists():
            raise forms.ValidationError("User already exists")
        return self.cleaned_data.get('username')

    def clean(self):

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
    text = forms.CharField(max_length=1000, min_length=30, widget=forms.Textarea)
    price = forms.IntegerField()
    #date = forms.DateField(widget=SelectDateWidget)
    address = forms.CharField(max_length=300)
    phone = forms.CharField(max_length=11)
    categories = forms.ModelMultipleChoiceField(queryset=Category.objects.all())
    image = forms.CharField()
