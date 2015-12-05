# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import User
import datetime

class Fight(models.Model):
	date_start = models.DateTimeField(default = datetime.datetime.now(), verbose_name = "Дата начала")
	date_end = models.DateTimeField(verbose_name = "Дата кінця", null=True, blank=True)
	is_computer = models.BooleanField(default=True, verbose_name="Проти комп’ютера?")
	user = models.ForeignKey(User, verbose_name="Гравець", related_name="user", null=True, blank=True)
	you_win = models.BooleanField(default=False, verbose_name="Хто виграв")
	user_fight = models.ForeignKey(User, null=True, blank=True, verbose_name="Суперник", related_name="user_fight")

	class Meta:
		verbose_name = 'Битва'
		verbose_name_plural = 'Битви'

	def __unicode__(self):
		return str(self.date_start)
