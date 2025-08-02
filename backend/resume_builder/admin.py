from django.contrib import admin
from .models import CandidateCV
from django.utils.html import format_html

# admin.site.register(CandidateCV)

@admin.register(CandidateCV)
class CandidateCVAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'created_at', 'view_cv', 'view_thumbnail', 'template_number')
    list_filter = ('created_at', 'gender', 'religion')
    search_fields = ('name', 'email', 'phone')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Personal Information', {
            'fields': (
                'candidate', 'name', 'title', 'email', 'phone',
                'gender', 'dob', 'address', 'religion', "template_number"
            )
        }),
        ('Skills & Experience', {
            'fields': ('skillset', 'experience'),
        }),
        ('Education', {
            'fields': ('education',),
        }),
        ('Documents', {
            'fields': ('cv_file', 'thumbnail'),
        }),
        ('System Fields', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def view_cv(self, obj):
        if obj.cv_file:
            return format_html(
                '<a href="{}" target="_blank">View CV</a>',
                obj.cv_file.url
            )
        return "No CV"
    view_cv.short_description = 'CV'

    def view_thumbnail(self, obj):
        if obj.thumbnail:
            return format_html(
                '<img src="{}" width="50" height="50" />',
                obj.thumbnail.url
            )
        return "No Thumbnail"
    view_thumbnail.short_description = 'Thumbnail'

    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }