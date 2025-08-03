from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from company_registration.models import Company
from company_registration.serializers import CompanySerializer


class CompanyListView(APIView):
    def get(self, request):
        companies = Company.objects.all()
        serializer = CompanySerializer(companies, many=True)
        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class CompanyDetailView(APIView):
    def get(self, request, company_id):
        try:
            company = Company.objects.get(id=company_id)
            serializer = CompanySerializer(company)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Company.DoesNotExist:
            return Response(
                {"error": "Company not found."},
                status=status.HTTP_404_NOT_FOUND,
            )



class AdminDeleteCompany(APIView):
    def delete(self, request, company_id):
        try:
            company = Company.objects.get(id=company_id)
            company.delete()
            return Response(
                {"message": "Company deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except Company.DoesNotExist:
            return Response(
                {"error": "Company not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
    