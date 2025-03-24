from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import User
from exams.models import Exam, Question

class Submission(models.Model):
    PENDING = 'pending'
    EVALUATING = 'evaluating'
    COMPLETED = 'completed'
    FAILED = 'failed'
    
    STATUS_CHOICES = [
        (PENDING, _('Pending')),
        (EVALUATING, _('Evaluating')),
        (COMPLETED, _('Completed')),
        (FAILED, _('Failed')),
    ]
    
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='submissions')
    file = models.FileField(_('file'), upload_to='submissions/')
    submitted_at = models.DateTimeField(_('submitted at'), auto_now_add=True)
    status = models.CharField(_('status'), max_length=10, choices=STATUS_CHOICES, default=PENDING)
    total_score = models.DecimalField(_('total score'), max_digits=5, decimal_places=2, null=True, blank=True)
    
    class Meta:
        verbose_name = _('submission')
        verbose_name_plural = _('submissions')
        ordering = ['-submitted_at']
        unique_together = ['student', 'exam']
    
    def __str__(self):
        return f"{self.student.email} - {self.exam.title}"

class Answer(models.Model):
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.TextField(_('answer text'))
    score = models.DecimalField(_('score'), max_digits=5, decimal_places=2, null=True, blank=True)
    feedback = models.TextField(_('feedback'), blank=True)
    
    class Meta:
        verbose_name = _('answer')
        verbose_name_plural = _('answers')
        unique_together = ['submission', 'question']
    
    def __str__(self):
        return f"Answer to {self.question}"