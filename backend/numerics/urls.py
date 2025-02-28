from django.urls import path
from numerics.views import GetTotalsView

urlpatterns = [
    path("sum/total/numbers", GetTotalsView.as_view(), name="get_totals_view"),
]