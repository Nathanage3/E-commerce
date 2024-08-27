from django.contrib import admin, messages
from django.db.models.aggregates import Count
from django.db.models.query import QuerySet
from django.utils.html import format_html, urlencode
from django.urls import reverse
from . import models


class CourseImageInLine(admin.TabularInline):
    model = models.CourseImage
    readonly_fields = ['thumbnail']

    def thumbnail(self, instance):
        if instance.image.name != '':
            return format_html(f'<img src="{instance.image.url}" class="thumbnail">')
        return ''


@admin.register(models.Course)
class CourseAdmin(admin.ModelAdmin):
    autocomplete_fields = ['collection']
    prepopulated_fields = {
        'slug': ['title']
    }
    list_display = ['title', 'price', 'collection_title']
    inlines = [CourseImageInLine]
    list_editable = ['price']
    list_filter = ['collection', 'last_update', 'rating']
    list_per_page = 10
    list_select_related = ['collection']
    search_fields = ['title']

    def collection_title(self, course):
        return course.collection.title

    class Media:
        css = {
            'all': ['courses/styles.css']
        }


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


@admin.register(models.Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'orders']

    list_per_page = 10
    list_select_related = ['user']
    ordering = ['user__first_name', 'user__last_name']
    search_fields = ['first_name__istartswith', 'last_name__istartswith']

    @admin.display(ordering='orders_count')
    def orders(self, customer):
        url = (
            reverse('admin:orders_order_changelist') # I have made some changes
            + '?'
            + urlencode({
                'customer__id': str(customer.id)
            }))
        return format_html('<a href="{}">{} Orders</a>', url, customer.orders_count)

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(
            orders_count=Count('order')
        )