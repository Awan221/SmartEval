from rest_framework import serializers
from django.contrib.auth import get_user_model
from exams.models import Exam, Question
from submissions.models import Submission, Answer

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'profile_picture', 'date_joined']
        read_only_fields = ['date_joined']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'role', 'password', 'profile_picture']
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'exam', 'text', 'points', 'order', 'model_answer']

class ExamListSerializer(serializers.ModelSerializer):
    professor_name = serializers.SerializerMethodField()
    question_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'format', 'professor', 'professor_name', 
                  'created_at', 'is_published', 'deadline', 'question_count']
    
    def get_professor_name(self, obj):
        return obj.professor.full_name
    
    def get_question_count(self, obj):
        return obj.questions.count()

class ExamDetailSerializer(serializers.ModelSerializer):
    professor_name = serializers.SerializerMethodField()
    questions = QuestionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'content', 'file', 'format', 
                  'professor', 'professor_name', 'created_at', 'updated_at', 
                  'is_published', 'deadline', 'questions']
    
    def get_professor_name(self, obj):
        return obj.professor.full_name

class AnswerSerializer(serializers.ModelSerializer):
    question_text = serializers.SerializerMethodField()
    
    class Meta:
        model = Answer
        fields = ['id', 'submission', 'question', 'question_text', 'text', 'score', 'feedback']
    
    def get_question_text(self, obj):
        return obj.question.text

class SubmissionListSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    exam_title = serializers.SerializerMethodField()
    
    class Meta:
        model = Submission
        fields = ['id', 'student', 'student_name', 'exam', 'exam_title', 'submitted_at', 'status', 'total_score']
    
    def get_student_name(self, obj):
        return obj.student.full_name
    
    def get_exam_title(self, obj):
        return obj.exam.title

class SubmissionDetailSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    exam_title = serializers.SerializerMethodField()
    answers = AnswerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Submission
        fields = ['id', 'student', 'student_name', 'exam', 'exam_title', 
                  'file', 'submitted_at', 'status', 'total_score', 'answers']
    
    def get_student_name(self, obj):
        return obj.student.full_name
    
    def get_exam_title(self, obj):
        return obj.exam.title

class SubmissionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'student', 'exam', 'file']
        read_only_fields = ['student']
    
    def create(self, validated_data):
        validated_data['student'] = self.context['request'].user
        return super().create(validated_data)

# Add this to your serializers.py file

class ExamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'format', 'content', 'file', 'deadline']
    
    def validate(self, data):
        """
        Validate that content is provided for text formats and file for PDF format.
        """
        format_type = data.get('format')
        content = data.get('content')
        file = data.get('file')
        
        # For text-based formats, content is required
        if format_type in ['text', 'markdown', 'latex']:
            if not content:
                raise serializers.ValidationError({"content": "Content is required for this format."})
        
        # For PDF format, file is required if not already present
        if format_type == 'pdf':
            instance = self.instance  # Get the instance if this is an update
            if not file and (not instance or not instance.file):
                raise serializers.ValidationError({"file": "File is required for PDF format."})
            
            # Clear content for PDF format
            data['content'] = ''
            
        return data

