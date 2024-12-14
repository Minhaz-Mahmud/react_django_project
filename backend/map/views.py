from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from company_registration.serializers import CompanySerializer
from company_registration.models import Company
from django.http import JsonResponse


class GetLatLangMap(APIView):
    def get(self, request):
        company_email = request.query_params.get("company_email")

        if not company_email:
            return Response(
                {"error": "Company email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            company = Company.objects.get(email=company_email)
        except Company.DoesNotExist:
            return Response(
                {"error": "Invalid company email provided."},
                status=status.HTTP_404_NOT_FOUND,
            )

        data = {
            "latitude": company.latitude,
            "longitude": company.longitude,
        }
        return Response(
            data,
            status=status.HTTP_200_OK,
        )


class UpdateLatLangMap(APIView):
    def put(self, request):
        company_email = request.data.get("company_email")
        latitude = request.data.get("latitude")
        longitude = request.data.get("longitude")

        if not company_email:
            return Response(
                {"error": "Company email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            company = Company.objects.get(email=company_email)
        except Company.DoesNotExist:
            return Response(
                {"error": "Invalid company email provided."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if latitude is not None:
            company.latitude = latitude
        if longitude is not None:
            company.longitude = longitude

        company.save()
        return Response(
            {"message": "Location updated successfully."},
            status=status.HTTP_200_OK,
        )


def get_company_location(request, company_id):
    try:
        company = Company.objects.get(id=company_id)
        location_data = {
            "latitude": company.latitude,
            "longitude": company.longitude,
        }
        return JsonResponse(location_data)
    except Company.DoesNotExist:
        return JsonResponse(
            {"error": "Company not found"},
            status=404,
        )
