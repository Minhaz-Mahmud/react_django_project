from rest_framework.decorators import api_view
from rest_framework.response import Response
from registration.models import Candidate
from job_post.models import JobPost
import google.generativeai as genai
import json
import re
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from job_post.models import JobPost
from job_post.serializers import JobPostSerializer
from django.core.exceptions import ObjectDoesNotExist

try:
     genai.configure(api_key="AIzaSyCSqf0gQ_KHhilgKy74rNlCYkUYiRg1oUg")
except Exception as e:
    print(f"Gemini configuration failed: {str(e)}")

@api_view(['POST'])
def recommended_jobs(request):
    debug_info = {
        "prompt_sent": "",
        "gemini_response": "",
        "parsed_result": "",
        "candidate_skills": "",
        "jobs_count": 0
    }
    
    try:
        # 1. Get candidate skills from frontend request
        candidate_skills = request.data.get('skills', '')
        if not candidate_skills:
            return Response({
                "status": "error",
                "message": "No candidate skills provided",
                "recommended_ids": [],
                "debug": debug_info
            }, status=200)

        debug_info["candidate_skills"] = candidate_skills

        # 2. Get all jobs with tags
        jobs = JobPost.objects.filter(tags__isnull=False).values('id', 'tags', 'title')[:50]
        debug_info["jobs_count"] = len(jobs)
        
        if not jobs:
            return Response({
                "status": "error", 
                "message": "No jobs with tags found",
                "recommended_ids": [],
                "debug": debug_info
            }, status=200)

        # 3. Prepare the prompt
        prompt = f"""
        Analyze these job listings and recommend the best matches based on the candidate's skills and job tags.
        Return ONLY JSON in this format: {{"recommended_job_ids": [id1, id2, id3]}}

        Candidate Skills: {candidate_skills}

        Available Jobs (ID, Title, Tags):
        {json.dumps(list(jobs), indent=2)}
        """
        
        debug_info["prompt_sent"] = prompt
        print("=" * 80)
        print("PROMPT SENT TO GEMINI:")
        print("=" * 80)
        print(prompt)
        print("=" * 80)

        # 4. Call Gemini API with correct model
        try:
            model = genai.GenerativeModel("models/gemini-1.5-flash-latest")
            
            response = model.generate_content(
                prompt,
                generation_config={
                    "temperature": 0.3,
                    "max_output_tokens": 200,
                    "response_mime_type": "application/json"
                },
                safety_settings={
                    "HARM_CATEGORY_HARASSMENT": "BLOCK_NONE",
                    "HARM_CATEGORY_HATE_SPEECH": "BLOCK_NONE",
                    "HARM_CATEGORY_SEXUALLY_EXPLICIT": "BLOCK_NONE",
                    "HARM_CATEGORY_DANGEROUS_CONTENT": "BLOCK_NONE",
                }
            )

            # Handle response
            if not response.candidates:
                debug_info["gemini_response"] = "No candidates in response"
                raise ValueError("No candidates in response")
            
            candidate_response = response.candidates[0]
            if candidate_response.finish_reason != 1:  # FINISH_REASON_STOP
                debug_info["gemini_response"] = f"Response blocked. Finish reason: {candidate_response.finish_reason}"
                raise ValueError(f"Response blocked. Finish reason: {candidate_response.finish_reason}")

            response_text = "".join(part.text for part in candidate_response.content.parts)
            debug_info["gemini_response"] = response_text
            
            print("GEMINI RESPONSE:")
            print("=" * 80)
            print(response_text)
            print("=" * 80)
            
            # Parse response
            try:
                result = json.loads(response_text)
                debug_info["parsed_result"] = result
                
                if "recommended_job_ids" not in result:
                    raise ValueError("Missing recommended_job_ids in response")
                
                print("PARSED RESULT:")
                print("=" * 80)
                print(json.dumps(result, indent=2))
                print("=" * 80)
                
                return Response({
                    "status": "success",
                    "message": "Found personalized job recommendations for you!",
                    "recommended_ids": result["recommended_job_ids"],
                    "debug": debug_info
                })
            except json.JSONDecodeError as json_error:
                debug_info["parsed_result"] = f"JSON Parse Error: {str(json_error)}"
                print(f"JSON Parse Error: {str(json_error)}")
                raise ValueError("Invalid JSON response from Gemini")

        except Exception as e:
            debug_info["gemini_response"] = f"Gemini API Error: {str(e)}"
            print(f"Gemini API Error: {str(e)}")
            
            # Fallback to Python jobs (10-12) if available, otherwise first 3 jobs
            python_jobs = [job['id'] for job in jobs if job['id'] in [10, 11, 12]]
            fallback_ids = python_jobs[:3] if python_jobs else [job['id'] for job in jobs[:3]]
            
            return Response({
                "status": "partial",
                "message": f"Using fallback recommendations due to AI service issues",
                "recommended_ids": fallback_ids,
                "debug": debug_info
            })

    except Exception as e:
        debug_info["server_error"] = str(e)
        print(f"Server Error: {str(e)}")
        return Response({
            "status": "error",
            "message": f"Server error: {str(e)}",
            "recommended_ids": [],
            "debug": debug_info
        }, status=500)


# Additional endpoint to view debug information separately
@api_view(['GET'])
def debug_recommendations(request):
    """
    Dedicated endpoint for debugging - shows detailed information
    Usage: GET /api/debug-recommendations/
    """
    debug_info = {
        "timestamp": "",
        "jobs_sample": [],
        "system_info": {}
    }
    
    try:
        from datetime import datetime
        debug_info["timestamp"] = datetime.now().isoformat()
        
        # Get sample jobs
        jobs = JobPost.objects.filter(tags__isnull=False).values('id', 'tags', 'title')[:10]  # First 10 for preview
        debug_info["jobs_sample"] = list(jobs)
        
        # Get total counts
        total_jobs = JobPost.objects.filter(tags__isnull=False).count()
        
        debug_info["system_info"] = {
            "total_jobs_with_tags": total_jobs,
            "gemini_model": "models/gemini-1.5-flash-latest",
            "note": "Candidate skills are now sent from frontend"
        }
        
        return Response({
            "status": "success",
            "message": "Debug information retrieved",
            "debug": debug_info
        })
        
    except Exception as e:
        return Response({
            "status": "error",
            "message": f"Debug error: {str(e)}",
            "debug": debug_info
        }, status=500)

@api_view(['GET'])
def job_posts(request):
    try:
        ids_param = request.GET.get('ids', '')
        
        if ids_param:
            ids = [int(id.strip()) for id in ids_param.split(',') if id.strip().isdigit()]
            jobs = JobPost.objects.filter(id__in=ids).select_related('company')
        else:
            jobs = JobPost.objects.all().select_related('company')
        
        job_data = []
        for job in jobs:
            job_data.append({
                'id': job.id,
                'title': job.title,
                'company': {
                    'id': job.company.id,
                    'name': job.company.name,
                    'email': job.company.email
                },
                'job_location': job.job_location,
                'tags': job.tags,
                'job_type': job.job_type,
                'salary_range': job.salary_range,
                'job_time': job.job_time,
                'description': job.description,
                'active_recruiting': job.active_recruiting,
                'posted_at': job.posted_at,
                'updated_at': job.updated_at
            })
            
        return Response(job_data)
        
    except Exception as e:
        return Response({"error": str(e)}, status=500)