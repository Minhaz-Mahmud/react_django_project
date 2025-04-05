# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# import google.generativeai as genai
# import json
# import re

# # Configure Gemini AI (Ensure API Key is set)
# genai.configure(api_key="AIzaSyAG6nA3tCRem-qDahg2hEX7_vwoROsaTU0")

# @api_view(['POST'])
# def find_jobs(request):
#     try:
#         print("✅ Received raw data:", request.data)

#         if not isinstance(request.data, dict):  
#             return Response({"error": "Invalid data format. Expected a JSON object."}, status=400)

#         data = request.data
#         skills = data.get('skills', '')
#         degree = data.get('degree', '')
#         experience = data.get('experience', '')
#         job_type = data.get('jobType', '')
#         location = data.get('location', '')

#         if not all([skills, degree, experience, job_type, location]):
#             return Response({"error": "Missing required fields"}, status=400)

#         # Structured prompt for Gemini AI
#         prompt = f"""
#         Based on the following user details, generate a JSON response that includes:
#         1. Jobs they are eligible for (List of job titles and skills)
#         2. Future job opportunities they can aim for (List of future job titles)
#         3. Skills they should learn for future opportunities (List of skills)

#         User Details:
#         - Skills: {skills}
#         - Degree: {degree}
#         - Experience Level: {experience}
#         - Preferred Job Type: {job_type}
        

#         Ensure the response is **ONLY** in valid JSON format. No extra text.
#         The JSON should be structured as follows:
#         {{
#             "jobs": [
#                 {{
#                     "job_title": "Software Engineer",
#                     "required_skills": ["Python", "Django", "REST API"]
#                 }}
#             ],
#             "future_opportunities": [
#                 "Machine Learning Engineer",
#                 "Data Scientist",
#                 "AI Researcher"
#             ],
#             "skills_to_learn": [
#                 "Machine Learning",
#                 "Deep Learning",
#                 "Big Data Processing"
#             ]
#         }}
#         """

#         # Send prompt to Gemini AI
#         print("🔄 Sending request to Gemini AI...")
#         model = genai.GenerativeModel("gemini-1.5-pro")
#         response = model.generate_content(prompt)
#         raw_response_text = response.text
#         print("✅ Raw Response from Gemini:", raw_response_text)

#         # Extract JSON from possible Markdown code blocks
#         json_match = re.search(r'```json\n(.*?)\n```', raw_response_text, re.DOTALL)
#         cleaned_json_text = json_match.group(1) if json_match else raw_response_text

#         # Convert response text to JSON
#         try:
#             job_data = json.loads(cleaned_json_text)  # Ensure it's valid JSON
#             if "jobs" not in job_data or "future_opportunities" not in job_data or "skills_to_learn" not in job_data:
#                 raise ValueError("Invalid JSON structure: Missing required keys")
#         except json.JSONDecodeError:
#             return Response({"error": "Invalid response format from AI"}, status=500)
#         except ValueError as e:
#             return Response({"error": str(e)}, status=500)

#         print("✅ Successfully Parsed Job Data:", job_data)
#         return Response(job_data)  # Return structured JSON

#     except Exception as e:
#         print("❌ Unexpected Error:", e)
#         return Response({"error": str(e)}, status=500)





# from django.shortcuts import render

# # Create your views here.
# from django.http import JsonResponse

# def welcome(request):
#     return JsonResponse({"message": "Welcome to Django + React!"})




from rest_framework.decorators import api_view
from rest_framework.response import Response
import google.generativeai as genai
import json
import re

# Configure Gemini AI (Ensure API Key is set)
genai.configure(api_key="AIzaSyAG6nA3tCRem-qDahg2hEX7_vwoROsaTU0")

@api_view(['POST'])
def find_jobs(request):
    try:
        print("✅ Received raw data:", request.data)

        if not isinstance(request.data, dict):  
            return Response({"error": "Invalid data format. Expected a JSON object."}, status=400)

        data = request.data
        skills = data.get('skills', '')
        degree = data.get('degree', '')
        experience = data.get('experience', '')
        job_type = data.get('jobType', '')
        location = data.get('location', '')

        if not all([skills, degree, experience, job_type, location]):
            return Response({"error": "Missing required fields"}, status=400)

        # Strict JSON prompt
        prompt = f"""
        You are an AI assistant that generates structured job recommendations.
        Based on the user's details, generate a **strictly formatted JSON** response.

        User Details:
        - Skills: {skills}
        - Degree: {degree}
        - Experience Level: {experience}
        - Preferred Job Type: {job_type}
        - Location: {location}

        JSON Response Format (No extra text, markdown, or comments):
        {{
            "jobs": [
                {{"job_title": "Software Engineer", "required_skills": ["Python", "Django", "REST API"]}}
            ],
            "future_opportunities": ["Machine Learning Engineer", "Data Scientist", "AI Researcher"],
            "skills_to_learn": ["Machine Learning", "Deep Learning", "Big Data Processing"]
        }}
        Ensure the response is **only valid JSON** without extra formatting.
        """

        # Send request to Gemini AI
        print("🔄 Sending request to Gemini AI...")
        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt)
        
        # Debugging: Print full response object
        print("🔍 Full Gemini AI Response:", response)

        # Ensure response is valid
        if not response or not hasattr(response, 'text') or not response.text:
            return Response({"error": "Invalid response from AI"}, status=500)

        raw_response_text = response.text
        print("✅ Raw Response from Gemini:", raw_response_text)

        # Extract JSON using regex to avoid markdown formatting
        json_match = re.search(r'\{.*\}', raw_response_text, re.DOTALL)
        if not json_match:
            return Response({"error": "Invalid JSON format from AI"}, status=500)

        pure_json = json_match.group(0)  # Extract JSON portion
        print("🔍 Extracted JSON:", pure_json)

        # Parse JSON response
        try:
            job_data = json.loads(pure_json)  # Convert to Python dictionary
            if not isinstance(job_data, dict):
                raise ValueError("Invalid response format: Expected JSON object")

            # Ensure correct keys are present
            required_keys = {"jobs", "future_opportunities", "skills_to_learn"}
            if not required_keys.issubset(job_data.keys()):
                raise ValueError("Invalid JSON structure: Missing required keys")

        except json.JSONDecodeError:
            return Response({"error": "Failed to parse JSON from AI"}, status=500)
        except ValueError as e:
            return Response({"error": str(e)}, status=500)

        print("✅ Successfully Parsed Job Data:", json.dumps(job_data, indent=2))
        return Response(job_data)  # Return structured JSON

    except Exception as e:
        print("❌ Unexpected Error:", str(e))
        return Response({"error": str(e)}, status=500)
