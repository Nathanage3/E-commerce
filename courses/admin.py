from django.contrib import admin, messages
from django.db.models.aggregates import Count
from django.db.models.query import QuerySet
from django.utils.html import format_html, urlencode
from django.urls import reverse
from . import models


class CourseImageInLine(admin.TabularInline):
    model = models.Course
    readonly_fields = ['thumbnail']

    def thumbnail(self, instance):
        if instance.image.name != '':
            return format_html(f'<img src="{instance.image.url}" class="thumbnail">')
        return ''


############## CourseAdmin Begin ##############

@admin.register(models.Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'price', 'rating', 'is_active')
    list_filter = ('instructor', 'is_active', 'level')
    search_fields = ('title', 'instructor__user__username', 'description')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('title',)
    readonly_fields = ('last_update',)
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'description', 'objectives', 'sections', 
                       'duration', 'image', 'preview', 'courseFor', 'price', 'oldPrice', 
                       'rating', 'currency', 'ratingCount', 'syllabus', 'prerequisites', 'is_active', 
                       'level', 'collection', 'promotions')
        }),
        ('Instructor Information', {
            'fields': ('instructor',)
        }),
    )

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(instructor=request.user)

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.instructor = request.user
        super().save_model(request, obj, form, change)

################## CourseAdmin End ##############

@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    autocomplete_fields = ['featured_course']
    list_display = ['title', 'course_count']
    search_fields = ['title']

    @admin.display(ordering='course_count')
    def course_count(self, collection):
        url = (
            reverse('admin:courses_course_changelist')
            + '?'
            + urlencode({
                'collection__id': str(collection.id)
            }))
        return format_html('<a href="{}">{} Courses</a>', url, collection.course_count)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            course_count=Count('courses')
        )


############### CustomerAdmin Begin ############

@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')
    ordering = ('user__first_name', 'user__last_name')

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            orders_count=Count('order')
        )

############### CustomerAdmin End ##############

############## InstructorEarningAdmin Begin ###########

@admin.register(models.InstructorEarnings)
class InstructorEarningsAdmin(admin.ModelAdmin):
    list_display = ('instructor', 'total_earnings', 'last_payout')
    search_fields = ('instructor__username',)
    ordering = ('instructor',)

############## InstructorEarningAddmin End ###########

@admin.register(models.Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order', 'is_active')
    list_filter = ('course', 'is_active')
    search_fields = ('title', 'course__title')
    ordering = ('order',)

    def course_title(self, obj):
        return obj.course.title
    course_title.admin_order_field = 'course'  # Allows column order sorting
    course_title.short_description = 'Course Title'


class OrderItemInline(admin.TabularInline):
    autocomplete_fields = ['course']
    min_num = 1
    max_num = 10
    model = models.OrderItem
    extra = 0


@admin.register(models.Order)
class OrderAdmin(admin.ModelAdmin):
    autocomplete_fields = ['customer']
    inlines = [OrderItemInline]
    list_display = ['id', 'placed_at', 'customer']
