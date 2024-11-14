# # from django.core.exceptions import ValidationError
# # from django.utils.translation import gettext_lazy as _
# # from company_registration.models import Company
# # from registration.models import Candidate


# # def unique_email_validator(value):
# #     if (
# #         Candidate.objects.filter(email=value).exists()
# #         or Company.objects.filter(email=value).exists()
# #     ):
# #         raise ValidationError(
# #             _("This email is already registered in our system."),
# #             params={"value": value},
# #         )


# from django.core.exceptions import ValidationError
# from django.utils.translation import gettext_lazy as _


# def unique_phone_number_validator(value):
#     # Importing models inside the function to avoid circular imports
#     from company_registration.models import Company
#     from registration.models import Candidate

#     if (
#         Candidate.objects.filter(phone_number=value).exists()
#         or Company.objects.filter(phone_number=value).exists()
#     ):
#         raise ValidationError(
#             _("This phone number is already registered in our system."),
#             params={"value": value},
#         )
