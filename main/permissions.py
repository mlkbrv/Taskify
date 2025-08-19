from rest_framework import permissions

class IsSenderOrRecipient(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user == obj.sender:
            return True
        if request.user == obj.recipient:
            if request.method in ['PATCH', 'GET']:
                return True
        return False