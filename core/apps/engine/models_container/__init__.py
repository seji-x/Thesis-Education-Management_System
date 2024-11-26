import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import UserManager, PermissionsMixin
from django.db import models

from core.apps.engine.models_container.models import User
from core.apps.engine.models_container.models import Class
from core.apps.engine.models_container.models import UserClass
from core.apps.engine.models_container.models import Subject
from core.apps.engine.models_container.models import UserSubjectScore
from core.apps.engine.models_container.models import Notification
from core.apps.engine.models_container.models import Document
