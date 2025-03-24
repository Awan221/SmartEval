from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, 
    ExamViewSet, 
    QuestionViewSet, 
    SubmissionViewSet, 
    AnswerViewSet,
    AuthViewSet
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'exams', ExamViewSet, basename='exam')
router.register(r'questions', QuestionViewSet)
router.register(r'submissions', SubmissionViewSet, basename='submission')
router.register(r'answers', AnswerViewSet)
router.register(r'auth', AuthViewSet, basename='auth')

urlpatterns = [
    path('', include(router.urls)),
]