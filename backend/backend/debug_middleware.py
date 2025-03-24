# Add this file to your Django project
import json
import logging
from django.conf import settings

logger = logging.getLogger('django.request')

class RequestDebugMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Only log in debug mode
        if settings.DEBUG:
            # Log request details
            logger.info(f"Request: {request.method} {request.path}")
            logger.info(f"Content Type: {request.content_type}")
            
            # Log headers
            headers = {k: v for k, v in request.META.items() if k.startswith('HTTP_')}
            logger.info(f"Headers: {json.dumps(headers, indent=2)}")
            
            # Log body for non-GET requests
            if request.method != 'GET':
                if request.content_type == 'application/json':
                    try:
                        body = json.loads(request.body)
                        logger.info(f"Body: {json.dumps(body, indent=2)}")
                    except:
                        logger.info(f"Body: {request.body}")
                elif 'multipart/form-data' in request.content_type:
                    logger.info(f"POST data: {request.POST}")
                    logger.info(f"FILES: {request.FILES}")
                else:
                    logger.info(f"POST data: {request.POST}")
        
        response = self.get_response(request)
        
        # Log response status
        if settings.DEBUG:
            logger.info(f"Response status: {response.status_code}")
            
            # Try to log response content for error responses
            if response.status_code >= 400:
                try:
                    content = json.loads(response.content)
                    logger.info(f"Response content: {json.dumps(content, indent=2)}")
                except:
                    logger.info(f"Response content: {response.content}")
        
        return response

