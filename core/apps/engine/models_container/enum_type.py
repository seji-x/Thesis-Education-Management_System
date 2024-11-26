from enum import Enum


class EnumType(str, Enum):
    @classmethod
    def choices(cls):
        return tuple((x.value, x.name) for x in cls)

    @classmethod
    def list(cls):
        return list(map(lambda x: x.value, cls))

    def __str__(self):
        return self.value


class SystemRoleEnum(EnumType):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = 'ADMIN'
    USER = 'USER'


class EnumType(str, Enum):
    @classmethod
    def choices(cls):
        return tuple((x.value, x.name) for x in cls)

    @classmethod
    def list(cls):
        return list(map(lambda x: x.value, cls))

    def __str__(self):
        return self.value


class RoleTenantEnum(EnumType):
    MANAGER = 'MANAGER',
    NATION = 'NATION',
    DC = 'DC',
    QA = 'QA',


class RoleUserEnum(EnumType):
    ADMIN = 'ADMIN',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',


class GenderEnum(EnumType):
    MALE = 'MALE',
    FEMALE = 'FEMALE',
    OTHER = 'OTHER',


class DayOfWeekEnum(EnumType):
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY',


class StatusClassSubjectEnum(EnumType):
    ACTIVE = 'ACTIVE',
    CLOSED = 'CLOSED',


class StatusUserSubjectScoreEnum(EnumType):
    OPEN = 'OPEN',
    CONFIRM = 'CONFIRM',
