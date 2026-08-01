@echo off
cd /d "%~dp0"
title Tarnished Together - LAN Host
npm run lan
if errorlevel 1 (
  echo.
  echo The LAN guide stopped because of an error.
  pause
)
