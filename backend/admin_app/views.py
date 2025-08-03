from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .serializers import LeadershipSerializer,FaqSerializer
from .models import adminLogin,AdminLeaderShipModel,AdminFaqModel
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



class AdminLeaderShipView(APIView):
    def get(self, request):
        leaders = AdminLeaderShipModel.objects.all()
        serializer = LeadershipSerializer(leaders, many=True)
        return Response(serializer.data)

    def put(self, request, pk=None):
        try:
            leaders = AdminLeaderShipModel.objects.get(pk=pk)
            serializer = LeadershipSerializer(leaders, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        except AdminLeaderShipModel.DoesNotExist:
            return Response(
                {"error": "FAQ not found"},
                status=status.HTTP_404_NOT_FOUND,
            )


class FaqView(APIView):
    def get(self, request):
        faqs = AdminFaqModel.objects.all()
        serializer = FaqSerializer(faqs, many=True)
        return Response(serializer.data)

    def put(self, request, pk=None):
        try:
            faq = AdminFaqModel.objects.get(pk=pk)
            serializer = FaqSerializer(faq, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        except AdminFaqModel.DoesNotExist:
            return Response(
                {"error": "FAQ not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
