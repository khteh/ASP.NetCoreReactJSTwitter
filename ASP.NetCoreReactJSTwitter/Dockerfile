FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
WORKDIR /src
COPY ["ASP.NetCoreReactJSTwitter/ASP.NetCoreReactJSTwitter.csproj", "ASP.NetCoreReactJSTwitter/"]
RUN dotnet restore "ASP.NetCoreReactJSTwitter/ASP.NetCoreReactJSTwitter.csproj"
COPY . .
WORKDIR "/src/ASP.NetCoreReactJSTwitter"
RUN dotnet build "ASP.NetCoreReactJSTwitter.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "ASP.NetCoreReactJSTwitter.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "ASP.NetCoreReactJSTwitter.dll"]