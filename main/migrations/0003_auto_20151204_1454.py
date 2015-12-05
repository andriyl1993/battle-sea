# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import datetime


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0002_auto_20151204_1401'),
    ]

    operations = [
        migrations.AddField(
            model_name='fight',
            name='user',
            field=models.ForeignKey(related_name='user', verbose_name=b'\xd0\x93\xd1\x80\xd0\xb0\xd0\xb2\xd0\xb5\xd1\x86\xd1\x8c', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
        migrations.AlterField(
            model_name='fight',
            name='date_end',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 4, 14, 54, 55, 689926), null=True, verbose_name=b'\xd0\x94\xd0\xb0\xd1\x82\xd0\xb0 \xd0\xba\xd1\x96\xd0\xbd\xd1\x86\xd1\x8f', blank=True),
        ),
        migrations.AlterField(
            model_name='fight',
            name='date_start',
            field=models.DateTimeField(default=datetime.datetime(2015, 12, 4, 14, 54, 55, 689876), verbose_name=b'\xd0\x94\xd0\xb0\xd1\x82\xd0\xb0 \xd0\xbd\xd0\xb0\xd1\x87\xd0\xb0\xd0\xbb\xd0\xb0'),
        ),
        migrations.AlterField(
            model_name='fight',
            name='user_fight',
            field=models.ForeignKey(related_name='user_fight', verbose_name=b'\xd0\xa1\xd1\x83\xd0\xbf\xd0\xb5\xd1\x80\xd0\xbd\xd0\xb8\xd0\xba', blank=True, to=settings.AUTH_USER_MODEL, null=True),
        ),
    ]
