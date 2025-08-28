from rest_framework.permissions import BasePermission


class ModelOrObjectPermissions(BasePermission):
    """
    Base permission class that first checks model-level permissions.
    If the user doesn't have them, falls back to object-level permissions.
    """

    perms_map = {
        'GET': [],
        'OPTIONS': [],
        'HEAD': [],
        'POST': [],
        'PUT': ['change'],
        'PATCH': ['change'],
        'DELETE': ['delete'],
    }

    def has_permission(self, request, view):
        """
        Called for the initial check (before object is retrieved).
        Only relevant for model-level permissions, e.g. 'add_project'.
        """
        perms = self.perms_map.get(request.method, [])
        if not perms:
            return True 
        model_cls = view.queryset.model
        app_label = model_cls._meta.app_label
        model_name = model_cls._meta.model_name
        for perm in perms:
            codename = f"{app_label}.{perm}_{model_name}"
            if request.user.has_perm(codename):
                return True
        return True 

    def has_object_permission(self, request, view, obj):
        """
        Check model-level first, fallback to object-level.
        """
        perms = self.perms_map.get(request.method, [])
        if not perms:
            return True

        app_label = obj._meta.app_label
        model_name = obj._meta.model_name

        for perm in perms:
            codename = f"{app_label}.{perm}_{model_name}"
            if request.user.has_perm(codename):
                return True
            if request.user.has_perm(codename, obj):
                return True
        return False
