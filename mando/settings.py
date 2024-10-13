from pathlib import Path
import os
from datetime import timedelta

#load_dotenv() # Load environmental variables from the .env file

if os.getenv('DISABLE_COLLECTSTATIC'):
  COLLECT_STATIC = False

APPEND_SLASH=True
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-d3xp9rrm^qe-8x(-tg0xy@(xr0z+$!%j5bjtn+tx@2l)o0#e5e'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# DJANGO_ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "mando.koyeb.app")
# print(DJANGO_ALLOWED_HOSTS) 

# ALLOWED_HOSTS = DJANGO_ALLOWED_HOSTS.split(",")
ALLOWED_HOSTS = ['*']

#CORS_ALLOWED_ORIGINS = ['http://localhost:5173']
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'https://mando.koyeb.app',
    'https://mandotest.netlify.app'

]

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
    'notifications.apps.NotificationsConfig'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mando.urls'

INTERNAL_IPS = ["127.0.0.1"]

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
        'NAME': os.getenv('DB_NAME'),  # Database name from Clever Cloud
        'USER': os.getenv('DB_USER'),  # Database username from Clever Cloud
        'PASSWORD': os.getenv('DB_PASSWORD'),  # Database password from Clever Cloud
        'HOST': os.getenv('DB_HOST'),  # Clever Cloud host
        'PORT': os.getenv('DB_PORT'),  # Port number for MySQL
    }
}

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'mando_db',  # Database name from Clever Cloud
#         'USER': 'root',  # Database username from Clever Cloud
#         'PASSWORD': 'Password',  # Database password from Clever Cloud
#         'HOST': 'localhost',  # Clever Cloud host
#         'PORT': 3306,  # Port number fcreaor MySQL
#         'OPTIONS': {
#             'ssl': {'disabled': True},
#             },
#         }
# }




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
}

DJOSER = {
    'SERIALIZERS': {
        'user_create': 'core.serializers.UserCreateSerializer',
        'current_user': 'core.serializers.UserSerializer',
    },
    'LOGIN_FIELD': 'email'
}


DJOSER = {
    'USER_ID_FIELD': 'username',  # This should be 'username' if you're using it for authentication
    'SERIALIZERS': {
        'user_create': 'core.serializers.UserCreateSerializer',
        'user': 'core.serializers.UserSerializer',
        'current_user': 'core.serializers.UserSerializer',
        'set_username': 'core.serializers.SetUsernameSerializer',  # Make sure it's set
    },
}


# Remove the limit on data upload size
DATA_UPLOAD_MAX_MEMORY_SIZE = None

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'DEBUG',
    },
}
