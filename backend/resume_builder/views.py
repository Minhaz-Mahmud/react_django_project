from django.http import FileResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from reportlab.lib.units import inch
from rest_framework.views import APIView
from rest_framework.decorators import api_view
import json
import os
from datetime import datetime
from django.conf import settings
from .serializers import ResumeSerializer
from rest_framework.response import Response
from rest_framework import status
from .models import CandidateCV
import fitz  # PyMuPDF
from PIL import Image
import random
import string


# //////////////////////////////////////////cv1 template/////////////////////////////////////////////////////////////////////
SKILL_COLORS = [
    "#ecf0f1",  # Light gray background
]


def draw_section_header(canvas, text, y_position):
    """Helper function to draw section headers with consistent styling"""
    canvas.setFillColor(colors.HexColor("#2C3E50"))
    canvas.setFont("Helvetica-Bold", 14)
    canvas.drawString(inch, y_position, text)
    canvas.setFillColor(colors.HexColor("#34495E"))
    canvas.line(inch, y_position - 5, 7.5 * inch, y_position - 5)
    canvas.setFillColor(colors.black)
    canvas.setFont("Helvetica", 11)
    return y_position - 25


def draw_skill_badge(canvas, skill, x, y, color):
    """Draw a more elegant skill badge with a subtle background and refined style"""
    # Calculate text width for badge size
    canvas.setFont("Helvetica", 11)
    text_width = canvas.stringWidth(skill)
    badge_width = text_width + 20
    badge_height = 25

    # Draw badge background with subtle gradient-like effect (light gray)
    canvas.setFillColor(colors.HexColor("#ecf0f1"))  # Light gray background
    canvas.roundRect(x, y - 15, badge_width, badge_height, 10, fill=1)

    # Add a soft border around the badge for elegance
    canvas.setStrokeColor(colors.HexColor("#bdc3c7"))  # Light border color
    canvas.setLineWidth(0.5)
    canvas.roundRect(x, y - 15, badge_width, badge_height, 10, fill=0)

    # Draw skill text in a darker color for contrast
    canvas.setFillColor(colors.HexColor("#2c3e50"))  # Darker text color for contrast
    margin_top = 5
    canvas.drawString(x + 10, y - margin_top, skill)

    return badge_width + 10  # Return width for next badge positioning


