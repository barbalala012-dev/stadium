param([switch]$Release)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    throw 'JDK 17이 필요합니다. Android Studio의 내장 JDK 또는 JAVA_HOME을 설정해 주세요.'
}
if (-not (Get-Command gradle -ErrorAction SilentlyContinue)) {
    throw 'Gradle 8.9가 필요합니다. Android Studio에서 프로젝트를 열어 빌드하거나 Gradle 8.9를 PATH에 추가해 주세요.'
}
if ($Release) { & gradle :app:assembleRelease :app:lintRelease }
else { & gradle :app:assembleDebug :app:lintDebug }
if ($LASTEXITCODE -ne 0) { throw 'Android 빌드 실패: 위 오류를 확인하세요.' }
if (-not $Release) { Write-Host 'APK: app\build\outputs\apk\debug\app-debug.apk' }
