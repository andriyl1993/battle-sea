from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.models import User
from django.template import Library, Node, TemplateSyntaxError

class IndexView(TemplateView):
	template_name = "menu.html"

	def get_context_data(self, **kwargs):
		context = super(IndexView, self).get_context_data(**kwargs)
		users = User.objects.all()

		context['user'] = users[0]
		return context


class NewGameView(TemplateView):
	template_name = "new_game.html"

	def get_context_data(self, **kwargs):
		context = super(NewGameView, self).get_context_data(**kwargs)
		
		context['array'] = range(10)
		return context

def example(request):
	return render(request, 'ex.html')