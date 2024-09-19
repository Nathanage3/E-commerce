from core.views import LogoutView
from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static 
from django.urls import path, include
import debug_toolbar



urlpatterns = [
    path('admin/', admin.site.urls),
    path('__debug__/', include(debug_toolbar.urls)),
    path('course/', include('courses.urls')),  # Course-related endpoints
    path('store/', include('cart.urls')), # Cart-related endpoints
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
     path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)