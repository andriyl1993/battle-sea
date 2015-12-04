# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_start', models.DateTimeField(auto_now=True, verbose_name=b'\xd0\xa7\xd0\xb0\xd1\x81 \xd0\xbf\xd0\xbe\xd1\x87\xd0\xb0\xd1\x82\xd0\xba\xd1\x83')),
                ('date_end', models.DateTimeField(verbose_name=b'\xd0\xa7\xd0\xb0\xd1\x81 \xd0\xba\xd1\x96\xd0\xbd\xd1\x86\xd1\x8f')),
            ],
        ),
        migrations.CreateModel(
            name='Position',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('x', models.IntegerField(default=1)),
                ('y', models.IntegerField(default=1)),
                ('direction', models.IntegerField(default=1, choices=[(b'1', b'north'), (b'2', b'east'), (b'3', b'south'), (b'4', b'west')])),
            ],
        ),
        migrations.CreateModel(
            name='Sheep',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('deck', models.IntegerField(default=1, verbose_name=b'\xd0\x9a\xd1\x96\xd0\xbb\xd1\x8c\xd0\xba\xd1\x96\xd1\x81\xd1\x82\xd1\x8c \xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1')),
                ('sprite', models.CharField(max_length=511, verbose_name=b'\xd0\x9a\xd0\xb0\xd1\x80\xd1\x82\xd0\xb8\xd0\xbd\xd0\xba\xd0\xb0')),
            ],
        ),
        migrations.CreateModel(
            name='SheepPosition',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('place_head', models.ForeignKey(verbose_name=b'\xd0\xa0\xd0\xbe\xd0\xb7\xd0\xbc\xd1\x96\xd1\x89\xd0\xb5\xd0\xbd\xd0\xbd\xd1\x8f \xd0\xb3\xd0\xbe\xd0\xbb\xd0\xbe\xd0\xb2\xd0\xb8', to='main.Position')),
                ('sheep', models.ForeignKey(verbose_name=b'\xd0\x9a\xd0\xbe\xd1\x80\xd0\xb0\xd0\xb1\xd0\xb5\xd0\xbb\xd1\x8c', to='main.Sheep')),
            ],
        ),
        migrations.CreateModel(
            name='ShepsForGame',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('sheep1_1', models.ForeignKey(related_name='sheep1_1', verbose_name=b'\xd0\x9e\xd0\xb4\xd0\xbd\xd0\xbe\xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1\xd0\xbd\xd0\xb8\xd0\xba 1', to='main.SheepPosition')),
                ('sheep1_2', models.ForeignKey(related_name='sheep1_2', verbose_name=b'\xd0\x9e\xd0\xb4\xd0\xbd\xd0\xbe\xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1\xd0\xbd\xd0\xb8\xd0\xba 2', to='main.SheepPosition')),
                ('sheep1_3', models.ForeignKey(related_name='sheep1_3', verbose_name=b'\xd0\x9e\xd0\xb4\xd0\xbd\xd0\xbe\xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1\xd0\xbd\xd0\xb8\xd0\xba 3', to='main.SheepPosition')),
                ('sheep1_4', models.ForeignKey(related_name='sheep1_4', verbose_name=b'\xd0\x9e\xd0\xb4\xd0\xbd\xd0\xbe\xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1\xd0\xbd\xd0\xb8\xd0\xba 4', to='main.SheepPosition')),
                ('sheep2_1', models.ForeignKey(related_name='sheep2_1', verbose_name=b'\xd0\x94\xd0\xb2\xd0\xbe\xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1\xd0\xbd\xd0\xb8\xd0\xba 1', to='main.SheepPosition')),
                ('sheep2_2', models.ForeignKey(related_name='sheep2_2', verbose_name=b'\xd0\x94\xd0\xb2\xd0\xbe\xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1\xd0\xbd\xd0\xb8\xd0\xba 2', to='main.SheepPosition')),
                ('sheep2_3', models.ForeignKey(related_name='sheep2_3', verbose_name=b'\xd0\x94\xd0\xb2\xd0\xbe\xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1\xd0\xbd\xd0\xb8\xd0\xba 3', to='main.SheepPosition')),
                ('sheep3_1', models.ForeignKey(related_name='sheep3_1', verbose_name=b'\xd0\xa2\xd1\x80\xd0\xb8\xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1\xd0\xbd\xd0\xb8\xd0\xba 1', to='main.SheepPosition')),
                ('sheep3_2', models.ForeignKey(related_name='sheep3_2', verbose_name=b'\xd0\xa2\xd1\x80\xd0\xb8\xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1\xd0\xbd\xd0\xb8\xd0\xba 2', to='main.SheepPosition')),
                ('sheep4_1', models.ForeignKey(related_name='sheep4_1', verbose_name=b'\xd0\xa7\xd0\xbe\xd1\x82\xd0\xb8\xd1\x80\xd0\xb8\xd0\xbf\xd0\xb0\xd0\xbb\xd1\x83\xd0\xb1\xd0\xbd\xd0\xb8\xd0\xba', to='main.SheepPosition')),
                ('user', models.ForeignKey(verbose_name=b'\xd0\x9a\xd0\xbe\xd1\x80\xd0\xb8\xd1\x81\xd1\x82\xd1\x83\xd0\xb2\xd0\xb0\xd1\x87', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='game',
            name='data_for_game1',
            field=models.ForeignKey(related_name='data_for_game1', verbose_name=b'\xd0\x94\xd0\xb0\xd0\xbd\xd1\x96 \xd0\xb4\xd0\xbb\xd1\x8f \xd0\xb3\xd1\x80\xd0\xb8 1', to='main.ShepsForGame'),
        ),
        migrations.AddField(
            model_name='game',
            name='data_for_game2',
            field=models.ForeignKey(related_name='data_for_game2', verbose_name=b'\xd0\x94\xd0\xb0\xd0\xbd\xd1\x96 \xd0\xb4\xd0\xbb\xd1\x8f \xd0\xb3\xd1\x80\xd0\xb8 2', to='main.ShepsForGame'),
        ),
        migrations.AddField(
            model_name='game',
            name='win_user',
            field=models.ForeignKey(verbose_name=b'\xd0\x9f\xd0\xb5\xd1\x80\xd0\xb5\xd0\xbc\xd0\xbe\xd0\xb6\xd0\xb5\xd1\x86\xd1\x8c', to=settings.AUTH_USER_MODEL),
        ),
    ]
