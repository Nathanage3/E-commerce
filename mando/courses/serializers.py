from rest_framework import serializers
from .models import Collection, Promotion, Course, CourseProgress, \
  Review, Customer, InstructorEarnings, CourseImage


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ['id', 'title']


# class PromotionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Promotion
#         fields = ['id', 'description', 'discount']


class CourseSerializer(serializers.ModelSerializer):
    collection = CollectionSerializer(read_only=True)
    instructor = serializers.StringRelatedField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'price', 'rating',
        'instructor', 'syllabus', 'prerequisites',
        'collection']


class CourseProgressSerializer(serializers.ModelSerializer):
    course = serializers.StringRelatedField()
    student = serializers.StringRelatedField()

    class Meta:
        model = CourseProgress
        fields = ['id', 'student', 'course', 'completed', 'progress',
        'last_accessed']


class ReviewSerializer(serializers.ModelSerializer):
    course = serializers.StringRelatedField()

    class Meta:
        model = Review
        fields = ['id', 'course', 'rating', 'comment', 'created_at']

    def create(self, validated_data):
        course_id = self.context['course_id']
        return Review.objects.create(course_id=course_id, **validated_data)


class CustomerSerializer(serializers.ModelSerializer):
    #user = serializers.StringRelatedField()
    user_id = serializers.IntegerField()

    class Meta:
        model = Customer
        fields = ['id', 'user_id', 'role', 'bio', 'website']


class InstructorEarningsSerializer(serializers.ModelSerializer):
    #instructor = serializers.StringRelatedField()
    instructor_id = serializers.IntegerField()

    class Meta:
        model = InstructorEarnings
        fields = ['id', 'instructor_id', 'total_earnings', 'last_payout']


class CourseImageSerializer(serializers.ModelSerializer):
    course = serializers.StringRelatedField()

    class Meta:
        model = CourseImage
        fields = ['id', 'course', 'video']
