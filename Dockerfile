FROM mcr.microsoft.com/dotnet/core/aspnet:latest
MAINTAINER Kok How, Teh <funcoolgeek@gmail.com>
ADD ASP.NetCoreReactJSTwitter/bin/Release/netcoreapp2.2/ubuntu.18.10-x64/publish/ app/
ENTRYPOINT ["dotnet", "app/ASP.NetCoreReactJSTwitter.dll"]
