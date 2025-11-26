from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import requests
from .models import Weather
from .serializers import WeatherSerializer


class WeatherView(APIView):
    def get(self, request):
        city = request.query_params.get("city")
        print("City from query:", city)

        if not city:
            return Response(
                {"error": "City name is needed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            
            geo_url = (
                "https://geocoding-api.open-meteo.com/v1/search"
                f"?name={city}&count=1"
            )

            geo_res = requests.get(geo_url)
            print("Geocoding status:", geo_res.status_code)

            if geo_res.status_code != 200:
                return Response(
                    {"error": "Failed to fetch city data"},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            geo_data = geo_res.json()
            
            results = geo_data.get("results")
            if not results:
                return Response(
                    {"error": "City not found. Try another."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            city_data = results[0]
            latitude = city_data["latitude"]
            longitude = city_data["longitude"]
            city_name = city_data["name"]
           

            
            weather_url = (
                "https://api.open-meteo.com/v1/forecast"
                f"?latitude={latitude}&longitude={longitude}"
                "&current=temperature_2m,wind_speed_10m"
            )

            weather_res = requests.get(weather_url)
            print("Weather status:", weather_res.status_code)

            if weather_res.status_code != 200:
                return Response(
                    {"error": "Failed to fetch weather"},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            weather_data = weather_res.json()
            current = weather_data.get("current", {})

            temprature = current.get("temperature_2m")
            wind_speed = current.get("wind_speed_10m")

            
            record = Weather.objects.create(
                city=city_name,
                latitude=latitude,
                longitude=longitude,
                temprature=temprature,
                windspeed=wind_speed,
            )

            
            serializer = WeatherSerializer(record)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
