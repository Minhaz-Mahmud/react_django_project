from django.urls import path
from numerics.views import GetTotalCountsWeb, GetTotalCountCompDash

urlpatterns = [
    path("sum/total/numbers", GetTotalCountsWeb.as_view(), name="get_totals_view"),
    path("sum/count/company/dashboard", GetTotalCountCompDash.as_view(), name="get_company_dash_count"),
]



    
