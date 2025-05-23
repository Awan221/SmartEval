# Generated by Django 4.2.7 on 2025-03-15 23:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('exams', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(verbose_name='answer text')),
                ('score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True, verbose_name='score')),
                ('feedback', models.TextField(blank=True, verbose_name='feedback')),
            ],
            options={
                'verbose_name': 'answer',
                'verbose_name_plural': 'answers',
            },
        ),
        migrations.CreateModel(
            name='Submission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='submissions/', verbose_name='file')),
                ('submitted_at', models.DateTimeField(auto_now_add=True, verbose_name='submitted at')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('evaluating', 'Evaluating'), ('completed', 'Completed'), ('failed', 'Failed')], default='pending', max_length=10, verbose_name='status')),
                ('total_score', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True, verbose_name='total score')),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='submissions', to='exams.exam')),
            ],
            options={
                'verbose_name': 'submission',
                'verbose_name_plural': 'submissions',
                'ordering': ['-submitted_at'],
            },
        ),
    ]
