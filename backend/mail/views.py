from django.core.mail import send_mail, BadHeaderError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from registration.models import Candidate
from company_registration.models import Company
from job_post.models import JobPost
from .models import Application_Mail
from django.http import JsonResponse
import json
from django.core.mail import send_mail
from company_registration.models import Company


class SendEmailView(APIView):
    def post(self, request):
        candidate_email = request.data.get("candidateEmail")
        job_post_id = request.data.get("jobId")
        candidate_id = request.data.get("candidateId")
        company_id = request.data.get("companyId")
        message = request.data.get("message")
        subject = "Message from Career Connect"

        print("candidat email is", candidate_email)
        print("job post id is", job_post_id)
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


class ApplicationMailView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            name = data.get("name")
            email = data.get("email")
            subject = data.get("subject")
            message = data.get("message")

            if not all([name, email, subject, message]):
                return Response(
                    {
                        "status": "error",
                        "message": "All fields are required",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Send email
            send_mail(
                subject=f"New Contact Form Submission: {subject}",
                message=f"Name: {name}\nEmail: {email}\nSubject: {subject}\nMessage: {message}",
                from_email=email,
                recipient_list=["ahmedsafa0759@gmail.com"],
                fail_silently=False,
            )

            return Response(
                {
                    "status": "success",
                    "message": "Email sent successfully!",
                },
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {
                    "status": "error",
                    "message": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

class BasicEmailView(APIView):
    def post(self, request):
        receiver = request.data.get("receiver")
        
        if not receiver:
            return Response({"error": "Recipient email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            return self._send_candidate_email_with_link(receiver)
        except Candidate.DoesNotExist:
            return Response({"error": "Candidate with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _send_candidate_email_with_link(self, receiver):
        """Helper function to fetch candidate, generate link, and send email."""
        candidate = Candidate.objects.get(email=receiver)
        candidate_id = candidate.id

        # Generate the link using the candidate ID for the React frontend
        link = f"http://localhost:5173/cp/{candidate_id}"
        subject = "Your Account Recovery  Link"
        message = f"Hello! Click here for  your account recovery: {link}"

        send_mail(
            subject,
            message,
            None,  # Django will use EMAIL_HOST_USER from settings
            [receiver],
            fail_silently=False,
        )
        return Response({"success": "Email sent successfully with candidate link!"}, status=status.HTTP_200_OK)
    

class BasicEmailViewCompany(APIView):
    def post(self, request):
        receiver = request.data.get("receiver")
        
        if not receiver:
            return Response({"error": "Recipient email is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            return self._send_company_email_with_link(receiver)
        except Company.DoesNotExist:
            return Response({"error": "Company with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Failed to send email: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def _send_company_email_with_link(self, receiver):
        """Helper function to fetch candidate, generate link, and send email."""
        company = Company.objects.get(email=receiver)
        company_id = company.id

        # Generate the link using the candidate ID for the React frontend
        link = f"http://localhost:5173/cp-company/{company_id}"
        subject = "Your Account Recovery  Link"
        message = f"Hello! Click here for  your account recovery: {link}"

        send_mail(
            subject,
            message,
            None,  # Django will use EMAIL_HOST_USER from settings
            [receiver],
            fail_silently=False,
        )
        return Response({"success": "Email sent successfully with candidate link!"}, status=status.HTTP_200_OK)
    

