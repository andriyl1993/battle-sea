from django.shortcuts import render, redirect
from django.views.generic import TemplateView
from django.contrib.auth.models import User
from django.template import Library, Node, TemplateSyntaxError
from django.contrib.auth import logout, authenticate, login
from models import *
import datetime
from django.http import HttpResponse
import json

class IndexView(TemplateView):
	template_name = "menu.html"

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		return context


class NewGameView(TemplateView):
	template_name = "new_game.html"

	def get_context_data(self, **kwargs):
		context = super(NewGameView, self).get_context_data(**kwargs)
		
		context['array'] = range(10)
		return context

def registration(request):
	if request.method == "GET":
		return render(request, 'registration.html')
	else:
		user = User.objects.filter(email=request.POST.get('email'), username = request.POST.get('email'))
		if not user:		
			user = User.objects.create_user(email=request.POST.get('email'), username = request.POST.get('email'), password=request.POST.get('password'))
		else:
			user = user[0]
		user = authenticate(username=user.username, password=request.POST.get('password'))
		if user is not None:
			login(request, user)
		else:
			return render(request, 'registration.html')
		return redirect('/')

def logout_user(request):
	logout(request)
	return render(request, 'menu.html')

def login_user(request):
	user = authenticate(username=user.username, password=request.POST.get('password'))
	if user is not None:
		login(request, user)
	return redirect('/')

def start_game(request):
	fight = Fight()
	fight.date_start = datetime.datetime.now()
	str_json = json.loads(request.body)
	fight.is_computer = bool(str_json.get('is_computer'))
	fight.user = request.user
	if not fight.is_computer:
		user_opponent = User.objects.get(id = str_json.get('user'))
		fight.user_fight = user_opponent
	fight.save()
	return HttpResponse("ok")

def end_game(request):
	str_json = json.loads(request.body)
	fight = list(Fight.objects.filter(user = request.user))[-1]
	fight.date_end = datetime.datetime.now()
	fight.you_win = str_json.get('you_win')
	fight.save()
	return HttpResponse("ok")

def history(request):
	if request.user.is_authenticated():
		fights = Fight.objects.filter(user__id = request.user.id)
		return render(request, 'history.html', {'fights': fights})
	return redirect('/')
