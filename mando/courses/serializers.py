from rest_framework import serializers
from .models import Collection, Promotion, Course, CourseProgress, \
  Review, Customer, InstructorEarnings, CourseImage, CourseVideo


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ['id', 'description', 'discount']


class CollectionSerializer(serializers.ModelSerializer):
    courses_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Collection
        fields = ['id', 'title', 'courses_count']


class CourseImageSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        course_id = self.context['course_id']
        return CourseImage.objects.create(course_id=course_id, **validated_data)

    class Meta:
        model = CourseImage
        fields = ['image']


class CourseVideoSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        course_id = self.context['course_id']
        return CourseVideo.objects.create(course_id=course_id, **validated_data)

    class Meta:
        model = CourseVideo
        fields = ['id', 'course', 'video']


class CourseSerializer(serializers.ModelSerializer):
    collection = CollectionSerializer(read_only=True)
    instructor = serializers.StringRelatedField()
    images = CourseImageSerializer(many=True, read_only=True)
    videos = CourseVideoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'price', 'oldPrice', 'currency',  'rating',
        'instructor', 'ratingCount', 'level', 'syllabus', 'prerequisites',
        'collection', 'images', 'videos'
        ]


class SimpleCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title']


class CourseProgressSerializer(serializers.ModelSerializer):
    course_id = serializers.IntegerField(write_only=True)
    #course = SimpleCourseSerializer(read_only=True)
    student_id = serializers.IntegerField()

    class Meta:
        model = CourseProgress
        fields = ['id', 'student_id', 'course_id', 'completed', 'progress', 'last_accessed']

    def create(self, validated_data):
        course_id = validated_data.pop('course_id')
        student_id = validated_data.pop('student_id')
        course_progress = CourseProgress.objects.create(
            course_id=course_id, 
            student_id=student_id,
            **validated_data
            )
        return course_progress


class ReviewSerializer(serializers.ModelSerializer):
    course = serializers.StringRelatedField()

    class Meta:
        model = Review
        fields = ['id', 'name', 'course', 'rating', 'comment', 'created_at']

    def create(self, validated_data):
        course_id = self.context['course_id']
        return Review.objects.create(course_id=course_id, **validated_data)


class CustomerSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField()

    class Meta:
        model = Customer
        fields = ['id', 'user_id', 'role', 'bio', 'website']


class InstructorEarningsSerializer(serializers.ModelSerializer):
    instructor_id = serializers.IntegerField()

    class Meta:
        model = InstructorEarnings
        fields = ['id', 'instructor_id', 'total_earnings', 'last_payout']

    def validate_instructor_id(self, value):
        if not InstructorEarnings.objects.filter(instructor_id=value).exists():
            raise serializers.ValidationError("Instructor earnings record does not exist.")
        return value
    