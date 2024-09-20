from pathlib import Path
import os
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-d3xp9rrm^qe-8x(-tg0xy@(xr0z+$!%j5bjtn+tx@2l)o0#e5e'

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = os.getenv("DJANGO_DEBUG", "False") == "True"
DEBUG = True

DJANGO_ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "mando.koyeb.app")
print(DJANGO_ALLOWED_HOSTS) 

ALLOWED_HOSTS = DJANGO_ALLOWED_HOSTS.split(",")

CORS_ALLOWED_ORIGINS = ['http://localhost:5173']

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'debug_toolbar',
    'corsheaders',
    'djoser',
    'core.apps.CoreConfig',
    'courses.apps.CoursesConfig',
    'notifications.apps.NotificationsConfig',
    'cart.apps.CartConfig',
    'orders.apps.OrdersConfig',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mando.urls'

INTERNAL_IPS = ["127.0.0.1"]

CORS_ALLOW_ALL_ORIGINS = True

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mando.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

import os
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME', 'bblxuvtp6yqwcc1moe53'),  # Database name from Clever Cloud
        'USER': os.getenv('DB_USER', 'uyoxfrz1edvkjufd'),  # Database username from Clever Cloud
        'PASSWORD': os.getenv('DB_PASSWORD', 'QV6yk3tRACkW2Q9yGUGY'),  # Database password from Clever Cloud
        'HOST': os.getenv('DB_HOST', 'bblxuvtp6yqwcc1moe53-mysql.services.clever-cloud.com'),  # Clever Cloud host
        'PORT': os.getenv('DB_PORT', '3306'),  # Port number for MySQL
    }
}



# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'core.User'

REST_FRAMEWORK = {
    'COERCE_DECIMAL_TO_STRING': False,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=2),
    'AUTH_HEADER_TYPES': ('JWT',),
    'BLACKLIST_AFTER_ROTATION': True,
}

DJOSER = {
    'SERIALIZERS': {
        'user_create': 'core.serializers.UserCreateSerializer',
        'current_user': 'core.serializers.UserSerializer',
    },
    'LOGIN_FIELD': 'email'
}

# Remove the limit on data upload size
DATA_UPLOAD_MAX_MEMORY_SIZE = None
