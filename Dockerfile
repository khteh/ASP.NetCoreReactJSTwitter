FROM mcr.microsoft.com/dotnet/core/aspnet:2.2.4-bionic
MAINTAINER Kok How, Teh <funcoolgeek@gmail.com>
WORKDIR /app
ADD ASP.NetCoreReactJSTwitter/bin/Release/netcoreapp2.2/ubuntu.18.10-x64/publish/ .
EXPOSE 80 443
ENTRYPOINT ["dotnet", "ASP.NetCoreReactJSTwitter.dll"]
