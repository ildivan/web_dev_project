from rest_framework.views import APIView
from rest_framework.response import Response

class HelloView(APIView):
    def post(self, request):
        name = request.data.get('name', 'default_name') 
        return Response({'message': f'Hello, {name}!'})


class PermissionsView(APIView):
    def get(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'detail': 'Authentication credentials were not provided.'}, status=401)

        # Get all permissions (user and group)
        permissions = user.get_all_permissions()
        return Response({'permissions': list(permissions)})
        