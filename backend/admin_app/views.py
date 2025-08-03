from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import adminLogin
import json


@csrf_exempt
def admin_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")
        password = data.get("password")

        try:
            admin = adminLogin.objects.get(admin_email=email, admin_password=password)
            return JsonResponse(
                {
                    "status": "success",
                    "message": "Login successful",
                    "admin": {"email": admin.admin_email, "id": admin.id},
                }
            )
        except adminLogin.DoesNotExist:
            return JsonResponse(
                {"status": "error", "message": "Invalid credentials"}, status=401
            )
    return JsonResponse(
        {"status": "error", "message": "Method not allowed"},
        status=405,
    )

