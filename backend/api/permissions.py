from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'

class IsProfessorOrReadOnly(permissions.BasePermission):
    """
    Allows read access to all users, but only professors can write.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.role == 'professor'
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Check if the object has a professor attribute
        if hasattr(obj, 'professor'):
            return obj.professor == request.user
        
        # For Question objects, check the exam's professor
        if hasattr(obj, 'exam') and hasattr(obj.exam, 'professor'):
            return obj.exam.professor == request.user
        
        return False

class IsOwnerOrProfessor(permissions.BasePermission):
    """
    Allows access to the owner of the object or a professor.
    """
    def has_object_permission(self, request, view, obj):
        # For Submission objects
        if hasattr(obj, 'student'):
            if request.user.role == 'professor' and hasattr(obj, 'exam') and hasattr(obj.exam, 'professor'):
                return obj.exam.professor == request.user
            return obj.student == request.user
        
        # For Answer objects
        if hasattr(obj, 'submission') and hasattr(obj.submission, 'student'):
            if request.user.role == 'professor' and hasattr(obj.submission, 'exam') and hasattr(obj.submission.exam, 'professor'):
                return obj.submission.exam.professor == request.user
            return obj.submission.student == request.user
        
        return False

class IsStudent(permissions.BasePermission):
    """
    Allows access only to student users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.role == 'student'