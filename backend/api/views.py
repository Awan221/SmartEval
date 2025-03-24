from rest_framework import viewsets, permissions, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from exams.models import Exam, Question
from submissions.models import Submission, Answer
from evaluations.tasks import evaluate_submission
from .serializers import (
    UserSerializer, 
    UserCreateSerializer,
    ExamListSerializer, 
    ExamDetailSerializer, 
    QuestionSerializer, 
    SubmissionListSerializer, 
    SubmissionDetailSerializer,
    SubmissionCreateSerializer,
    AnswerSerializer,
    ExamCreateSerializer,
    serializers
)
from .permissions import (
    IsAdminUser, 
    IsProfessorOrReadOnly, 
    IsOwnerOrProfessor,
    IsStudent
)

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'], permission_classes=[permissions.IsAuthenticated])
    def update_profile(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AuthViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = get_object_or_404(User, email=email)
        if not user.check_password(password):
            return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class ExamViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsProfessorOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_professor:
            return Exam.objects.filter(professor=user)
        else:
            return Exam.objects.filter(is_published=True)
    
    def get_serializer_class(self):
        if self.action == 'create':  # ✅ Vérifie si c'est une création
            return ExamCreateSerializer
        elif self.action == 'retrieve':
            return ExamDetailSerializer
        return ExamListSerializer
    
    # Update your ExamViewSet in views.py

    def perform_create(self, serializer):
        print("Données reçues :", self.request.data)
        print("Files reçus :", self.request.FILES)
    
    # Check if format is PDF and file is provided
        format_type = self.request.data.get('format')
        if format_type == 'pdf' and not self.request.FILES.get('file'):
            print("Error: PDF format selected but no file provided")
            raise serializers.ValidationError({"file": "File is required for PDF format."})
    
    # Save the exam with the current user as professor
        serializer.save(professor=self.request.user)


    
    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        exam = self.get_object()
        exam.is_published = True
        exam.save()
        return Response({'status': 'exam published'})
    
    @action(detail=True, methods=['post'])
    def unpublish(self, request, pk=None):
        exam = self.get_object()
        exam.is_published = False
        exam.save()
        return Response({'status': 'exam unpublished'})

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated, IsProfessorOrReadOnly]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_professor:
            return Question.objects.filter(exam__professor=user)
        else:
            return Question.objects.filter(exam__is_published=True)

class SubmissionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrProfessor]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_professor:
            return Submission.objects.filter(exam__professor=user)
        else:
            return Submission.objects.filter(student=user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return SubmissionCreateSerializer
        elif self.action == 'retrieve':
            return SubmissionDetailSerializer
        return SubmissionListSerializer
    
    def perform_create(self, serializer):
        submission = serializer.save()
        # Trigger evaluation task
        evaluate_submission.delay(submission.id)
    
    @action(detail=True, methods=['post'])
    def evaluate(self, request, pk=None):
        submission = self.get_object()
        evaluate_submission.delay(submission.id)
        return Response({'status': 'evaluation started'})

class AnswerViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrProfessor]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_professor:
            return Answer.objects.filter(submission__exam__professor=user)
        else:
            return Answer.objects.filter(submission__student=user)