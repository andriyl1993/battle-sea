# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.auth.models import User

class Sheep(models.Model):
	deck = models.IntegerField(default = 1, verbose_name = "Кількість палуб")
	sprite = models.CharField(max_length = 511, verbose_name = "Картинка")

direction = (
		('1', 'north'),
		('2', 'east'),
		('3', 'south'),
		('4', 'west'),
	)

class Position(models.Model):
	x = models.IntegerField(default = 1)
	y = models.IntegerField(default = 1)
	direction = models.IntegerField(choices = direction, default = 1)

class SheepPosition(models.Model):
	sheep = models.ForeignKey(Sheep, verbose_name="Корабель")
	place_head = models.ForeignKey(Position, verbose_name="Розміщення голови")

class ShepsForGame(models.Model):
	sheep1_1 = models.ForeignKey(SheepPosition, verbose_name="Однопалубник 1", related_name="sheep1_1")
	sheep1_2 = models.ForeignKey(SheepPosition, verbose_name="Однопалубник 2", related_name="sheep1_2")
	sheep1_3 = models.ForeignKey(SheepPosition, verbose_name="Однопалубник 3", related_name="sheep1_3")
	sheep1_4 = models.ForeignKey(SheepPosition, verbose_name="Однопалубник 4", related_name="sheep1_4")
	sheep2_1 = models.ForeignKey(SheepPosition, verbose_name="Двопалубник 1", related_name="sheep2_1")
	sheep2_2 = models.ForeignKey(SheepPosition, verbose_name="Двопалубник 2", related_name="sheep2_2")
	sheep2_3 = models.ForeignKey(SheepPosition, verbose_name="Двопалубник 3", related_name="sheep2_3")
	sheep3_1 = models.ForeignKey(SheepPosition, verbose_name="Трипалубник 1", related_name="sheep3_1")
	sheep3_2 = models.ForeignKey(SheepPosition, verbose_name="Трипалубник 2", related_name="sheep3_2")
	sheep4_1 = models.ForeignKey(SheepPosition, verbose_name="Чотирипалубник", related_name="sheep4_1")
	user = models.ForeignKey(User, verbose_name = "Користувач")

class Game(models.Model):
	data_for_game1 = models.ForeignKey(ShepsForGame, verbose_name="Дані для гри 1", related_name='data_for_game1')
	data_for_game2 = models.ForeignKey(ShepsForGame, verbose_name="Дані для гри 2", related_name='data_for_game2')
	date_start = models.DateTimeField(auto_now = True, verbose_name = "Час початку")
	date_end = models.DateTimeField(verbose_name = "Час кінця")
	win_user = models.ForeignKey(User, verbose_name = "Переможець")