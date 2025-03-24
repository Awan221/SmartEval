from django.contrib import admin
from .models import Submission, Answer

class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 0
    readonly_fields = ('question', 'text', 'score', 'feedback')

@admin.register(Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'submitted_at', 'status', 'total_score')
    list_filter = ('status', 'exam', 'student')
    search_fields = ('student__email', 'exam__title')
    readonly_fields = ('student', 'exam', 'file', 'submitted_at', 'status', 'total_score')
    inlines = [AnswerInline]
    date_hierarchy = 'submitted_at'

@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ('submission', 'question', 'score')
    list_filter = ('submission__exam', 'submission__student')
    search_fields = ('submission__student__email', 'submission__exam__title', 'question__text')
    readonly_fields = ('submission', 'question', 'text')