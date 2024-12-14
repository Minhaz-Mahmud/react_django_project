from django.urls import path
from .views import GetLatLangMap, UpdateLatLangMap, get_company_location

urlpatterns = [
    path("get-lat-lang/", GetLatLangMap.as_view(), name="get-lat-lang"),
    path("update-lat-lang/", UpdateLatLangMap.as_view(), name="update_lat_lang"),
    path(
        "<int:company_id>/",
        get_company_location,
        name=" company_latlang_id ",
    ),
]
