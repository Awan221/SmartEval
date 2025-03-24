from django.contrib import admin
from .models import Exam, Question

class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('title', 'professor', 'format', 'is_published', 'created_at')
    list_filter = ('is_published', 'format', 'professor')
    search_fields = ('title', 'description', 'professor__email')
    inlines = [QuestionInline]
    date_hierarchy = 'created_at'

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('exam', 'order', 'points')
    list_filter = ('exam',)
    search_fields = ('text', 'exam__title')