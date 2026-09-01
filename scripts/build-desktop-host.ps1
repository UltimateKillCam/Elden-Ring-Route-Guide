$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$packageRoot = Join-Path $projectRoot "work\webview2-build"
$packageVersion = "1.0.4129.50"
$packageZip = Join-Path $packageRoot "webview2.zip"
$packageFiles = Join-Path $packageRoot "pkg"
$output = Join-Path $projectRoot "desktop\runtime"

New-Item -ItemType Directory -Force -Path $packageRoot, $output | Out-Null
if (-not (Test-Path $packageFiles)) {
  Invoke-WebRequest "https://api.nuget.org/v3-flatcontainer/microsoft.web.webview2/$packageVersion/microsoft.web.webview2.$packageVersion.nupkg" -OutFile $packageZip
  Expand-Archive $packageZip -DestinationPath $packageFiles -Force
}

$framework = Join-Path $packageFiles "lib\net462"
$loader = Join-Path $packageFiles "runtimes\win-x64\native\WebView2Loader.dll"
$compiler = "$env:WINDIR\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$executable = Join-Path $output "Tarnished Together.exe"
& $compiler /nologo /target:winexe /platform:x64 /optimize+ /out:"$executable" /reference:System.dll /reference:System.Drawing.dll /reference:System.Windows.Forms.dll /reference:"$framework\Microsoft.Web.WebView2.Core.dll" /reference:"$framework\Microsoft.Web.WebView2.WinForms.dll" "$projectRoot\desktop\TarnishedTogetherHost.cs"
Copy-Item "$framework\Microsoft.Web.WebView2.Core.dll", "$framework\Microsoft.Web.WebView2.WinForms.dll", $loader -Destination $output -Force
Write-Host "Desktop host built at $executable"
