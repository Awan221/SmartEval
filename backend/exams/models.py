from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User

class Exam(models.Model):
    TEXT = 'text'
    MARKDOWN = 'markdown'
    LATEX = 'latex'
    PDF = 'pdf'
    
    FORMAT_CHOICES = [
        (TEXT, _('Text')),
        (MARKDOWN, _('Markdown')),
        (LATEX, _('LaTeX')),
        (PDF, _('PDF')),
    ]
    
    title = models.CharField(_('title'), max_length=255)
    description = models.TextField(_('description'), blank=True)
    content = models.TextField(_('content'), blank=True)
    file = models.FileField(_('file'), upload_to='exams/', blank=True, null=True)
    format = models.CharField(_('format'), max_length=10, choices=FORMAT_CHOICES, default=TEXT)
    professor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_exams')
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    is_published = models.BooleanField(_('is published'), default=False)
    deadline = models.DateTimeField(_('deadline'), blank=True, null=True)
    
    class Meta:
        verbose_name = _('exam')
        verbose_name_plural = _('exams')
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title

class Question(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField(_('question text'))
    points = models.PositiveIntegerField(_('points'), default=1)
    order = models.PositiveIntegerField(_('order'), default=0)
    model_answer = models.TextField(_('model answer'), blank=True)
    
    class Meta:
        verbose_name = _('question')
        verbose_name_plural = _('questions')
        ordering = ['order']
    
    def __str__(self):
        return f"{self.exam.title} - Question {self.order}"