@csrf_exempt
def generate_cv(request):
    if request.method == "POST":
        data = json.loads(request.body)
        candidate_id = data.get("candidate_id")
        candidate_name = data["name"]

        # Create PDF
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Set background color for header
        pdf.setFillColor(colors.HexColor("#34495E"))
        pdf.rect(0, height - 2 * inch, width, 2 * inch, fill=True)

        # Add header with name
        pdf.setFillColor(colors.white)
        pdf.setFont("Helvetica-Bold", 24)
        pdf.drawString(inch, height - 1.2 * inch, candidate_name.upper())

        # Add contact information in header
        pdf.setFont("Helvetica", 11)
        pdf.setFillColor(colors.white)
        contact_y = height - 1.5 * inch
        pdf.drawString(inch, contact_y, f"Email: {data['email']}")
        pdf.drawString(4 * inch, contact_y, f"Phone: {data['phone']}")
        pdf.drawString(inch, contact_y - 15, f"Address: {data['address']}")

        # Reset fill color for main content
        pdf.setFillColor(colors.black)
        current_y = height - 2.5 * inch

        # Personal Information Section
        current_y = draw_section_header(pdf, "PERSONAL INFORMATION", current_y)
        pdf.drawString(inch, current_y, f"Date of Birth: {data['dob']}")
        pdf.drawString(4 * inch, current_y, f"Gender: {data['gender'].capitalize()}")
        pdf.drawString(
            6 * inch, current_y, f"Religion: {data['religion'].capitalize()}"
        )
        current_y -= 30

        # Skills Section with elegant, minimalistic badges
        current_y = draw_section_header(pdf, "PROFESSIONAL SKILLS", current_y)
        x_position = inch
        row_height = 40
        for i, skill in enumerate(data["skillset"]):
            if skill:
                if x_position > 6 * inch:  # Start new row if reaching page width
                    x_position = inch
                    current_y -= row_height
                badge_width = draw_skill_badge(
                    pdf,
                    skill,
                    x_position,
                    current_y,
                    SKILL_COLORS[i % len(SKILL_COLORS)],
                )
                x_position += badge_width
        current_y -= row_height

        # Education Section
        current_y = draw_section_header(pdf, "EDUCATION", current_y)
        # University Education
        pdf.setFillColor(colors.HexColor("#2C3E50"))
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(inch + 15, current_y, "University Education")
        pdf.setFillColor(colors.black)
        pdf.setFont("Helvetica", 11)
        current_y -= 20

        # University details with degree
        uni_education = data["education"]["varsity"]
        pdf.drawString(inch + 30, current_y, f"Institution: {uni_education['name']}")
        current_y -= 20
        pdf.drawString(inch + 30, current_y, f"Degree: {uni_education['degree']}")
        current_y -= 20
        pdf.drawString(
            inch + 30, current_y, f"Passing Year: {uni_education['passingYear']}"
        )
        current_y -= 20
        pdf.drawString(inch + 30, current_y, f"Grade/GPA: {uni_education['cga']}")
        current_y -= 30

        # High School Education
        pdf.setFillColor(colors.HexColor("#2C3E50"))
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(inch + 15, current_y, "High School Education")
        pdf.setFillColor(colors.black)
        pdf.setFont("Helvetica", 11)
        current_y -= 20

        # High School details with degree/certificate
        hs_education = data["education"]["highSchool"]
        pdf.drawString(inch + 30, current_y, f"Institution: {hs_education['name']}")
        current_y -= 20
        pdf.drawString(inch + 30, current_y, f"Certificate: {hs_education['degree']}")
        current_y -= 20
        pdf.drawString(inch + 30, current_y, f"Passing Year: {hs_education['year']}")
        current_y -= 20
        pdf.drawString(inch + 30, current_y, f"Grade: {hs_education['grade']}")
        current_y -= 30

        # Experience Section
        current_y = draw_section_header(pdf, "PROFESSIONAL EXPERIENCE", current_y)
        experience_lines = data["experience"].split("\n")
        for line in experience_lines:
            if line.strip():
                wrapped_lines = [line[i : i + 80] for i in range(0, len(line), 80)]
                for wrapped_line in wrapped_lines:
                    pdf.drawString(inch + 15, current_y, wrapped_line)
                    current_y -= 20

        # Add footer
        pdf.setFillColor(colors.HexColor("#34495E"))
        pdf.rect(0, 0, width, 0.5 * inch, fill=True)
        pdf.setFillColor(colors.white)
        pdf.setFont("Helvetica", 8)
        generation_date = datetime.now().strftime("%B %d, %Y")
        pdf.drawString(inch, 0.3 * inch, f"Generated on {generation_date}")
        pdf.drawRightString(
            width - inch, 0.25 * inch, f"{candidate_name.title()} | Page 1"
        )

        pdf.save()
        buffer.seek(0)

        # set names
        def generate_random_string(length=12):
            return "".join(
                random.choices(string.ascii_letters + string.digits, k=length)
            )

        random_cv_name = generate_random_string()

        # Save the PDF
        file_name = f"{random_cv_name.replace(' ', '_')}_resume.pdf"
        file_path = os.path.join(settings.MEDIA_ROOT, "gen_cv", file_name)

        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(buffer.getvalue())

        # Generate a thumbnail using PyMuPDF
        # Open the PDF file using PyMuPDF
        pdf_document = fitz.open(file_path)
        # Get the first page of the PDF
        first_page = pdf_document.load_page(0)
        # Render the page to a Pixmap (an image object)
        pixmap = first_page.get_pixmap()
        # Convert the Pixmap to a PIL image
        img = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
        # Save the image as a thumbnail
        thumbnail_name = f"{random_cv_name.replace(' ', '_')}_thumbnail.jpg"
        thumbnail_path = os.path.join(settings.MEDIA_ROOT, "thumbnails", thumbnail_name)
        os.makedirs(os.path.dirname(thumbnail_path), exist_ok=True)
        img.save(thumbnail_path)

        # Create database record
        CandidateCV.objects.create(
            candidate_id=candidate_id,
            email=data["email"],
            cv_file=f"gen_cv/{file_name}",
            thumbnail=f"thumbnails/{thumbnail_name}",
        )

        return JsonResponse(
            {
                "message": "CV generated successfully",
                "cv_url": f"/media/gen_cv/{file_name}",
                "thumbnail_url": f"/media/thumbnails/{thumbnail_name}",
            }
        )

    return JsonResponse({"error": "Invalid request"}, status=400)


# ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class GetResumes(APIView):
    def get(self, request):
        candidate_id = request.query_params.get("candidate_id")
        if not candidate_id:
            return Response(
                {"error": "Candidate ID is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Ensure the candidate exists in the database
        try:
            # CandidateCV associated with the candidate_id
            resumes = CandidateCV.objects.filter(candidate_id=candidate_id)
            if not resumes.exists():
                return Response(
                    {"error": "No resumes found for this candidate."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            # Serialize the resumes
            serializer = ResumeSerializer(resumes, many=True)
            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


def view_cv(request, file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, "gen_cv", file_name)
    if os.path.exists(file_path):
        return FileResponse(open(file_path, "rb"), content_type="application/pdf")
    else:
        raise Http404("CV not found")


@api_view(["DELETE"])
def delete_resume(request, resume_id):
    try:
        resume = CandidateCV.objects.get(id=resume_id)
        resume.delete()  # This will delete the resume record
        return Response(
            {"message": "Resume deleted successfully"}, status=status.HTTP_200_OK
        )
    except CandidateCV.DoesNotExist:
        return Response({"error": "Resume not found"}, status=status.HTTP_404_NOT_FOUND)


# ////////////////////////////////////////////cv2 template///////////////////////////////////////////////////////////////////


COLORS = {
    "primary": "#FF7043",  # Light Orange
    "secondary": "#FF5722",  # Darker Orange
    "accent": "#FFB74D",  # Soft Orange
    "text": "#212121",  # Almost Black
    "light_text": "#424242",  # Dark Gray
    "muted": "#FBE9E7",  # Very Light Orange
    "white": "#ffffff",
    "dark_black": "#010203",
}


def draw_section_header2(canvas, text, y_position):
    """Draw modern section headers with new styling"""
    # Draw decorative element
    canvas.setFillColor(colors.HexColor(COLORS["accent"]))
    canvas.rect(inch - 10, y_position - 8, 5, 25, fill=1)

    # Draw header text
    canvas.setFillColor(colors.HexColor(COLORS["text"]))
    canvas.setFont("Helvetica-Bold", 16)
    canvas.drawString(inch, y_position, text)

    # Reset styles
    canvas.setFillColor(colors.HexColor(COLORS["text"]))
    canvas.setFont("Helvetica", 11)
    return y_position - 30


def draw_skill_badge2(canvas, skill, x, y):
    """Draw minimalist skill badges with new design"""
    canvas.setFont("Helvetica", 10)
    text_width = canvas.stringWidth(skill)
    badge_width = text_width + 30
    badge_height = 30

    # Draw skill box with orange accent
    canvas.setFillColor(colors.HexColor(COLORS["muted"]))
    canvas.rect(x, y - 18, badge_width, badge_height, fill=1)

    # Draw orange accent line
    canvas.setFillColor(colors.HexColor(COLORS["primary"]))
    canvas.rect(x, y - 18, 3, badge_height, fill=1)

    # Draw skill text
    canvas.setFillColor(colors.HexColor(COLORS["text"]))
    canvas.drawString(x + 15, y - 4, skill)

    return badge_width + 20


@csrf_exempt
def generate_cv2(request):
    if request.method == "POST":
        data = json.loads(request.body)
        candidate_id = data.get("candidate_id")
        candidate_name = data["name"]

        # Create PDF
        buffer = BytesIO()
        pdf = canvas.Canvas(buffer, pagesize=letter)
        width, height = letter

        # Minimal header design with orange accent
        pdf.setFillColor(colors.HexColor(COLORS["white"]))
        pdf.rect(0, height - 2 * inch, width, 2 * inch, fill=True)

        # Add orange accent bar
        pdf.setFillColor(colors.HexColor(COLORS["primary"]))
        pdf.rect(0, height - 2 * inch, width, 0.15 * inch, fill=True)

        # Name and title section
        pdf.setFillColor(colors.HexColor(COLORS["text"]))
        pdf.setFont("Helvetica-Bold", 32)
        name_y = height - 1.2 * inch
        pdf.drawString(inch, name_y, candidate_name.upper())

        # Professional title with orange color
        pdf.setFont("Helvetica-Bold", 16)
        pdf.setFillColor(colors.HexColor(COLORS["primary"]))
        pdf.drawString(inch, name_y - 30, data["title"])

        # Contact information in a single line with custom spacing
        pdf.setFont("Helvetica", 11)
        pdf.setFillColor(colors.HexColor(COLORS["light_text"]))
        contact_y = name_y - 75
        email_text = f"📧 {data['email']}"
        phone_text = f"📱 {data['phone']}"
        address_text = f"📍 {data['address']}"

        # Calculate positions for centered alignment
        total_width = pdf.stringWidth(
            email_text + "    " + phone_text + "    " + address_text
        )
        start_x = (width - total_width) / 2

        pdf.drawString(start_x, contact_y, email_text)
        pdf.drawString(
            start_x + pdf.stringWidth(email_text + "    "), contact_y, phone_text
        )
        pdf.drawString(
            start_x + pdf.stringWidth(email_text + "    " + phone_text + "    "),
            contact_y,
            address_text,
        )

        current_y = height - 2.7 * inch

        # Personal Information Section
        current_y = draw_section_header2(pdf, "PERSONAL DETAILS", current_y)
        pdf.setFont("Helvetica", 11)
        pdf.drawString(inch + 15, current_y, f"Date of Birth: {data['dob']}")
        pdf.drawString(4 * inch, current_y, f"Gender: {data['gender'].capitalize()}")
        pdf.drawString(
            6 * inch, current_y, f"Religion: {data['religion'].capitalize()}"
        )
        current_y -= 35

        # Skills Section - New grid layout
        current_y = draw_section_header2(pdf, "CORE COMPETENCIES", current_y)
        x_position = inch + 15
        row_height = 40

        # Organize skills in a more structured grid
        skills_per_row = 3
        for i, skill in enumerate(data["skillset"]):
            if skill:
                if i > 0 and i % skills_per_row == 0:
                    x_position = inch + 15
                    current_y -= row_height
                x_position += draw_skill_badge2(pdf, skill, x_position, current_y)
        current_y -= row_height + 10

        # Education Section - Condensed layout
        current_y = draw_section_header2(pdf, "EDUCATION", current_y)

        # University Education
        uni_education = data["education"]["varsity"]
        pdf.setFillColor(colors.HexColor(COLORS["primary"]))
        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(inch + 15, current_y, uni_education["name"])
        current_y -= 20

        pdf.setFillColor(colors.HexColor(COLORS["text"]))
        pdf.setFont("Helvetica", 11)
        pdf.drawString(
            inch + 15,
            current_y,
            f"{uni_education['degree']} ({uni_education['passingYear']}) - GPA: {uni_education['cga']}",
        )
        current_y -= 30

        # High School Education
        hs_education = data["education"]["highSchool"]
        pdf.setFillColor(colors.HexColor(COLORS["primary"]))
        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(inch + 15, current_y, hs_education["name"])
        current_y -= 20

        pdf.setFillColor(colors.HexColor(COLORS["text"]))
        pdf.setFont("Helvetica", 11)
        pdf.drawString(
            inch + 15,
            current_y,
            f"{hs_education['degree']} ({hs_education['year']}) - Grade: {hs_education['grade']}",
        )
        current_y -= 30

        # Experience Section
        current_y = draw_section_header2(pdf, "PROFESSIONAL EXPERIENCE", current_y)
        pdf.setFont("Helvetica", 11)
        experience_lines = data["experience"].split("\n")

        for line in experience_lines:
            if line.strip():
                # Orange bullet point
                pdf.setFillColor(colors.HexColor(COLORS["primary"]))
                pdf.circle(inch + 8, current_y + 3, 2, fill=1)

                # Experience text
                pdf.setFillColor(colors.HexColor(COLORS["text"]))
                wrapped_lines = [line[i : i + 80] for i in range(0, len(line), 80)]
                for wrapped_line in wrapped_lines:
                    pdf.drawString(inch + 20, current_y, wrapped_line)
                    current_y -= 20
        current_y -= 15

        # Minimalist footer
        pdf.setFillColor(colors.HexColor(COLORS["primary"]))
        pdf.rect(0, 0, width, 0.5 * inch, fill=True)
        pdf.setFillColor(colors.HexColor(COLORS["dark_black"]))
        pdf.setFont("Helvetica", 9)
        generation_date = datetime.now().strftime("%B %d, %Y")
        pdf.drawString(inch, 0.2 * inch, f"Generated on {generation_date}")
        pdf.drawRightString(
            width - inch, 0.2 * inch, f"{candidate_name.title()} | Page 1"
        )

        pdf.save()
        buffer.seek(0)

        # set names

        def generate_random_string(length=12):
            return "".join(
                random.choices(string.ascii_letters + string.digits, k=length)
            )

        random_cv_name = generate_random_string()

        # Save files and create records (unchanged)
        file_name = f"{random_cv_name.replace(' ', '_')}_resume.pdf"
        file_path = os.path.join(settings.MEDIA_ROOT, "gen_cv", file_name)

        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, "wb") as f:
            f.write(buffer.getvalue())

        # Generate thumbnail
        pdf_document = fitz.open(file_path)
        first_page = pdf_document.load_page(0)
        pixmap = first_page.get_pixmap()
        img = Image.frombytes("RGB", [pixmap.width, pixmap.height], pixmap.samples)
        thumbnail_name = f"{random_cv_name.replace(' ', '_')}_thumbnail.jpg"
        thumbnail_path = os.path.join(settings.MEDIA_ROOT, "thumbnails", thumbnail_name)
        os.makedirs(os.path.dirname(thumbnail_path), exist_ok=True)
        img.save(thumbnail_path)

        CandidateCV.objects.create(
            candidate_id=candidate_id,
            email=data["email"],
            cv_file=f"gen_cv/{file_name}",
            thumbnail=f"thumbnails/{thumbnail_name}",
        )

        return JsonResponse(
            {
                "message": "CV generated successfully",
                "cv_url": f"/media/gen_cv/{file_name}",
                "thumbnail_url": f"/media/thumbnails/{thumbnail_name}",
            }
        )

    return JsonResponse({"error": "Invalid request"}, status=400)


# //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
