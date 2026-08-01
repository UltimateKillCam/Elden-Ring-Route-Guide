@echo off
setlocal
net session >nul 2>&1
if not "%errorlevel%"=="0" (
  powershell -NoProfile -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
  exit /b
)

powershell -NoProfile -Command "$rule = Get-NetFirewallRule -DisplayName 'Tarnished Together LAN Guide' -ErrorAction SilentlyContinue; if ($rule) { $rule | Set-NetFirewallRule -Enabled True -Profile Private | Out-Null } else { New-NetFirewallRule -DisplayName 'Tarnished Together LAN Guide' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8787 -Profile Private | Out-Null }"

if errorlevel 1 (
  echo Could not update Windows Firewall.
) else (
  echo Tarnished Together is allowed on Private networks on TCP port 8787.
)
pause
