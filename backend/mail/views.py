# from django.core.mail import send_mail, BadHeaderError
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status


# class SendEmailView(APIView):
#     def post(self, request):
#         email = request.data.get("candidateEmail")
#         subject = "Message from Career Connect"
#         message = request.data.get("message")

#         if not email:
#             return Response(
#                 {"error": "Email address is required."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         if not message.strip():
#             return Response(
#                 {"error": "Message content cannot be empty."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         try:
#             send_mail(
#                 subject,
#                 message,
#                 "ahmedsafa0759@gmail.com",
#                 [email],
#                 fail_silently=False,
#             )
#             return Response(
#                 {"success": "Email sent successfully!"},
#                 status=status.HTTP_200_OK,
#             )
#         except BadHeaderError:
#             return Response(
#                 {"error": "Invalid header found in the email."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         except Exception as e:
#             return Response(
#                 {"error": f"Failed to send email: {str(e)}"},
#                 status=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             )

from django.core.mail import send_mail, BadHeaderError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from registration.models import Candidate
from company_registration.models import Company
from job_post.models import JobPost
from .models import Application_Mail


class SendEmailView(APIView):
    def post(self, request):
        candidate_email = request.data.get("candidateEmail")
        job_post_id = request.data.get("jobId")
        candidate_id = request.data.get("candidateId")
        company_id = request.data.get("companyId")
        message = request.data.get("message")
        subject = "Message from Career Connect"

        print("candidat email is", candidate_email)
        print("job id is", job_post_id)
        print("candidate id is", candidate_id)
        print("company id is", company_id)

        if not candidate_email:
            return Response(
                {"error": "Candidate email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not message.strip():
            return Response(
                {"error": "Message content cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not job_post_id or not candidate_id or not company_id:
            return Response(
                {"error": "Job post, candidate, and company IDs are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            job_post = JobPost.objects.get(id=job_post_id)
            candidate = Candidate.objects.get(id=candidate_id)
            company = Company.objects.get(id=company_id)
        except (
            JobPost.DoesNotExist,
            Candidate.DoesNotExist,
            Company.DoesNotExist,
        ) as e:
            return Response(
                {"error": f"Invalid ID provided: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            send_mail(
                subject,
                message,
                "ahmedsafa0759@gmail.com",
                [candidate_email],
                fail_silently=False,
            )

            # Save application mail data
            application_mail = Application_Mail(
                job_post=job_post,
                candidate=candidate,
                company=company,
                applicant_email=candidate_email,
                mailed=True,
            )
            application_mail.save()

            return Response(
                {"success": "Email sent and application data saved successfully!"},
                status=status.HTTP_200_OK,
            )
        except BadHeaderError:
            return Response(
                {"error": "Invalid header found in the email."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to send email: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
