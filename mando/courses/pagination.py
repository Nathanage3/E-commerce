from rest_framework.pagination import DefaultPagination

class DefaultPagination(PageNumberPagination):
  page_size = 10