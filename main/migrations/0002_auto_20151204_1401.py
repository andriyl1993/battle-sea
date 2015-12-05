# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Fight',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date_start', models.DateTimeField(default=datetime.datetime(2015, 12, 4, 14, 1, 43, 382249), verbose_name=b'\xd0\x94\xd0\xb0\xd1\x82\xd0\xb0 \xd0\xbd\xd0\xb0\xd1\x87\xd0\xb0\xd0\xbb\xd0\xb0')),
                ('date_end', models.DateTimeField(default=datetime.datetime(2015, 12, 4, 14, 1, 43, 382303), null=True, verbose_name=b'\xd0\x94\xd0\xb0\xd1\x82\xd0\xb0 \xd0\xba\xd1\x96\xd0\xbd\xd1\x86\xd1\x8f', blank=True)),
                ('is_computer', models.BooleanField(default=True, verbose_name=b'\xd0\x9f\xd1\x80\xd0\xbe\xd1\x82\xd0\xb8 \xd0\xba\xd0\xbe\xd0\xbc\xd0\xbf\xe2\x80\x99\xd1\x8e\xd1\x82\xd0\xb5\xd1\x80\xd0\xb0?')),
                ('you_win', models.BooleanField(default=False, verbose_name=b'\xd0\xa5\xd1\x82\xd0\xbe \xd0\xb2\xd0\xb8\xd0\xb3\xd1\x80\xd0\xb0\xd0\xb2')),
                ('user_fight', models.ForeignKey(verbose_name=b'\xd0\xa1\xd1\x83\xd0\xbf\xd0\xb5\xd1\x80\xd0\xbd\xd0\xb8\xd0\xba', blank=True, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'verbose_name': '\u0411\u0438\u0442\u0432\u0430',
                'verbose_name_plural': '\u0411\u0438\u0442\u0432\u0438',
            },
        ),
        migrations.RemoveField(
            model_name='game',
            name='data_for_game1',
        ),
        migrations.RemoveField(
            model_name='game',
            name='data_for_game2',
        ),
        migrations.RemoveField(
            model_name='game',
            name='win_user',
        ),
        migrations.RemoveField(
            model_name='sheepposition',
            name='place_head',
        ),
        migrations.RemoveField(
            model_name='sheepposition',
            name='sheep',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='sheep1_1',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='sheep1_2',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='sheep1_3',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='sheep1_4',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='sheep2_1',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='sheep2_2',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='sheep2_3',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='sheep3_1',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='sheep3_2',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='sheep4_1',
        ),
        migrations.RemoveField(
            model_name='shepsforgame',
            name='user',
        ),
        migrations.DeleteModel(
            name='Game',
        ),
        migrations.DeleteModel(
            name='Position',
        ),
        migrations.DeleteModel(
            name='Sheep',
        ),
        migrations.DeleteModel(
            name='SheepPosition',
        ),
        migrations.DeleteModel(
            name='ShepsForGame',
        ),
    ]
